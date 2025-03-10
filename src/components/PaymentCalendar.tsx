import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, DollarSign, AlertCircle, Clock, CheckCircle } from 'lucide-react';

type Order = {
  id: number;
  orderNumber: string;
  date: string;
  supplier: string;
  totalTTC: number;
  paymentDueDate: string;
  paymentStatus: 'non payé' | 'payé' | 'partiellement payé';
};

type Invoice = {
  id: number;
  invoiceNumber: string;
  date: string;
  orderId: number;
  amount: number;
  dueDate: string;
  paymentStatus: 'en attente' | 'payé' | 'partiellement payé';
};

type CalendarItem = {
  date: Date;
  type: 'order' | 'invoice';
  id: number;
  title: string;
  amount: number;
  status: string;
  isOverdue: boolean;
  isDueSoon: boolean;
};

type PaymentCalendarProps = {
  orders: Order[];
  invoices: Invoice[];
  onOrderClick: (orderId: number) => void;
  onInvoiceClick: (invoiceId: number) => void;
};

const PaymentCalendar: React.FC<PaymentCalendarProps> = ({
  orders,
  invoices,
  onOrderClick,
  onInvoiceClick
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
        id: order.id,
        title: `Commande ${order.orderNumber}`,
        amount: order.totalTTC,
        status: order.paymentStatus,
        isOverdue,
        isDueSoon
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
        id: invoice.id,
        title: `Facture ${invoice.invoiceNumber}`,
        amount: invoice.amount,
        status: invoice.paymentStatus,
        isOverdue,
        isDueSoon
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
  
  const handleItemClick = (item: CalendarItem) => {
    if (item.type === 'order') {
      onOrderClick(item.id);
    } else {
      onInvoiceClick(item.id);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Calendrier des Paiements</h2>
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              aria-label="Mois précédent"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToCurrentMonth}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              aria-label="Mois courant"
            >
              <Calendar size={20} />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              aria-label="Mois suivant"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex space-x-4">
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Total dû ce mois: </span>
              <span className="font-semibold text-gray-900 dark:text-white">{totalDueThisMonth.toFixed(2)} €</span>
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
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
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
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              {day !== null && (
                <>
                  <div className="text-right text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {day}
                  </div>
                  <div className="space-y-1">
                    {itemsByDay[day]?.map((item, itemIndex) => (
                      <div
                        key={`${item.type}-${item.id}-${itemIndex}`}
                        onClick={() => handleItemClick(item)}
                        className={`p-1 text-xs rounded cursor-pointer ${
                          item.isOverdue
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                            : item.isDueSoon
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                            : item.status === 'payé'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="truncate">{item.title}</span>
                          {item.isOverdue && <AlertCircle size={12} className="text-red-500 flex-shrink-0" />}
                          {item.isDueSoon && !item.isOverdue && <Clock size={12} className="text-yellow-500 flex-shrink-0" />}
                          {item.status === 'payé' && <CheckCircle size={12} className="text-green-500 flex-shrink-0" />}
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
      
      <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-100 dark:bg-red-900 mr-1"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">En retard</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-1"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Échéance proche</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900 mr-1"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Payé</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-1"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">À payer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCalendar;