import { writable, derived, get } from 'svelte/store';
import { setLoading } from '@S/ui';
import {
    probes,
    selectedProbe,
    selectedProbeId,
    selectProbe,
    loadProbes
} from '@S/probes';

// Internal state
const _samplesByProbe = writable({});
const _selectedSampleId = writable(null);

// Derived stores
export const samples = derived(
    [_samplesByProbe, selectedProbeId],
    ([$_samplesByProbe, $selectedProbeId]) => {
        if (!$selectedProbeId) return [];

        return Object.values(
            $_samplesByProbe[$selectedProbeId] ?? {}
        );
    }
);

export const selectedSample = derived(
    [samples, _selectedSampleId],
    ([$samples, $selectedSampleId]) => {
        if (!$selectedSampleId) return null;
        return $samples.find((sample) => sample.id === $selectedSampleId) ?? null;
    }
);

export const selectedSampleId = {
    subscribe: _selectedSampleId.subscribe
};

export const canExportSamples = derived(
    [samples, selectedProbeId],
    ([$samples, $selectedProbeId]) =>
        !!$selectedProbeId && $samples.length > 0
);

// Actions
export async function loadSamples(probeId = null) {
    const currentProbeId = probeId ?? get(selectedProbeId);

    if (!currentProbeId) {
        return;
    }

    setLoading(true, 'Loading samples...');

    const sampleList = await window.api.getSamplesByProbe(currentProbeId);

    const sampleMap = {};

    for (const sample of sampleList) {
        sampleMap[sample.id] = sample;
    }

    _samplesByProbe.update((state) => ({
        ...state,
        [currentProbeId]: sampleMap
    }));

    const currentSelectedSampleId =
        get(_selectedSampleId);

    if (
        currentSelectedSampleId &&
        !sampleMap[currentSelectedSampleId]
    ) {
        _selectedSampleId.set(null);
    }

    setLoading(false);
}

export async function createSample(sampleData) {
    const currentProbeId = sampleData.probe_id ?? get(selectedProbeId);

    if (!currentProbeId) {
        throw new Error('No probe selected');
    }

    await window.api.createSample({
        ...sampleData,
        probe_id: currentProbeId
    });

    setLoading(true, 'Creating sample...');
    await loadSamples(currentProbeId);
    setLoading(false);
}

export async function updateSample(sampleId, data) {
    await window.api.updateSample({
        sample_id: sampleId,
        ...data
    });

    const currentProbeId = get(selectedProbeId);

    setLoading(true, 'Updating sample...');
    await loadSamples(currentProbeId);
    setLoading(false);
}

export async function deleteSample(sampleId) {
    await window.api.deleteSample(sampleId);

    if (get(_selectedSampleId) === sampleId) {
        _selectedSampleId.set(null);
    }

    const currentProbeId = get(selectedProbeId);

    setLoading(true, 'Deleting sample...');
    await loadSamples(currentProbeId);
    setLoading(false);
}

export function selectSample(sampleId) {
    const currentSamples = get(samples);

    const exists =
        currentSamples.some(s => s.id === sampleId);

    if (!exists) {
        console.warn(
            `Sample with ID ${sampleId} does not exist`
        );
        return;
    }

    _selectedSampleId.set(sampleId);
}

export async function exportSampleToPdf(id) {
    const currentProbeId = get(selectedProbeId);
    const data = { sample_id: id, probe_id: currentProbeId };

    const result = await window.api.exportSample(data);

    if (result.canceled) return;
    if (result.success) {
        alert('Sample exported successfully');
        await window.api.refocusWindow();
    } else {
        alert('Failed to export sample: ' + result.error);
        await window.api.refocusWindow();
    }
}

export async function exportAllSamplesToPdf() {
    const currentProbeId = get(selectedProbeId);
    if (!currentProbeId) return;
    const currentSamples = get(samples);
    if (currentSamples.length === 0) {
      alert('No samples to export');
      return;
    }

    const result = await window.api.exportAllSamples(currentProbeId);
    if (result.canceled) return;
    if (result.success) {
      alert('Samples exported successfully');
      await window.api.refocusWindow();
    } else {
      alert('Failed to export samples: ' + result.error);
      await window.api.refocusWindow();
    }
  }