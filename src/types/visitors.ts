export interface PreApproval {
  id: number;
  resident_id: number;
  visitor_name: string;
  arrival_time: string;
  departure_time: string | null;
  purpose: string | null;
  created_at: string;
  apartment_number: string;
}