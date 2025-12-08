// Données mockées pour les commandes
export interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: 'En attente' | 'En cours' | 'En couture' | 'Terminé' | 'Livré';
    modelName: string;
    fabricName: string;
    totalAmount: number;
    estimatedDelivery: string;
    timeline: {
        step: string;
        date: string;
        completed: boolean;
    }[];
}

export const ordersData: Order[] = [
    {
        id: '1',
        orderNumber: 'CMD-2024-001',
        date: '2024-12-01',
        status: 'En couture',
        modelName: 'Robe Élégante',
        fabricName: 'Soie Premium',
        totalAmount: 59000,
        estimatedDelivery: '2024-12-15',
        timeline: [
            { step: 'Commande confirmée', date: '2024-12-01', completed: true },
            { step: 'Paiement reçu', date: '2024-12-01', completed: true },
            { step: 'Mesures validées', date: '2024-12-02', completed: true },
            { step: 'Couture en cours', date: '2024-12-05', completed: true },
            { step: 'Finitions', date: '2024-12-13', completed: false },
            { step: 'Prêt pour livraison', date: '2024-12-15', completed: false },
        ]
    },
    {
        id: '2',
        orderNumber: 'CMD-2024-002',
        date: '2024-11-20',
        status: 'Livré',
        modelName: 'Tailleur Moderne',
        fabricName: 'Coton Biologique',
        totalAmount: 30000,
        estimatedDelivery: '2024-11-30',
        timeline: [
            { step: 'Commande confirmée', date: '2024-11-20', completed: true },
            { step: 'Paiement reçu', date: '2024-11-20', completed: true },
            { step: 'Mesures validées', date: '2024-11-21', completed: true },
            { step: 'Couture en cours', date: '2024-11-23', completed: true },
            { step: 'Finitions', date: '2024-11-28', completed: true },
            { step: 'Prêt pour livraison', date: '2024-11-30', completed: true },
        ]
    },
    {
        id: '3',
        orderNumber: 'CMD-2024-003',
        date: '2024-12-05',
        status: 'En attente',
        modelName: 'Robe Cocktail',
        fabricName: 'Velours Rich',
        totalAmount: 85000,
        estimatedDelivery: '2024-12-20',
        timeline: [
            { step: 'Commande confirmée', date: '2024-12-05', completed: true },
            { step: 'Paiement reçu', date: '2024-12-05', completed: true },
            { step: 'Mesures validées', date: '', completed: false },
            { step: 'Couture en cours', date: '', completed: false },
            { step: 'Finitions', date: '', completed: false },
            { step: 'Prêt pour livraison', date: '', completed: false },
        ]
    },
];
