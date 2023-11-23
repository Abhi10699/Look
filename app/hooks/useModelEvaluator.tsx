// model evaluation hook

type PrecisionRecallPoints = {
  precision: number;
  recall: number;
};

export const useModelEvaluator = () => {
  const calculatePrecisionRecall = (
    predictions: Array<number>,
    labels: Array<number>
  ) => {
    let truePositives = 0;
    let falsePositives = 0;
    let falseNegatives = labels.reduce((prev, curr) => prev + curr, 0);

    const precisionRecallPoints: Array<PrecisionRecallPoints> = [];
    const predictionsSorted = predictions.sort((a, b) => b - a); // sort in descending order

    predictionsSorted.forEach((prediction) => {
      if (prediction > 0.5) {
        // assume its a hit
        truePositives += 1;
        falseNegatives -= 1;
      }

      precisionRecallPoints.push({
        precision: truePositives / (truePositives + falsePositives + 1e-10),
        recall: truePositives / (truePositives + falseNegatives + 1e-10),
      });
    });

    return precisionRecallPoints;
  };

  const calculateAveragePrecision = (
    precisionRecallPoints: Array<PrecisionRecallPoints>
  ) => {
    let averagePrecision = 0;
    let previousRecall = 0;

    precisionRecallPoints.forEach(({ precision, recall }) => {
      averagePrecision += precision * (recall - previousRecall);
      previousRecall = recall;
    });

    return averagePrecision;
  };

  const computeModelScore = (
    predictions: Array<number>,
    labels: Array<number>
  ) => {
    const precisionRecallPoints = calculatePrecisionRecall(predictions, labels);
    const averagePrecision = calculateAveragePrecision(precisionRecallPoints);
    return averagePrecision;
  };

  return {
    calculateAveragePrecision,
    calculatePrecisionRecall,
    computeModelScore,
  };
};
