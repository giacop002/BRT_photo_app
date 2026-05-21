import { writable, derived } from 'svelte/store';

// Internal state
const _ui = writable({
    // loading global
    loading: false,

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

        isCreatingSample: false,
        isEditingSample: false,

        isBatchCreating: false,

        isViewingSampleDetail: false,

        activeModal: null,

        overlayMessage: '',

        editingSampleId: null
    });
}

export function openCreateSample() {
    _ui.update(state => ({
        ...state,
        isCreatingSample: true,
        isEditingSample: false,
        editingSampleId: null
    }));
}

export function openEditSample(sampleId) {
    _ui.update(state => ({
        ...state,
        isCreatingSample: false,
        isEditingSample: true,
        editingSampleId: sampleId
    }));
}

export function closeSampleForm() {
    _ui.update(state => ({
        ...state,
        isCreatingSample: false,
        isEditingSample: false,
        editingSampleId: null
    }));
}

export function openBatchCreate() {
    _ui.update(state => ({
        ...state,
        isBatchCreating: true
    }));
}

export function closeBatchCreate() {
    _ui.update(state => ({
        ...state,
        isBatchCreating: false
    }));
}

export function openSampleDetail() {
    _ui.update(state => ({
        ...state,
        isViewingSampleDetail: true
    }));
}

export function closeSampleDetail() {
    _ui.update(state => ({
        ...state,
        isViewingSampleDetail: false
    }));
}