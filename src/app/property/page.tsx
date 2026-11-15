'use client';
import PropertyForm from '@/components/porperties/FormProperty';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Property() {
    const router = useRouter();
    const [propertyId, setPropertyId] = useState<number>(0);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const id = Number(query.get("id"));
        if (id) setPropertyId(id);
      }, []);

    // One level up: editing goes back to the property detail, creating goes home (#67).
    const backHref = propertyId ? `/property/details?id=${propertyId}` : '/';

    return (
            <div className="page-container relative overflow-x-auto py-6 shadow-md sm:rounded-lg">
                <div className="mb-4 flex">
                    <button
                        type="button"
                        onClick={() => router.push(backHref)}
                        className="action-button-secondary"
                    >
                        ← Volver
                    </button>
                </div>
                <PropertyForm id={propertyId}/>
            </div>
    );
}
