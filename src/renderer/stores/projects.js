import { writable, derived, get } from 'svelte/store';

// Internal state
const _projects = writable({});
const _selectedProjectId = writable(null);

// Derived stores
export const projects = derived(_projects, ($projects) =>
    Object.values($projects)
);

export const selectedProject = derived(
    [_projects, _selectedProjectId],
    ([$projects, $selectedProjectId]) => {
        if (!$selectedProjectId) return null;
        return $projects[$selectedProjectId] ?? null;
    }
);

export const selectedProjectId = {
    subscribe: _selectedProjectId.subscribe
};

// Actions
export async function loadProjects() {
    const projectList = await window.api.getProjects();
    let projectMap = {};
    for (const project of projectList) {
        projectMap[project.id] = project;
    }
    _projects.set(projectMap);

    const currentSelectedId = get(_selectedProjectId);
    if (currentSelectedId && !projectMap[currentSelectedId]) {
        _selectedProjectId.set(null);
    }
}

export function selectProject(projectId) {
    const projectMap = get(_projects);
    if (!projectMap[projectId]) {
        console.warn(`Project with ID ${projectId} does not exist.`);
        return;
    }
    _selectedProjectId.set(projectId);
}

export async function createProject({
    name = 'New Project',
    code = 'NPR',
    description = ''
} = {}) {
    const newProjectId = await window.api.createProject({
        name,
        code,
        description
    });
    await loadProjects();
    selectProject(newProjectId);
    return newProjectId;
}

export async function updateProject(projectId, data) {
    await window.api.updateProject({
        project_id: projectId,
        ...data
    });

    await loadProjects();
}

export async function deleteProject(projectId) {
    await window.api.deleteProject(projectId);

    const currentSelectedId = get(_selectedProjectId);

    if (currentSelectedId === projectId) {
        _selectedProjectId.set(null);
    }

    await loadProjects();
}