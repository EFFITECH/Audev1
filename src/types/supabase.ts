export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      suppliers: {
        Row: {
          id: number
          name: string
          contact: string
          bankInfo: string
          category: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          contact: string
          bankInfo: string
          category: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          contact?: string
          bankInfo?: string
          category?: string
          created_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: number
          name: string
          description: string
          startDate: string
          endDate: string | null
          status: 'en cours' | 'terminé' | 'en pause' | 'annulé'
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          startDate: string
          endDate?: string | null
          status: 'en cours' | 'terminé' | 'en pause' | 'annulé'
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          startDate?: string
          endDate?: string | null
          status?: 'en cours' | 'terminé' | 'en pause' | 'annulé'
          created_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: number
          orderNumber: string
          date: string
          supplierId: number
          projectId: number | null
          status: 'en attente' | 'envoyée' | 'reçue' | 'partiellement reçue'
          totalHT: number
          tva: number
          totalTTC: number
          paymentDueDate: string
          paymentStatus: 'non payé' | 'payé' | 'partiellement payé'
          created_at: string
        }
        Insert: {
          id?: number
          orderNumber: string
          date: string
          supplierId: number
          projectId?: number | null
          status: 'en attente' | 'envoyée' | 'reçue' | 'partiellement reçue'
          totalHT: number
          tva: number
          totalTTC: number
          paymentDueDate: string
          paymentStatus: 'non payé' | 'payé' | 'partiellement payé'
          created_at?: string
        }
        Update: {
          id?: number
          orderNumber?: string
          date?: string
          supplierId?: number
          projectId?: number | null
          status?: 'en attente' | 'envoyée' | 'reçue' | 'partiellement reçue'
          totalHT?: number
          tva?: number
          totalTTC?: number
          paymentDueDate?: string
          paymentStatus?: 'non payé' | 'payé' | 'partiellement payé'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_projectId_fkey"
            columns: ["projectId"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      invoices: {
        Row: {
          id: number
          invoiceNumber: string
          invoiceDate: string
          orderId: number
          amount: number
          paymentTerms: string
          dueDate: string
          paymentStatus: 'en attente' | 'payé' | 'partiellement payé'
          pdfUrl: string | null
          created_at: string
        }
        Insert: {
          id?: number
          invoiceNumber: string
          invoiceDate: string
          orderId: number
          amount: number
          paymentTerms: string
          dueDate: string
          paymentStatus: 'en attente' | 'payé' | 'partiellement payé'
          pdfUrl?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          invoiceNumber?: string
          invoiceDate?: string
          orderId?: number
          amount?: number
          paymentTerms?: string
          dueDate?: string
          paymentStatus?: 'en attente' | 'payé' | 'partiellement payé'
          pdfUrl?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_orderId_fkey"
            columns: ["orderId"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}