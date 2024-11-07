import NewProperty from '@/components/porperties/FormProperty';
import { TableProperties } from 'lucide-react';

export default function Property() {
    return (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                {/* boton agregar propiedad lleva a /new-property */}
                
                <NewProperty />

    
            </div>
    );
}