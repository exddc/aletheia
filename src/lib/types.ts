export interface DataPoint {
	time: number;
	cpm: number;
	inFlow: boolean;
}

export interface WordPerformance {
    word: string;
    avgCPM: number;
    performance: 'excellent' | 'good' | 'average' | 'slow';
}