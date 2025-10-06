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

export type Key = {
    code: string;
    label: string;
    shiftLabel?: string;
    size?: number;
    align?: 'left' | 'right' | 'center';
    symbol?: string;
};