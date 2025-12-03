export const calculateTMB = (weight: number, height: number, age: number, gender: string) => {
    if (gender === 'male') {
        return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
};

export const formatNumber = (num: number) => Math.round(num);

export const simulateWeightLoss = (
    startWeight: number,
    goalWeight: number,
    height: number,
    age: number,
    gender: string,
    activityLevel: number,
    weeklyPercent: number
) => {
    let currentWeight = startWeight;
    let currentWeek = 0;
    const data = [];

    const isGain = goalWeight > startWeight;

    while (
        (isGain ? currentWeight < goalWeight : currentWeight > goalWeight) &&
        currentWeek <= 104
        ) {
        const tmb = calculateTMB(currentWeight, height, age, gender);

        const weightChange = currentWeight * weeklyPercent;

        data.push({
            week: currentWeek,
            peso: parseFloat(currentWeight.toFixed(1)),
            metabolismo: Math.round(tmb),
        });

        if (isGain) {
            currentWeight += weightChange;
        } else {
            currentWeight -= weightChange;
        }

        currentWeek++;
    }

    if (data.length > 0) {
        const finalTmb = calculateTMB(currentWeight, height, age, gender);
        data.push({
            week: currentWeek,
            peso: parseFloat(currentWeight.toFixed(1)),
            metabolismo: Math.round(finalTmb),
        });
    }

    return data;
};