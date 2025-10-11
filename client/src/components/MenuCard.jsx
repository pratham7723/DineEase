import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, DollarSign } from 'lucide-react';

const MenuCard = ({ item }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl">{item.name}</CardTitle>
            <Badge variant="secondary" className="mt-2">
              {item.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-4 w-4 text-primary" />
          <span className="text-lg font-bold text-primary">
            ₹{item.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Quantity: {item.quantity}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" className="flex-1 gap-2">
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCard;