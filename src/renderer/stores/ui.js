import { writable, derived } from 'svelte/store';

// Internal state
const _ui = writable({
    // loading global
    loading: false,

    // project detail
    isEditingProject: false,

    // sample form
    isCreatingSample: false,
    isEditingSample: false,

    // batch import
    isBatchCreating: false,

    // detail panel
    isViewingSampleDetail: false,

    // dialogs
    activeModal: null,

    // overlays
    overlayMessage: '',

    // temporary ids
    editingSampleId: null
});

// Public store
export const ui = {
    subscribe: _ui.subscribe
};

// Derived
export const sampleFormOpen = derived(
    ui,
    ($ui) =>
        $ui.isCreatingSample ||
        $ui.isEditingSample
);

export const currentMode = derived(
    ui,
    ($ui) => {
        if ($ui.isEditingSample) return 'edit';
        if ($ui.isCreatingSample) return 'create';
        if ($ui.isViewingSampleDetail) return 'detail';
        if ($ui.isBatchCreating) return 'batch';
        if ($ui.isEditingProject) return 'project';

        return 'list';
    }
);

// Generic setters
export function setLoading(value, message = '') {
    _ui.update(state => ({
        ...state,
        loading: value,
        overlayMessage: value ? message : ''
    }));
}

export function resetUI() {
    _ui.set({
        loading: false,

        isEditingProject: false,

        isCreatingSample: false,
        isEditingSample: false,

        isBatchCreating: false,

        isViewingSampleDetail: false,

        activeModal: null,

        overlayMessage: '',

        editingSampleId: null
    });
}

export function openProjectEdit() {
    resetUI();
    _ui.update(state => ({
        ...state,
        isEditingProject: true
    }));
}

export function closeProjectEdit() {
    resetUI();
    _ui.update(state => ({
        ...state,
        isEditingProject: false
    }));
}

export function openCreateSample() {
    resetUI();
    _ui.update(state => ({
        ...state,
        isCreatingSample: true
    }));
}

export function openEditSample(sampleId) {
    resetUI();
    _ui.update(state => ({
        ...state,
        isEditingSample: true,
        editingSampleId: sampleId
    }));
}

export function closeSampleForm() {
    resetUI();
    _ui.update(state => ({
        ...state,
        isCreatingSample: false,
        isEditingSample: false,
        editingSampleId: null
    }));
}

export function openBatchCreate() {
    resetUI();
    _ui.update(state => ({
        ...state,
        isBatchCreating: true
    }));
}

export function closeBatchCreate() {
    resetUI();
    _ui.update(state => ({
        ...state,
        isBatchCreating: false
    }));
}

export function openSampleDetail() {
    resetUI();
    _ui.update(state => ({
        ...state,
        isViewingSampleDetail: true
    }));
}

export function closeSampleDetail() {
    resetUI();
    _ui.update(state => ({
        ...state,
        isViewingSampleDetail: false
    }));
}