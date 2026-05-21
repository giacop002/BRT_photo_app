import { writable, derived, get } from 'svelte/store';
import {
    probes,
    selectedProbe,
    selectedProbeId,
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

export async function loadSamples(probeId = null) {
    const currentProbeId =
        probeId ?? get(selectedProbeId);

    if (!currentProbeId) {
        return;
    }

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

    await loadSamples(currentProbeId);
}

export async function updateSample(sampleId, data) {
    await window.api.updateSample({
        sample_id: sampleId,
        ...data
    });

    const currentProbeId = get(selectedProbeId);

    await loadSamples(currentProbeId);
}

export async function deleteSample(sampleId) {
    await window.api.deleteSample(sampleId);

    if (get(_selectedSampleId) === sampleId) {
        _selectedSampleId.set(null);
    }

    const currentProbeId = get(selectedProbeId);

    await loadSamples(currentProbeId);
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