import React, { useState, useEffect } from 'react';
import { SupplierOrder, SupplierOrderItem, Supplier, ClientOrder } from '../types';
import { Plus, Trash2, Link } from 'lucide-react';

type SupplierOrderFormProps = {
  order?: SupplierOrder;
  suppliers: Supplier[];
  clientOrders: ClientOrder[];
  onSubmit: (order: SupplierOrder) => void;
  onCancel: () => void;
};

export const SupplierOrderForm: React.FC<SupplierOrderFormProps> = ({
  order,
  suppliers,
  clientOrders,
  onSubmit,
  onCancel,
}) => {
  // Initialiser l'état avec un objet vide
  const [formData, setFormData] = useState<SupplierOrder>({
    id: 0,
    orderNumber: '',
    orderDate: new Date().toISOString().split('T')[0],
    supplierId: suppliers.length > 0 ? suppliers[0].id || 0 : 0,
    supplierName: suppliers.length > 0 ? suppliers[0].name : '',
    clientOrderId: undefined,
    clientOrderNumber: '',
    description: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, totalHT: 0 }],
    totalHT: 0,
    tva: 0,
    totalTTC: 0,
    status: 'en attente',
    paymentStatus: 'non payé',
    expectedDeliveryDate: '',
    deliveryDate: '',
    invoiceId: undefined,
    invoiceNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableClientOrders, setAvailableClientOrders] = useState<ClientOrder[]>([]);
  const [showLinkClientOrder, setShowLinkClientOrder] = useState<boolean>(false);
  
  // Effet pour charger les données de la commande existante
  useEffect(() => {
    if (order) {
      console.log('Chargement des données de la commande:', order);
      
      // S'assurer que les items ont des valeurs numériques correctes
      const itemsWithCorrectValues = order.items?.map(item => ({
        ...item,
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0,
        totalHT: Number(item.totalHT) || 0
      })) || [{ description: '', quantity: 1, unitPrice: 0, totalHT: 0 }];
      
      setFormData({
        id: order.id || 0,
        orderNumber: order.orderNumber || '',
        orderDate: order.orderDate || new Date().toISOString().split('T')[0],
        supplierId: order.supplierId || (suppliers.length > 0 ? suppliers[0].id || 0 : 0),
        supplierName: order.supplierName || (suppliers.length > 0 ? suppliers[0].name : ''),
        clientOrderId: order.clientOrderId,
        clientOrderNumber: order.clientOrderNumber || '',
        description: order.description || '',
        items: itemsWithCorrectValues,
        totalHT: Number(order.totalHT) || 0,
        tva: Number(order.tva) || 0,
        totalTTC: Number(order.totalTTC) || 0,
        status: order.status || 'en attente',
        paymentStatus: order.paymentStatus || 'non payé',
        expectedDeliveryDate: order.expectedDeliveryDate || '',
        deliveryDate: order.deliveryDate || '',
        invoiceId: order.invoiceId,
        invoiceNumber: order.invoiceNumber || '',
      });
      
      // Si la commande est liée à une commande client, afficher la section
      if (order.clientOrderId) {
        setShowLinkClientOrder(true);
      }
    }
  }, [order, suppliers]);

  // Générer un numéro de commande unique si c'est une nouvelle commande
  useEffect(() => {
    if (!order && !formData.orderNumber) {
      const today = new Date();
      const year = today.getFullYear().toString();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      setFormData(prev => ({
        ...prev,
        orderNumber: `PO-${year}${month}-${random}`,
      }));
    }
  }, [order, formData.orderNumber]);

  // Définir la date de livraison prévue par défaut (15 jours après la date de commande)
  useEffect(() => {
    if (formData.orderDate && !formData.expectedDeliveryDate) {
      const orderDate = new Date(formData.orderDate);
      const deliveryDate = new Date(orderDate);
      deliveryDate.setDate(deliveryDate.getDate() + 15);
      
      setFormData(prev => ({
        ...prev,
        expectedDeliveryDate: deliveryDate.toISOString().split('T')[0],
      }));
    }
  }, [formData.orderDate]);

  // Filtrer les commandes client en cours ou en attente
  useEffect(() => {
    const filteredOrders = clientOrders.filter(
      order => order.status === 'en cours' || order.status === 'en attente'
    );
    setAvailableClientOrders(filteredOrders);
  }, [clientOrders]);

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

  // Remplir les données à partir de la commande client sélectionnée
  useEffect(() => {
    if (formData.clientOrderId) {
      const selectedOrder = clientOrders.find(o => o.id === formData.clientOrderId);
      if (selectedOrder) {
        setFormData(prev => ({
          ...prev,
          clientOrderNumber: selectedOrder.orderNumber,
          description: `Commande fournisseur pour la commande client ${selectedOrder.orderNumber} - ${selectedOrder.clientName}`,
        }));
      }
    }
  }, [formData.clientOrderId, clientOrders]);

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
    } else if (name === 'clientOrderId') {
      if (value) {
        const clientOrderId = parseInt(value, 10);
        setFormData(prev => ({
          ...prev,
          clientOrderId,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          clientOrderId: undefined,
          clientOrderNumber: '',
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

  const handleItemChange = (index: number, field: keyof SupplierOrderItem, value: string | number) => {
    const newItems = [...formData.items];
    
    if (field === 'quantity' || field === 'unitPrice') {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      newItems[index][field] = numValue;
      
      // Recalculer le total de la ligne
      const quantity = field === 'quantity' ? numValue : newItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? numValue : newItems[index].unitPrice;
      newItems[index].totalHT = quantity * unitPrice;
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

  const toggleLinkClientOrder = () => {
    setShowLinkClientOrder(!showLinkClientOrder);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = 'Le numéro de commande est requis';
    }
    
    if (!formData.orderDate) {
      newErrors.orderDate = 'La date de commande est requise';
    }
    
    if (!formData.supplierId) {
      newErrors.supplierId = 'Un fournisseur doit être sélectionné';
    }
    
    if (!formData.expectedDeliveryDate) {
      newErrors.expectedDeliveryDate = 'La date de livraison prévue est requise';
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
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold dark:text-dark-text mb-4">
        {order ? 'Modifier la commande fournisseur' : 'Créer une nouvelle commande fournisseur'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Numéro de commande *
          </label>
          <input
            type="text"
            id="orderNumber"
            name="orderNumber"
            value={formData.orderNumber}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.orderNumber ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.orderNumber && <p className="mt-1 text-sm text-red-500">{errors.orderNumber}</p>}
        </div>
        
        <div>
          <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Date de commande *
          </label>
          <input
            type="date"
            id="orderDate"
            name="orderDate"
            value={formData.orderDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.orderDate ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.orderDate && <p className="mt-1 text-sm text-red-500">{errors.orderDate}</p>}
        </div>
        
        <div>
          <label htmlFor="expectedDeliveryDate" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Date de livraison prévue *
          </label>
          <input
            type="date"
            id="expectedDeliveryDate"
            name="expectedDeliveryDate"
            value={formData.expectedDeliveryDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.expectedDeliveryDate ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.expectedDeliveryDate && <p className="mt-1 text-sm text-red-500">{errors.expectedDeliveryDate}</p>}
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
          className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
            errors.supplierId ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Sélectionnez un fournisseur</option>
          {suppliers.map(supplier => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
        {errors.supplierId && <p className="mt-1 text-sm text-red-500">{errors.supplierId}</p>}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="clientOrderId" className="block text-sm font-medium text-gray-700 dark:text-dark-text">
            Lier à une commande client (optionnel)
          </label>
          <button
            type="button"
            onClick={toggleLinkClientOrder}
            className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <Link size={16} className="mr-1" />
            {showLinkClientOrder ? 'Masquer' : 'Afficher'}
          </button>
        </div>
        
        {showLinkClientOrder && (
          <select
            id="clientOrderId"
            name="clientOrderId"
            value={formData.clientOrderId || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border mb-2"
          >
            <option value="">Aucune commande client</option>
            {availableClientOrders.map(clientOrder => (
              <option key={clientOrder.id} value={clientOrder.id}>
                {clientOrder.orderNumber} - {clientOrder.clientName} - {clientOrder.totalTTC.toFixed(2)} €
              </option>
            ))}
          </select>
        )}
        
        {formData.clientOrderId && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800 mb-2">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Cette commande fournisseur est liée à la commande client {formData.clientOrderNumber}
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
          <h3 className="text-lg font-medium dark:text-dark-text">Éléments de la commande</h3>
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
                      value={item.quantity}
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
                      value={item.unitPrice}
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
                      type="number"
                      value={item.totalHT.toFixed(2)}
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
                    type="number"
                    value={formData.totalHT.toFixed(2)}
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
                    type="number"
                    value={formData.tva.toFixed(2)}
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
                    type="number"
                    value={formData.totalTTC.toFixed(2)}
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
            Statut de la commande
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          >
            <option value="en attente">En attente</option>
            <option value="confirmée">Confirmée</option>
            <option value="en cours">En cours</option>
            <option value="livrée">Livrée</option>
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
      
      {formData.status === 'livrée' && (
        <div>
          <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Date de livraison effective
          </label>
          <input
            type="date"
            id="deliveryDate"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          />
        </div>
      )}
      
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
          {order ? 'Mettre à jour' : 'Créer la commande'}
        </button>
      </div>
    </form>
  );
};