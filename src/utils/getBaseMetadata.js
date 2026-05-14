function getToday() {
    return new Date().toISOString().slice(0, 10);
}

export default function getBaseMetadata(samples) {
    let depth_from, sample_date;
    if (samples.length === 0) {
            depth_from = 0;
            sample_date = getToday();
        } else {
            const maxSample = samples.reduce((max, s) => {
                const to = s.depth_to ?? 0;
                return to > (max.depth_to ?? 0) ? s : max;
            }, samples[0]);

            depth_from = maxSample.depth_to ?? 0;
            const latestSample = samples.reduce((latest, s) => {
                if (!s.sample_date) return latest;
                if (!latest) return s;
                return new Date(s.sample_date) > new Date(latest.sample_date) ? s : latest;
            }, null);

            sample_date = latestSample?.sample_date
                ? latestSample.sample_date.slice(0, 10)
                : new Date().toISOString().slice(0, 10);
        }
    return { depth_from, sample_date };
}