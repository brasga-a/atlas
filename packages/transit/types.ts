import { SeverityState, TransitMode } from "./enums";

type Agency = {
    id: string;
    name: string;
    mode: TransitMode;
    source: string;
};

type Route = {
    id: string;
    agencyId: string;
    shortName: string;
    longName?: string;
    color?: string;
    mode: TransitMode;
};

type Stop = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    parentStationId?: string;
    accessible?: boolean;
};

type Vehicle = {
    id: string;
    routeId: string;
    tripId?: string;
    latitude: number;
    longitude: number;
    bearing?: number;
    observedAt: string;
};

type Arrival = {
    stopId: string;
    routeId: string;
    tripId?: string;
    scheduledAt: string;
    predictedAt?: string;
    observedAt?: string;
};

type ServiceAlert = {
    id: string;
    agencyId: string;
    title: string;
    description?: string;
    severity: SeverityState;
};

export { Agency, Arrival, Route, ServiceAlert, Stop, Vehicle };
