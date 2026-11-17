import {
  AirQualityData,
  DailyRoutinePlan,
  FamilyProfile,
  IndoorAirHack,
  ImpactCalculation,
  ChatMessage,
  CommunityReport,
} from '../types';

export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  data: T;
  message?: string;
  errors?: unknown;
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson.message) errorMsg = errorJson.message;
      } catch {
        // use default error message
      }
      throw new Error(errorMsg);
    }

    const json: ApiResponse<T> = await response.json();
    return json.data;
  }

  public async getAirQuality(city: string): Promise<AirQualityData> {
    return this.request<AirQualityData>(`/api/aqi?city=${encodeURIComponent(city)}`);
  }

  public async getHotspots(): Promise<Array<{ slug: string; city: string; country: string; basePm25: number }>> {
    return this.request<Array<{ slug: string; city: string; country: string; basePm25: number }>>('/api/aqi/hotspots');
  }

  public async generateRoutine(profile: FamilyProfile, locationName: string): Promise<DailyRoutinePlan> {
    return this.request<DailyRoutinePlan>('/api/routine/generate', {
      method: 'POST',
      body: JSON.stringify({ ...profile, locationName }),
    });
  }

  public async getIndoorHacks(category?: string): Promise<IndoorAirHack[]> {
    const query = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
    return this.request<IndoorAirHack[]>(`/api/indoor-hacks${query}`);
  }

  public async getIndoorHackById(id: string): Promise<IndoorAirHack> {
    return this.request<IndoorAirHack>(`/api/indoor-hacks/${encodeURIComponent(id)}`);
  }

  public async calculateImpact(params: ImpactCalculation['inputs']): Promise<ImpactCalculation> {
    return this.request<ImpactCalculation>('/api/impact/calculate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  public async askAssistant(message: string, location: string, familyContext?: string): Promise<{
    answer: string;
    groundedFacts: string[];
    actionPills: Array<{ label: string; action: string }>;
    safetyNotice: string;
  }> {
    return this.request<{
      answer: string;
      groundedFacts: string[];
      actionPills: Array<{ label: string; action: string }>;
      safetyNotice: string;
    }>('/api/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message, location, familyContext }),
    });
  }

  public async getCommunityData(): Promise<{
    reports: CommunityReport[];
    stats: {
      activePledges: number;
      woodStovesPaused: number;
      carpoolTripsUnified: number;
      estimatedParticulatePreventedKg: number;
    };
  }> {
    return this.request<{
      reports: CommunityReport[];
      stats: {
        activePledges: number;
        woodStovesPaused: number;
        carpoolTripsUnified: number;
        estimatedParticulatePreventedKg: number;
      };
    }>('/api/community/reports');
  }

  public async addCommunityReport(report: {
    neighborhood: string;
    type: CommunityReport['type'];
    details: string;
    severity: CommunityReport['severity'];
  }): Promise<CommunityReport> {
    return this.request<CommunityReport>('/api/community/reports', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  }

  public async upvoteCommunityReport(id: string): Promise<CommunityReport> {
    return this.request<CommunityReport>(`/api/community/reports/${encodeURIComponent(id)}/upvote`, {
      method: 'POST',
    });
  }

  public async joinCommunityPledge(type: 'wood_moratorium' | 'carpool' | 'sanctuary_host'): Promise<{
    activePledges: number;
    woodStovesPaused: number;
    carpoolTripsUnified: number;
    estimatedParticulatePreventedKg: number;
  }> {
    return this.request<{
      activePledges: number;
      woodStovesPaused: number;
      carpoolTripsUnified: number;
      estimatedParticulatePreventedKg: number;
    }>('/api/community/pledge', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }
}

export const apiClient = new ApiClient();
