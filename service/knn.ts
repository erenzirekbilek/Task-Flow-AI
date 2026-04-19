export interface DataPoint {
  id: string;
  features: number[];
  label: string;
}

export interface KNNResult {
  label: string;
  distance: number;
  neighbors: { label: string; distance: number }[];
}

export class KNNClassifier {
  private data: DataPoint[] = [];
  private k: number = 5;
  private metric: 'euclidean' | 'manhattan' | 'cosine' = 'euclidean';

  constructor(k: number = 5, metric: 'euclidean' | 'manhattan' | 'cosine' = 'euclidean') {
    this.k = k;
    this.metric = metric;
  }

  add(point: DataPoint): void {
    this.data.push(point);
  }

  train(): void {}

  predict(features: number[]): KNNResult {
    const distances = this.data.map(point => ({
      id: point.id,
      label: point.label,
      distance: this.distance(features, point.features),
    }));

    distances.sort((a, b) => a.distance - b.distance);
    const neighbors = distances.slice(0, this.k);

    const labelCounts = new Map<string, number>();
    neighbors.forEach(n => {
      labelCounts.set(n.label, (labelCounts.get(n.label) || 0) + 1);
    });

    let bestLabel = '';
    let bestCount = 0;
    labelCounts.forEach((count, label) => {
      if (count > bestCount) {
        bestCount = count;
        bestLabel = label;
      }
    });

    return {
      label: bestLabel,
      distance: neighbors[0]?.distance || 0,
      neighbors: neighbors.map(n => ({ label: n.label, distance: n.distance })),
    };
  }

  private distance(a: number[], b: number[]): number {
    if (this.metric === 'manhattan') {
      return a.reduce((sum, val, i) => sum + Math.abs(val - b[i]), 0);
    } else if (this.metric === 'cosine') {
      const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return 1 - dot / (magA * magB);
    } else {
      return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
    }
  }
}