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

export interface Comune {
    nome: string;
    codice: string;
    zona: { nome: string; codice: string };
    regione: { nome: string; codice: string };
    provincia: { nome: string; codice: string };
    sigla: string;
    codiceCatastale: string;
    cap: string[];
    popolazione: number;
}

export interface OrderResponse {
    id: string;
    trackingCode: string;
    status: string;
    plannedDeliveryTime: string;
    actualDeliveryTime?: string;
    deliveryDelay?: any; // Duration format might vary
    priorityLevel: string;
    packageSize: string;
    packageWeight: string;
    oversize: boolean;
    overWeight: boolean;
    actualSize?: number;
    actualWeight?: number;
    departureLocation: string | null;
    deliveryLocation: string | null;
    createdBy?: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export interface MapGpsData {
    orderId: string;
    rider: string | null;
    riderLatitude: number | null;
    riderLongitude: number | null;
    positionTimestamp: string | null;
    pickupLatitude: number | null;
    pickupLongitude: number | null;
    deliveryLatitude: number | null;
    deliveryLongitude: number | null;
    distanceTraveled: number | null;
}

export interface OrderDetailsResponse {
    order: OrderResponse;
    mapGps: MapGpsData;
}

export interface FilterOrderRequest {
    id?: string;
    status?: string;
    departureLocation?: string;
    deliveryLocation?: string;
    orderCreationDate?: string;
    weight?: string;
    size?: string;
}
export interface AlertRequest {
    alertName: string;
    alertTypology: string;
    alertDescription: string;
    alertStatus: boolean;
    alertTheshold: number;
}

export interface AlertResponse {
    id: number;
    alertName: string;
    alertTypology: string;
    alertDescription: string;
    alertStatus: boolean;
    alertCreatedDate: string;
    alertTheshold: number;
}


export interface SelectOptionsResponse {
    orderStatuses?: string[];
    packageScales?: string[];
    alertTypologies?: string[];
}

export interface UserResponse {
    id: string;
    name: string;
    surname: string;
    email?: string;
}

export interface ReportResponse {
    id: number;
    orderId: string;
    alertId: number;
    alertTypology: string;
    alertName: string;
    issueActivatedTime: string;
    issueResolvedTime: string | null;
    issueResolution: string;
    resolutionDescription: string | null;
    resolvedById: number | null;
    resolvedByEmail: string | null;
    resolved: boolean;
}


