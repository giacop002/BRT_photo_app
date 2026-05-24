import { writable, derived, get } from 'svelte/store';
import {
    projects,
    selectedProject,
    selectedProjectId,
    createProject
} from '@S/projects';

// Internal state
const _probesByProject = writable({});
const _selectedProbeId = writable(null);

const unsubsribeSelectedProject = selectedProjectId.subscribe(() => {
    _selectedProbeId.set(null);
});

// Derived stores
export const probes = derived(
    [_probesByProject, selectedProjectId],
    ([$_probesByProject, $selectedProjectId]) => {
        if (!$selectedProjectId) return [];

        const projectProbes = $_probesByProject[$selectedProjectId] ?? {};

        return Object.values(projectProbes);
    }
);

export const selectedProbe = derived(
    [probes, _selectedProbeId],
    ([$probes, $selectedProbeId]) => {
        if (!$selectedProbeId) return null;
        return $probes.find((probe) => probe.id === $selectedProbeId) ?? null;
    }
);

export const selectedProbeId = {
    subscribe: _selectedProbeId.subscribe
};

// Actions
export async function loadProbes() {
    const projectList = get(projects);
    if (!projectList.length) {
        _probesByProject.set({});
        return;
    }
    let probeMap = {};
    for (const project of projectList) {
        const projectProbes =
            await window.api.getProbes(project.id);

        probeMap[project.id] = {};

        for (const probe of projectProbes) {
            probeMap[project.id][probe.id] = probe;
        }
    }
    _probesByProject.set(probeMap);

    const currentProbeId = get(_selectedProbeId);

    if (currentProbeId) {
        const currentProjectId = get(selectedProjectId);

        const currentProjectProbes = probeMap[currentProjectId] ?? {};

        if (!currentProjectProbes[currentProbeId]) {
            _selectedProbeId.set(null);
        }
    }
}

export async function createProbeToNewProject({ name }) {
    let newProjectId = await createProject({ name: 'New Project', code: 'NPR', description: '' });
    const probeId = await window.api.createProbe({
        project_id: newProjectId,
        name
    });

    await loadProbes();
    selectProbe(probeId);
    return probeId;
}

export async function createProbeToProject({ name, project_id }) {
    const probeId =
        await window.api.createProbe({
            project_id,
            name
        });

    await loadProbes();
    selectProbe(probeId);
    return probeId;
}


export async function updateProbe(probeId, data) {
    await window.api.updateProbe({
        probe_id: probeId,
        ...data
    });

    await loadProbes();
}

export async function deleteProbe(probeId) {
    await window.api.deleteProbe(probeId);

    if (get(_selectedProbeId) === probeId) {
        _selectedProbeId.set(null);
    }

    await window.api.refocusWindow();
    await loadProbes();
}

export function selectProbe(probeId) {
    const currentProbes = get(probes);

    const exists =
        currentProbes.some(p => p.id === probeId);

    if (!exists) {
        console.warn(
            `Probe with ID ${probeId} does not exist`
        );
        return;
    }

    _selectedProbeId.set(probeId);
}