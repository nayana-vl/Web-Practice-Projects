export interface Expenses {
  description: string;
  amount: string;
  date: string;
  time: string;
}

export class ExpenseData {
  static readonly defaultExpenses: Expenses[] = [
    {
      description: "Peanut butter",
      amount: "1578",
      date: "Sep 20, 2026",
      time: "02:46:58 PM"
    },
    {
      description: "Groceries",
      amount: "2450",
      date: "Sep 18, 2026",
      time: "10:15:32 AM"
    },
    {
      description: "Coffee",
      amount: "150",
      date: "Sep 15, 2026",
      time: "08:05:12 AM"
    },
    {
      description: "Bus fare",
      amount: "40",
      date: "Sep 12, 2026",
      time: "09:30:00 AM"
    },
    {
      description: "Lunch",
      amount: "320",
      date: "Sep 10, 2026",
      time: "01:00:45 PM"
    },
    {
      description: "Movie tickets",
      amount: "600",
      date: "Sep 5, 2026",
      time: "07:20:15 PM"
    },
    {
      description: "Electricity bill",
      amount: "1850",
      date: "Sep 1, 2026",
      time: "11:00:00 AM"
    },
    {
      description: "Internet bill",
      amount: "999",
      date: "Aug 28, 2026",
      time: "09:45:30 AM"
    },
    {
      description: "Gym membership",
      amount: "1200",
      date: "Aug 22, 2026",
      time: "06:30:00 AM"
    },
    {
      description: "Books",
      amount: "450",
      date: "Aug 18, 2026",
      time: "03:15:20 PM"
    },
    {
      description: "Taxi fare",
      amount: "280",
      date: "Aug 10, 2026",
      time: "10:05:00 PM"
    },
    {
      description: "Dinner",
      amount: "890",
      date: "Aug 5, 2026",
      time: "08:40:12 PM"
    },
    {
      description: "Phone recharge",
      amount: "299",
      date: "Jul 30, 2026",
      time: "12:10:45 PM"
    },
    {
      description: "Clothes shopping",
      amount: "2200",
      date: "Jul 22, 2026",
      time: "04:50:00 PM"
    },
    {
      description: "Medicines",
      amount: "560",
      date: "Jul 15, 2026",
      time: "05:25:33 PM"
    },
    {
      description: "Grocery shopping",
      amount: "1750",
      date: "Jul 8, 2026",
      time: "11:35:20 AM"
    },
    {
      description: "Fuel",
      amount: "1500",
      date: "Jun 28, 2026",
      time: "07:00:00 AM"
    },
    {
      description: "Streaming subscription",
      amount: "199",
      date: "Jun 20, 2026",
      time: "09:00:00 PM"
    },
    {
      description: "Haircut",
      amount: "350",
      date: "Jun 12, 2026",
      time: "02:20:10 PM"
    },
    {
      description: "Water bill",
      amount: "420",
      date: "Jun 3, 2026",
      time: "10:45:00 AM"
    }
  ];
}