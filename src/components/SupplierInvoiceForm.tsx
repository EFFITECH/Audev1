import React, { useState, useEffect } from 'react';
import { SupplierInvoice, SupplierInvoiceItem, Supplier, SupplierOrder } from '../types';
import { Plus, Trash2, Link, FileText } from 'lucide-react';

type SupplierInvoiceFormProps = {
  invoice?: SupplierInvoice;
  suppliers: Supplier[];
  supplierOrders: SupplierOrder[];
  onSubmit: (invoice: SupplierInvoice) => void;
  onCancel: () => void;
};

export const SupplierInvoiceForm: React.FC<SupplierInvoiceFormProps> = ({
  invoice,
  suppliers,
  supplierOrders,
  onSubmit,
  onCancel,
}) => {
  console.log('SupplierInvoiceForm - Props reçues:', { 
    invoice, 
    suppliersCount: suppliers.length,
    supplierOrdersCount: supplierOrders.length 
  });

  // Initialiser l'état avec un objet vide ou les données de la facture si elle existe
  const [formData, setFormData] = useState<SupplierInvoice>(() => {
    if (invoice) {
      console.log('Initialisation avec une facture existante:', invoice);
      
      // S'assurer que les items ont des valeurs numériques correctes
      const itemsWithCorrectValues = invoice.items?.map(item => ({
        ...item,
        description: item.description || '',
        quantity: typeof item.quantity === 'number' ? item.quantity : Number(item.quantity) || 0,
        unitPrice: typeof item.unitPrice === 'number' ? item.unitPrice : Number(item.unitPrice) || 0,
        totalHT: typeof item.totalHT === 'number' ? item.totalHT : Number(item.totalHT) || 0
      })) || [{ description: '', quantity: 1, unitPrice: 0, totalHT: 0 }];
      
      // Forcer la conversion des valeurs numériques
      const totalHT = typeof invoice.totalHT === 'number' ? invoice.totalHT : Number(invoice.totalHT) || 0;
      const tva = typeof invoice.tva === 'number' ? invoice.tva : Number(invoice.tva) || 0;
      const totalTTC = typeof invoice.totalTTC === 'number' ? invoice.totalTTC : Number(invoice.totalTTC) || 0;
      
      return {
        id: invoice.id || 0,
        invoiceNumber: invoice.invoiceNumber || '',
        invoiceDate: invoice.invoiceDate || new Date().toISOString().split('T')[0],
        dueDate: invoice.dueDate || '',
        supplierId: invoice.supplierId || (suppliers.length > 0 ? suppliers[0].id || 0 : 0),
        supplierName: invoice.supplierName || (suppliers.length > 0 ? suppliers[0].name : ''),
        supplierOrderId: invoice.supplierOrderId,
        supplierOrderNumber: invoice.supplierOrderNumber || '',
        description: invoice.description || '',
        items: itemsWithCorrectValues,
        totalHT: totalHT,
        tva: tva,
        totalTTC: totalTTC,
        status: invoice.status || 'en attente',
        paymentStatus: invoice.paymentStatus || 'non payé',
        paymentDate: invoice.paymentDate || '',
        paymentMethod: invoice.paymentMethod || '',
        notes: invoice.notes || '',
      };
    } else {
      console.log('Initialisation avec une nouvelle facture');
      return {
        id: 0,
        invoiceNumber: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        supplierId: suppliers.length > 0 ? suppliers[0].id || 0 : 0,
        supplierName: suppliers.length > 0 ? suppliers[0].name : '',
        supplierOrderId: undefined,
        supplierOrderNumber: '',
        description: '',
        items: [{ description: '', quantity: 1, unitPrice: 0, totalHT: 0 }],
        totalHT: 0,
        tva: 0,
        totalTTC: 0,
        status: 'en attente',
        paymentStatus: 'non payé',
        paymentDate: '',
        paymentMethod: '',
        notes: '',
      };
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableSupplierOrders, setAvailableSupplierOrders] = useState<SupplierOrder[]>([]);
  const [showLinkSupplierOrder, setShowLinkSupplierOrder] = useState<boolean>(!!invoice?.supplierOrderId);
  
  // Effet pour mettre à jour les données de la facture si la prop invoice change
  useEffect(() => {
    if (invoice) {
      console.log('La prop invoice a changé:', invoice);
      
      // S'assurer que les items ont des valeurs numériques correctes
      const itemsWithCorrectValues = invoice.items?.map(item => ({
        ...item,
        description: item.description || '',
        quantity: typeof item.quantity === 'number' ? item.quantity : Number(item.quantity) || 0,
        unitPrice: typeof item.unitPrice === 'number' ? item.unitPrice : Number(item.unitPrice) || 0,
        totalHT: typeof item.totalHT === 'number' ? item.totalHT : Number(item.totalHT) || 0
      })) || [{ description: '', quantity: 1, unitPrice: 0, totalHT: 0 }];
      
      // Forcer la conversion des valeurs numériques
      const totalHT = typeof invoice.totalHT === 'number' ? invoice.totalHT : Number(invoice.totalHT) || 0;
      const tva = typeof invoice.tva === 'number' ? invoice.tva : Number(invoice.tva) || 0;
      const totalTTC = typeof invoice.totalTTC === 'number' ? invoice.totalTTC : Number(invoice.totalTTC) || 0;
      
      console.log('Valeurs numériques converties:', {
        items: itemsWithCorrectValues,
        totalHT,
        tva,
        totalTTC
      });
      
      setFormData({
        id: invoice.id || 0,
        invoiceNumber: invoice.invoiceNumber || '',
        invoiceDate: invoice.invoiceDate || new Date().toISOString().split('T')[0],
        dueDate: invoice.dueDate || '',
        supplierId: invoice.supplierId || (suppliers.length > 0 ? suppliers[0].id || 0 : 0),
        supplierName: invoice.supplierName || (suppliers.length > 0 ? suppliers[0].name : ''),
        supplierOrderId: invoice.supplierOrderId,
        supplierOrderNumber: invoice.supplierOrderNumber || '',
        description: invoice.description || '',
        items: itemsWithCorrectValues,
        totalHT: totalHT,
        tva: tva,
        totalTTC: totalTTC,
        status: invoice.status || 'en attente',
        paymentStatus: invoice.paymentStatus || 'non payé',
        paymentDate: invoice.paymentDate || '',
        paymentMethod: invoice.paymentMethod || '',
        notes: invoice.notes || '',
      });
      
      // Si la facture est liée à une commande fournisseur, afficher la section
      if (invoice.supplierOrderId) {
        setShowLinkSupplierOrder(true);
      }
    }
  }, [invoice, suppliers]);

  // Générer un numéro de facture unique si c'est une nouvelle facture
  useEffect(() => {
    if (!invoice && !formData.invoiceNumber) {
      const today = new Date();
      const year = today.getFullYear().toString();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      setFormData(prev => ({
        ...prev,
        invoiceNumber: `INV-${year}${month}-${random}`,
      }));
    }
  }, [invoice, formData.invoiceNumber]);

  // Définir la date d'échéance par défaut (30 jours après la date de facture)
  useEffect(() => {
    if (formData.invoiceDate && !formData.dueDate) {
      const invoiceDate = new Date(formData.invoiceDate);
      const dueDate = new Date(invoiceDate);
      dueDate.setDate(dueDate.getDate() + 30);
      
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0],
      }));
    }
  }, [formData.invoiceDate]);

  // Filtrer les commandes fournisseur livrées ou en cours
  useEffect(() => {
    const filteredOrders = supplierOrders.filter(
      order => order.status === 'livrée' || order.status === 'en cours'
    );
    setAvailableSupplierOrders(filteredOrders);
  }, [supplierOrders]);

  // Calculer les totaux lorsque les éléments changent
  useEffect(() => {
    const totalHT = formData.items.reduce((sum, item) => sum + item.totalHT, 0);
    const tva = totalHT * 0.2; // TVA à 20%
    const totalTTC = totalHT + tva;
    
    setFormData(prev => ({
      ...prev,
      totalHT,
      tva,
      totalTTC,
    }));
  }, [formData.items]);

  // Remplir les données à partir de la commande fournisseur sélectionnée
  useEffect(() => {
    if (formData.supplierOrderId) {
      const selectedOrder = supplierOrders.find(o => o.id === formData.supplierOrderId);
      if (selectedOrder) {
        // Convertir explicitement les valeurs numériques des items
        const itemsWithCorrectValues = selectedOrder.items.map(item => ({
          description: item.description || '',
          quantity: typeof item.quantity === 'number' ? item.quantity : Number(item.quantity) || 0,
          unitPrice: typeof item.unitPrice === 'number' ? item.unitPrice : Number(item.unitPrice) || 0,
          totalHT: typeof item.totalHT === 'number' ? item.totalHT : Number(item.totalHT) || 0
        }));
        
        console.log('Données chargées depuis la commande:', {
          items: itemsWithCorrectValues
        });
        
        setFormData(prev => ({
          ...prev,
          supplierOrderNumber: selectedOrder.orderNumber,
          supplierId: selectedOrder.supplierId,
          supplierName: selectedOrder.supplierName,
          description: `Facture pour la commande fournisseur ${selectedOrder.orderNumber}`,
          items: itemsWithCorrectValues,
        }));
      }
    }
  }, [formData.supplierOrderId, supplierOrders]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'supplierId') {
      const supplierId = parseInt(value, 10);
      const selectedSupplier = suppliers.find(s => s.id === supplierId);
      
      setFormData(prev => ({
        ...prev,
        supplierId,
        supplierName: selectedSupplier?.name || '',
      }));
    } else if (name === 'supplierOrderId') {
      if (value) {
        const supplierOrderId = parseInt(value, 10);
        setFormData(prev => ({
          ...prev,
          supplierOrderId,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          supplierOrderId: undefined,
          supplierOrderNumber: '',
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Effacer l'erreur lorsque le champ est modifié
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleItemChange = (index: number, field: keyof SupplierInvoiceItem, value: string | number) => {
    const newItems = [...formData.items];
    
    if (field === 'quantity' || field === 'unitPrice') {
      // Convertir explicitement en nombre
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      newItems[index][field] = numValue;
      
      // Recalculer le total de la ligne
      const quantity = field === 'quantity' ? numValue : newItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? numValue : newItems[index].unitPrice;
      
      // S'assurer que quantity et unitPrice sont des nombres
      const safeQuantity = typeof quantity === 'number' ? quantity : Number(quantity) || 0;
      const safeUnitPrice = typeof unitPrice === 'number' ? unitPrice : Number(unitPrice) || 0;
      
      // Calculer le total
      newItems[index].totalHT = safeQuantity * safeUnitPrice;
      
      console.log('Valeurs mises à jour:', {
        field,
        value,
        numValue,
        quantity: safeQuantity,
        unitPrice: safeUnitPrice,
        totalHT: newItems[index].totalHT
      });
    } else {
      newItems[index][field] = value;
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, totalHT: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = [...formData.items];
      newItems.splice(index, 1);
      
      setFormData(prev => ({
        ...prev,
        items: newItems,
      }));
    }
  };

  const toggleLinkSupplierOrder = () => {
    setShowLinkSupplierOrder(!showLinkSupplierOrder);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Le numéro de facture est requis';
    }
    
    if (!formData.invoiceDate) {
      newErrors.invoiceDate = 'La date de facture est requise';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'La date d\'échéance est requise';
    }
    
    if (!formData.supplierId) {
      newErrors.supplierId = 'Un fournisseur doit être sélectionné';
    }
    
    // Vérifier que tous les éléments ont une description et des valeurs valides
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`items[${index}].description`] = 'La description est requise';
      }
      
      if (item.quantity <= 0) {
        newErrors[`items[${index}].quantity`] = 'La quantité doit être supérieure à 0';
      }
      
      if (item.unitPrice < 0) {
        newErrors[`items[${index}].unitPrice`] = 'Le prix unitaire ne peut pas être négatif';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      console.log('Soumission du formulaire avec les données:', formData);
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold dark:text-dark-text mb-4">
        {invoice ? 'Modifier la facture fournisseur' : 'Créer une nouvelle facture fournisseur'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Numéro de facture *
          </label>
          <input
            type="text"
            id="invoiceNumber"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.invoiceNumber ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.invoiceNumber && <p className="mt-1 text-sm text-red-500">{errors.invoiceNumber}</p>}
        </div>
        
        <div>
          <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Date de facture *
          </label>
          <input
            type="date"
            id="invoiceDate"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.invoiceDate ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.invoiceDate && <p className="mt-1 text-sm text-red-500">{errors.invoiceDate}</p>}
        </div>
        
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Date d'échéance *
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.dueDate ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>}
        </div>
      </div>
      
      <div>
        <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
          Fournisseur *
        </label>
        <select
          id="supplierId"
          name="supplierId"
          value={formData.supplierId || ''}
          onChange={handleChange}
          disabled={!!formData.supplierOrderId}
          className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
            errors.supplierId ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
          } ${formData.supplierOrderId ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
        >
          <option value="">Sélectionnez un fournisseur</option>
          {suppliers.map(supplier => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
        {errors.supplierId && <p className="mt-1 text-sm text-red-500">{errors.supplierId}</p>}
        {formData.supplierOrderId && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Le fournisseur est défini par la commande liée
          </p>
        )}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="supplierOrderId" className="block text-sm font-medium text-gray-700 dark:text-dark-text">
            Lier à une commande fournisseur
          </label>
          <button
            type="button"
            onClick={toggleLinkSupplierOrder}
            className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <Link size={16} className="mr-1" />
            {showLinkSupplierOrder ? 'Masquer' : 'Afficher'}
          </button>
        </div>
        
        {showLinkSupplierOrder && (
          <select
            id="supplierOrderId"
            name="supplierOrderId"
            value={formData.supplierOrderId || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border mb-2"
          >
            <option value="">Aucune commande fournisseur</option>
            {availableSupplierOrders.map(order => (
              <option key={order.id} value={order.id}>
                {order.orderNumber} - {order.supplierName} - {order.totalTTC.toFixed(2)} €
              </option>
            ))}
          </select>
        )}
        
        {formData.supplierOrderId && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800 mb-2">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Cette facture est liée à la commande fournisseur {formData.supplierOrderNumber}
            </p>
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium dark:text-dark-text">Éléments de la facture</h3>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <Plus size={16} className="mr-1" />
            Ajouter un élément
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                  Quantité
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">
                  Prix unitaire
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">
                  Total HT
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {formData.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className={`w-full px-2 py-1 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
                        errors[`items[${index}].description`] ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Description de l'élément"
                    />
                    {errors[`items[${index}].description`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`items[${index}].description`]}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={typeof item.quantity === 'number' ? item.quantity : 0}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      min="1"
                      step="1"
                      className={`w-full px-2 py-1 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
                        errors[`items[${index}].quantity`] ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`items[${index}].quantity`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`items[${index}].quantity`]}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={typeof item.unitPrice === 'number' ? item.unitPrice : 0}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      min="0"
                      step="0.01"
                      className={`w-full px-2 py-1 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
                        errors[`items[${index}].unitPrice`] ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`items[${index}].unitPrice`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`items[${index}].unitPrice`]}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={typeof item.totalHT === 'number' ? item.totalHT.toFixed(2) : '0.00'}
                      readOnly
                      className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-dark-text dark:border-dark-border"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length <= 1}
                      className={`text-red-500 hover:text-red-700 ${
                        formData.items.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total HT:
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={typeof formData.totalHT === 'number' ? formData.totalHT.toFixed(2) : '0.00'}
                    readOnly
                    className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-dark-text dark:border-dark-border"
                  />
                </td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                  TVA (20%):
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={typeof formData.tva === 'number' ? formData.tva.toFixed(2) : '0.00'}
                    readOnly
                    className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-dark-text dark:border-dark-border"
                  />
                </td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total TTC:
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={typeof formData.totalTTC === 'number' ? formData.totalTTC.toFixed(2) : '0.00'}
                    readOnly
                    className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-dark-text dark:border-dark-border font-bold"
                  />
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Statut de la facture
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          >
            <option value="en attente">En attente</option>
            <option value="validée">Validée</option>
            <option value="comptabilisée">Comptabilisée</option>
            <option value="annulée">Annulée</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Statut de paiement
          </label>
          <select
            id="paymentStatus"
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          >
            <option value="non payé">Non payé</option>
            <option value="partiellement payé">Partiellement payé</option>
            <option value="payé">Payé</option>
          </select>
        </div>
      </div>
      
      {formData.paymentStatus === 'payé' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Date de paiement
            </label>
            <input
              type="date"
              id="paymentDate"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
            />
          </div>
          
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Méthode de paiement
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
            >
              <option value="">Sélectionnez une méthode</option>
              <option value="virement">Virement bancaire</option>
              <option value="chèque">Chèque</option>
              <option value="carte">Carte bancaire</option>
              <option value="espèces">Espèces</option>
              <option value="prélèvement">Prélèvement</option>
            </select>
          </div>
        </div>
      )}
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          placeholder="Notes ou commentaires sur cette facture..."
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-dark-card dark:text-dark-text dark:border-dark-border dark:hover:bg-gray-700"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          {invoice ? 'Mettre à jour' : 'Créer la facture'}
        </button>
      </div>
    </form>
  );
};