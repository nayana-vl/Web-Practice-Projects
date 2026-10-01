export interface Expenses {
  items: string;
  tags: string;
  amount: string;
  date: string;
  time: string;
}

export class ExpenseData {
  static readonly defaultExpenses: Expenses[] = [
    {
      items: "Peanut butter",
      tags: "Groceries",
      amount: "1578",
      date: "Sep 20, 2026",
      time: "02:46:58 PM"
    },
    {
      items: "Groceries",
      tags: "Groceries",
      amount: "2450",
      date: "Sep 18, 2026",
      time: "10:15:32 AM"
    },
    {
      items: "Coffee",
      tags: "Food",
      amount: "150",
      date: "Sep 15, 2026",
      time: "08:05:12 AM"
    },
    {
      items: "Bus fare",
      tags: "Transport",
      amount: "40",
      date: "Sep 12, 2026",
      time: "09:30:00 AM"
    },
    {
      items: "Lunch",
      tags: "Food",
      amount: "320",
      date: "Sep 10, 2026",
      time: "01:00:45 PM"
    },
    {
      items: "Movie tickets",
      tags: "Entertainment",
      amount: "600",
      date: "Sep 5, 2026",
      time: "07:20:15 PM"
    },
    {
      items: "Electricity bill",
      tags: "Utilities",
      amount: "1850",
      date: "Sep 1, 2026",
      time: "11:00:00 AM"
    },
    {
      items: "Internet bill",
      tags: "Utilities",
      amount: "999",
      date: "Aug 28, 2026",
      time: "09:45:30 AM"
    },
    {
      items: "Gym membership",
      tags: "Fitness",
      amount: "1200",
      date: "Aug 22, 2026",
      time: "06:30:00 AM"
    },
    {
      items: "Books",
      tags: "Education",
      amount: "450",
      date: "Aug 18, 2026",
      time: "03:15:20 PM"
    },
    {
      items: "Taxi fare",
      tags: "Transport",
      amount: "280",
      date: "Aug 10, 2026",
      time: "10:05:00 PM"
    },
    {
      items: "Dinner",
      tags: "Food",
      amount: "890",
      date: "Aug 5, 2026",
      time: "08:40:12 PM"
    },
    {
      items: "Phone recharge",
      tags: "Utilities",
      amount: "299",
      date: "Jul 30, 2026",
      time: "12:10:45 PM"
    },
    {
      items: "Clothes shopping",
      tags: "Shopping",
      amount: "2200",
      date: "Jul 22, 2026",
      time: "04:50:00 PM"
    },
    {
      items: "Medicines",
      tags: "Health",
      amount: "560",
      date: "Jul 15, 2026",
      time: "05:25:33 PM"
    },
    {
      items: "Grocery shopping",
      tags: "Groceries",
      amount: "1750",
      date: "Jul 8, 2026",
      time: "11:35:20 AM"
    },
    {
      items: "Fuel",
      tags: "Fuel",
      amount: "1500",
      date: "Jun 28, 2026",
      time: "07:00:00 AM"
    },
    {
      items: "Streaming subscription",
      tags: "Entertainment",
      amount: "199",
      date: "Jun 20, 2026",
      time: "09:00:00 PM"
    },
    {
      items: "Haircut",
      tags: "Personal Care",
      amount: "350",
      date: "Jun 12, 2026",
      time: "02:20:10 PM"
    },
    {
      items: "Water bill",
      tags: "Utilities",
      amount: "420",
      date: "Jun 3, 2026",
      time: "10:45:00 AM"
    }
  ];
}