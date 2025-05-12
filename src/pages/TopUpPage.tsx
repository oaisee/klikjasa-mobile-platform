
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/utils';

// Preset top-up amounts
const PRESET_AMOUNTS = [50000, 100000, 200000, 500000];
const MINIMUM_AMOUNT = 50000;

const TopUpPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  // Function to handle preset amount selection
  const handlePresetSelect = (value: number) => {
    setSelectedPreset(value);
    setAmount(value.toString());
  };

  // Function to handle input changes
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setAmount(value);
    setSelectedPreset(null);
  };

  // Function to handle top-up submission
  const handleTopUp = async () => {
    // Validate amount
    const topUpAmount = parseInt(amount);
    
    if (isNaN(topUpAmount) || topUpAmount < MINIMUM_AMOUNT) {
      toast({
        title: 'Invalid Amount',
        description: `Minimum top-up amount is ${formatCurrency(MINIMUM_AMOUNT)}`,
        variant: 'destructive'
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would redirect to a payment gateway
      // For demo purposes, we'll create a transaction record and update the balance
      
      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          type: 'topup',
          amount: topUpAmount,
          status: 'completed', // Auto-complete for demo
          payment_method: 'demo',
          payment_details: { demo: true }
        })
        .select()
        .single();
      
      if (transactionError) throw new Error(transactionError.message);
      
      // Update user balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ 
          balance: (profile?.balance || 0) + topUpAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);
      
      if (balanceError) throw new Error(balanceError.message);
      
      // Show success message
      toast({
        title: 'Top-up Successful',
        description: `${formatCurrency(topUpAmount)} has been added to your balance`
      });
      
      // Go back to profile page
      navigate('/profile');
    } catch (error: any) {
      console.error('Top-up error:', error);
      toast({
        title: 'Top-up Failed',
        description: error.message || 'Failed to process top-up. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Top Up Balance</h1>
      </div>
      
      {/* Current Balance */}
      <div className="bg-white mt-3 p-5">
        <div className="text-center mb-2 text-gray-600">Current Balance</div>
        <div className="text-center text-2xl font-semibold mb-4">
          {formatCurrency(profile?.balance || 0)}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg text-sm">
          <div className="flex items-center text-klikjasa-deepPurple">
            <Wallet className="h-5 w-5 mr-2" />
            <span>Minimum top-up amount is {formatCurrency(MINIMUM_AMOUNT)}</span>
          </div>
        </div>
      </div>
      
      {/* Amount Input */}
      <div className="bg-white mt-3 p-5">
        <Label htmlFor="amount" className="text-base font-medium">
          Enter Amount
        </Label>
        
        <div className="relative mt-2">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            Rp
          </div>
          <Input
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            className="pl-10 text-lg font-medium"
            placeholder="0"
          />
        </div>
        
        {/* Preset Amounts */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {PRESET_AMOUNTS.map((value) => (
            <Button
              key={value}
              variant={selectedPreset === value ? "default" : "outline"}
              className={selectedPreset === value ? "bg-klikjasa-purple" : ""}
              onClick={() => handlePresetSelect(value)}
            >
              {formatCurrency(value)}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Payment Method */}
      <div className="bg-white mt-3 p-5">
        <Label className="text-base font-medium">
          Payment Method
        </Label>
        
        <div className="mt-2 border rounded-lg p-3 flex items-center">
          <CreditCard className="h-6 w-6 text-klikjasa-purple mr-3" />
          <div>
            <div className="font-medium">Demo Payment</div>
            <div className="text-sm text-gray-500">Instant approval (for demo purposes)</div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          In a production app, this would integrate with a real payment gateway like Midtrans or Doku.
        </p>
      </div>
      
      {/* Action Button */}
      <div className="fixed bottom-20 left-0 right-0 px-5 pb-3">
        <Button
          className="w-full klikjasa-gradient h-12 text-base"
          disabled={!amount || parseInt(amount) < MINIMUM_AMOUNT || isProcessing}
          onClick={handleTopUp}
        >
          {isProcessing ? 'Processing...' : 'Top Up Now'}
        </Button>
      </div>
    </div>
  );
};

export default TopUpPage;
