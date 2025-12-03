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

    // Detecta se é Ganho (Bulking) ou Perda (Cutting)
    const isGain = goalWeight > startWeight;

    // Limite de segurança: 104 semanas (2 anos)
    // A condição do loop agora verifica as duas direções
    while (
        (isGain ? currentWeight < goalWeight : currentWeight > goalWeight) &&
        currentWeek <= 104
        ) {
        const tmb = calculateTMB(currentWeight, height, age, gender);

        // Cálculo da mudança baseada na porcentagem do peso ATUAL
        const weightChange = currentWeight * weeklyPercent;

        data.push({
            week: currentWeek,
            peso: parseFloat(currentWeight.toFixed(1)),
            metabolismo: Math.round(tmb),
        });

        // Se for ganho, soma. Se for perda, subtrai.
        if (isGain) {
            currentWeight += weightChange;
        } else {
            currentWeight -= weightChange;
        }

        currentWeek++;
    }

    // Adiciona o ponto final para o gráfico fechar bonito na meta
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