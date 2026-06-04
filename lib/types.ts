export interface Event {
  id: string;
  name: string;
  event_date: string | null;
  attendance_estimate: number;
}

export interface Stall {
  id: string;
  event_id: string;
  name: string;
  item_cost: number;
  selling_price: number;
  quantity: number;
  notes?: string | null;
}

export interface Expense {
  id: string;
  event_id: string;
  category: string;
  description: string;
  budgeted: number;
  actual: number;
}

export interface Supplier {
  id: string;
  event_id: string;
  name: string;
  contact: string;
  notes?: string | null;
}

export interface Purchase {
  id: string;
  event_id: string;
  supplier_id: string | null;
  item_name: string;
  budgeted: number;
  actual: number;
  quantity: number;
  stock_on_hand: number;
  purchased: boolean;
}

export interface TicketSales {
  id: string;
  event_id: string;
  adult_count: number;
  adult_price: number;
  family_count: number;
  family_price: number;
  child_count: number;
  child_price: number;
  raffle_count: number;
  raffle_price: number;
  donations: number;
}

export interface Volunteer {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  notes?: string | null;
}

export interface VolunteerShift {
  id: string;
  event_id: string;
  volunteer_id: string;
  stall_or_area: string;
  shift_start: string;
  shift_end: string;
  notes?: string | null;
}

export interface AppData {
  event: Event;
  stalls: Stall[];
  expenses: Expense[];
  suppliers: Supplier[];
  purchases: Purchase[];
  ticketSales: TicketSales;
  volunteers: Volunteer[];
  shifts: VolunteerShift[];
}

export interface StallMetrics {
  id: string;
  name: string;
  revenue: number;
  cost: number;
  profit: number;
  marginPercent: number;
  units: number;
}

export interface DashboardSummary {
  expectedRevenue: number;
  expectedExpenses: number;
  projectedProfit: number;
  attendanceEstimate: number;
  stallRevenue: number;
  ticketRevenue: number;
  donationTotal: number;
  topStalls: StallMetrics[];
  marginPercent: number;
}
