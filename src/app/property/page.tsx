'use client';
import PropertyForm from '@/components/porperties/FormProperty';
import { useEffect, useState } from 'react';

export default function Property() {
    const [propertyId, setPropertyId] = useState<number>(0);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const id = Number(query.get("id"));
        if (id) setPropertyId(id);
      }, []);
    return (
            <div className="page-container relative overflow-x-auto py-6 shadow-md sm:rounded-lg">
                {/* boton agregar propiedad lleva a /new-property */}
                <PropertyForm id={propertyId}/>
            </div>
    );
}