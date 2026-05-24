import { writable, derived, get } from 'svelte/store';
import { openBatchCreate, closeBatchCreate, setLoading } from '@S/ui';
import { selectedProbeId } from '@S/probes';
import { samples, loadSamples, createSample } from '@S/samples';

import getBaseMetadata from '@/utils/getBaseMetadata';


// Public stores
export const batchSamples = writable([]);
export const selectedSampleIndex = writable(0);
export const batchDate = writable('');

export const selectedSample = derived(
    [batchSamples, selectedSampleIndex],
    ([$batchSamples, $selectedSampleIndex]) =>
        $batchSamples[$selectedSampleIndex] ?? null
);

// Actions
export async function startBatchCreate() {
    const files = await window.api.selectImageFiles();

    if (!files.length) return;

    files.sort();
    batchSamples.set(buildBatchSamples(files));
    selectedSampleIndex.set(0);
    openBatchCreate();
}

export function updateBatchSample(index, data) {
    batchSamples.update(batch =>
        batch.map((sample, i) =>
            i === index
                ? { ...sample, ...data }
                : sample
        )
    );
}

export async function saveBatch() {
    if (propagateDepthChange()) {
        alert('Depth intervals automatically adjusted.')
        return;
    }
    const currentBatch = get(batchSamples);
    setLoading(true, 'Creating batch samples...');

    await createBatchSamples(currentBatch);

    batchSamples.set([]);
    selectedSampleIndex.set(0);
    batchDate.set('');
    closeBatchCreate();
    setLoading(false);
}

export function cancelBatch() {
    batchSamples.set([]);
    selectedSampleIndex.set(0);
    batchDate.set('');
    closeBatchCreate();
}

export function selectBatchSample(index) {
    propagateDepthChange();
    selectedSampleIndex.set(index);
}

// Private
function buildBatchSamples(files) {
    let _, meta = getBaseMetadata(get(samples));
    batchDate.set(meta.sample_date);
    const generatedSamples = files.map((file, index) => ({
        temp_id: `batch-${index}`,
        file_path: file,
        depth_from: meta.depth_from + index,
        depth_to: meta.depth_from + index + 1,
        cropped_image: null,
        edited: false,
    }));
    return generatedSamples;
}

async function createBatchSamples(batch) {
    const currentProbeId = get(selectedProbeId);
    if (!currentProbeId) return;

    try {
        for (const sample of batch) {
            const { file_path, cropped_image, ...rest } = sample;

            const sampleData = {
                ...rest,
                probe_id: currentProbeId,
                image_path: file_path,
                // cropped_image
            };

            await createSample(sampleData);
        }
    }
    catch (err) {
        console.error(err);
        alert('Failed to import batch samples');
    }
    finally {
        await loadSamples();
    }
}

function propagateDepthChange() {
    let detectedChange = false;
    const currentBatch = get(batchSamples);
    const currentSample = get(selectedSample);
    const currentSampleIndex = get(selectedSampleIndex);
    if (currentSample.depth_to < currentSample.depth_from) {
        currentSample.depth_to = currentSample.depth_from + 1;
    }
    for (let i = 0; i < currentBatch.length; i++) {
        if (i <= currentSampleIndex) continue;
        const sample = currentBatch[i];
        if (sample.depth_from < currentSample.depth_to) {
            detectedChange = true;
            sample.depth_from = currentSample.depth_to + (i - currentSampleIndex - 1);
            sample.depth_to = sample.depth_from + 1;
        }
    }
    batchSamples.set([...currentBatch]);
    return detectedChange;
}
