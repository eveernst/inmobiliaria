'use client';
import PropertyForm from '@/components/porperties/FormProperty';
import { TableProperties } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Property() {
    const [propertyId, setPropertyId] = useState<number>(0);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const id = Number(query.get("id"));
        if (id) setPropertyId(id);
      }, []);
    return (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                {/* boton agregar propiedad lleva a /new-property */}
                <PropertyForm id={propertyId}/>
            </div>
    );
}