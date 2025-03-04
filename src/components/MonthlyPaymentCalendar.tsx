import React, { useState, useMemo } from 'react';
import { Order, Invoice } from '../types';
import { ChevronLeft, ChevronRight, Calendar, DollarSign, AlertCircle } from 'lucide-react';

type CalendarItem = {
  date: Date;
  type: 'order' | 'invoice';
  id: number;
  amount: number;
  title: string;
  status: string;
  isOverdue: boolean;
  isDueSoon: boolean;
};

type MonthlyPaymentCalendarProps = {
  orders: Order[];
  invoices: Invoice[];
  onItemClick: (type: 'order' | 'invoice', id: number) => void;
};

export const MonthlyPaymentCalendar: React.FC<MonthlyPaymentCalendarProps> = ({
  orders,
  invoices,
  onItemClick,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };
  
  const calendarItems = useMemo(() => {
    const today = new Date();
    const items: CalendarItem[] = [];
    
    // Add orders with payment due dates
    orders.forEach(order => {
      const dueDate = new Date(order.paymentDueDate);
      const isOverdue = dueDate < today && order.paymentStatus !== 'payé';
      
      // Calculate if due soon (within 7 days)
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isDueSoon = diffDays <= 7 && diffDays >= 0 && order.paymentStatus !== 'payé';
      
      items.push({
        date: dueDate,
        type: 'order',
        id: order.id || 0,
        amount: order.totalTTC,
        title: `Commande ${order.orderNumber}`,
        status: order.paymentStatus,
        isOverdue,
        isDueSoon,
      });
    });
    
    // Add invoices with due dates
    invoices.forEach(invoice => {
      const dueDate = new Date(invoice.dueDate);
      const isOverdue = dueDate < today && invoice.paymentStatus !== 'payé';
      
      // Calculate if due soon (within 7 days)
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isDueSoon = diffDays <= 7 && diffDays >= 0 && invoice.paymentStatus !== 'payé';
      
      items.push({
        date: dueDate,
        type: 'invoice',
        id: invoice.id || 0,
        amount: invoice.amount,
        title: `Facture ${invoice.invoiceNumber}`,
        status: invoice.paymentStatus,
        isOverdue,
        isDueSoon,
      });
    });
    
    return items;
  }, [orders, invoices]);
  
  // Filter items for the current month
  const currentMonthItems = useMemo(() => {
    return calendarItems.filter(item => {
      return (
        item.date.getMonth() === currentMonth.getMonth() &&
        item.date.getFullYear() === currentMonth.getFullYear()
      );
    });
  }, [calendarItems, currentMonth]);
  
  // Group items by day
  const itemsByDay = useMemo(() => {
    const days: { [key: number]: CalendarItem[] } = {};
    
    currentMonthItems.forEach(item => {
      const day = item.date.getDate();
      if (!days[day]) {
        days[day] = [];
      }
      days[day].push(item);
    });
    
    return days;
  }, [currentMonthItems]);
  
  // Generate calendar grid
  const calendarGrid = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    // Total days in the month
    const daysInMonth = lastDay.getDate();
    
    // Adjust for Monday as first day of week
    const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Create grid with empty cells for days before the first day of the month
    const grid: (number | null)[] = Array(adjustedFirstDayOfWeek).fill(null);
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push(i);
    }
    
    return grid;
  }, [currentMonth]);
  
  // Calculate total due this month
  const totalDueThisMonth = useMemo(() => {
    return currentMonthItems
      .filter(item => item.status !== 'payé')
      .reduce((sum, item) => sum + item.amount, 0);
  }, [currentMonthItems]);
  
  // Calculate overdue amount
  const overdueAmount = useMemo(() => {
    return currentMonthItems
      .filter(item => item.isOverdue)
      .reduce((sum, item) => sum + item.amount, 0);
  }, [currentMonthItems]);
  
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b dark:border-dark-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-dark-text">Calendrier des Paiements</h2>
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft size={20} className="dark:text-dark-text" />
            </button>
            <button
              onClick={goToCurrentMonth}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Calendar size={20} className="dark:text-dark-text" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronRight size={20} className="dark:text-dark-text" />
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium dark:text-dark-text">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex space-x-4">
            <div className="text-sm">
              <span className="text-gray-500 dark:text-dark-muted">Total dû ce mois: </span>
              <span className="font-semibold dark:text-dark-text">{totalDueThisMonth.toFixed(2)} €</span>
            </div>
            {overdueAmount > 0 && (
              <div className="text-sm">
                <span className="text-red-500">En retard: </span>
                <span className="font-semibold text-red-500">{overdueAmount.toFixed(2)} €</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Calendar header - days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-dark-muted">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarGrid.map((day, index) => (
            <div
              key={index}
              className={`min-h-24 p-1 border rounded ${
                day === null
                  ? 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800'
                  : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border'
              }`}
            >
              {day !== null && (
                <>
                  <div className="text-right text-sm font-medium mb-1 dark:text-dark-text">
                    {day}
                  </div>
                  <div className="space-y-1">
                    {itemsByDay[day]?.map((item, itemIndex) => (
                      <div
                        key={`${item.type}-${item.id}-${itemIndex}`}
                        onClick={() => onItemClick(item.type, item.id)}
                        className={`p-1 text-xs rounded cursor-pointer ${
                          item.isOverdue
                            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            : item.isDueSoon
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            : item.status === 'payé'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="truncate">{item.title}</span>
                          {item.isOverdue && <AlertCircle size={12} className="text-red-500 flex-shrink-0" />}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span>{item.amount.toFixed(2)} €</span>
                          <DollarSign size={12} className={
                            item.status === 'payé' 
                              ? 'text-green-500' 
                              : item.isOverdue 
                              ? 'text-red-500' 
                              : 'text-blue-500'
                          } />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};