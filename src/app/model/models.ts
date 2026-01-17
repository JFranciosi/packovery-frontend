export interface Signal {
    id: string; // Order ID
    alertId: string;
    description: string; // e.g., "Segnale GPS interrotto"
    time: string; // e.g., "00:30"
    type: 'gps' | 'delay' | 'other';
}

export interface Order {
    id: string;
    status: string;
    origin: string;
    destination: string;
    date: string;
    weight: string;
    size: string;
}

export interface Alert {
    id: string;
    name: string;
    createdDate: string;
    type: string;
    threshold: string;
    status: 'Attivo' | 'Non attivo';
}
