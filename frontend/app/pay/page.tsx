'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt, Heart, Zap, Building, CheckCircle, AlertCircle, DollarSign, CreditCard, History, TrendingUp } from 'lucide-react';

const ESUSU_PAY_ADDRESS = '0x05e2C54D348d9F0d8C40dF90cf15BFE8717Ee03f'; // Replace with deployed address

export default function PayPage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('pay');
  const [paymentType, setPaymentType] = useState<'utility' | 'donation'>('utility');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [utilityType, setUtilityType] = useState('');

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  // Mock data for demonstration
  const mockPayments = [
    {
      id: 1,
      type: 'utility',
      amount: '75',
      recipient: 'Electricity Provider',
      description: 'Monthly electricity bill',
      date: '2024-01-15',
      status: 'completed',
      txHash: '0x123...'
    },
    {
      id: 2,
      type: 'donation',
      amount: '25',
      recipient: 'Community Fund',
      description: 'School supplies donation',
      date: '2024-01-10',
      status: 'completed',
      txHash: '0x456...'
    }
  ];

  const utilityProviders = [
    { name: 'Electricity Provider', address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', type: 'Electricity' },
    { name: 'Water Utility', address: '0x8ba1f109551bD432803012645ac136ddd64DBA72', type: 'Water' },
    { name: 'Internet Service', address: '0x9cA9d2D5E04012C9Ed6585E8454D96a23c73d5', type: 'Internet' },
    { name: 'Gas Company', address: '0x4E9ce36E442e55EcD9025B9a6E0D88485d628A67', type: 'Gas' }
  ];

  const handlePayment = async () => {
    if (!isConnected) return;

    if (!recipient || !amount || !description) {
      alert('Please fill in all required fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      if (paymentType === 'utility') {
        writeContract({
          address: ESUSU_PAY_ADDRESS,
          abi: [
            {
              inputs: [
                { name: '_provider', type: 'address' },
                { name: '_amount', type: 'uint256' },
                { name: '_description', type: 'string' }
              ],
              name: 'payUtility',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function'
            }
          ],
          functionName: 'payUtility',
          args: [recipient as `0x${string}`, parseEther(amount), description]
        });
      } else {
        writeContract({
          address: ESUSU_PAY_ADDRESS,
          abi: [
            {
              inputs: [
                { name: '_recipient', type: 'address' },
                { name: '_amount', type: 'uint256' },
                { name: '_description', type: 'string' }
              ],
              name: 'makeDonation',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function'
            }
          ],
          functionName: 'makeDonation',
          args: [recipient as `0x${string}`, parseEther(amount), description]
        });
      }
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };

  const selectUtilityProvider = (provider: typeof utilityProviders[0]) => {
    setRecipient(provider.address);
    setUtilityType(provider.type);
    setDescription(`${provider.type} bill payment`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6 shadow-lg">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent mb-4">
            Pay Bills & Donate
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Make utility payments and donations securely on the blockchain.
            Support your community while maintaining full transparency.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Paid</p>
                  <p className="text-3xl font-bold">$12.4K</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Utilities Paid</p>
                  <p className="text-3xl font-bold">847</p>
                </div>
                <Zap className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Donations Made</p>
                  <p className="text-3xl font-bold">$3.2K</p>
                </div>
                <Heart className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg. Transaction</p>
                  <p className="text-3xl font-bold">$67</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <TabsTrigger value="pay" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all duration-200">
                Make Payment
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all duration-200">
                Payment History
              </TabsTrigger>
            </TabsList>

            {/* Make Payment Tab */}
            <TabsContent value="pay" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payment Form */}
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                      <Receipt className="h-6 w-6 text-green-600" />
                      Make a Payment
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Pay utilities or make donations securely
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Payment Type */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Payment Type</Label>
                      <RadioGroup value={paymentType} onValueChange={(value) => setPaymentType(value as 'utility' | 'donation')}>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="utility" id="utility" />
                            <Label htmlFor="utility" className="flex items-center gap-2 cursor-pointer">
                              <Zap className="h-4 w-4 text-blue-600" />
                              Utility Payment
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="donation" id="donation" />
                            <Label htmlFor="donation" className="flex items-center gap-2 cursor-pointer">
                              <Heart className="h-4 w-4 text-red-600" />
                              Donation
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Utility Provider Selector */}
                    {paymentType === 'utility' && (
                      <div className="space-y-3">
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-600" />
                          Select Utility Provider
                        </Label>
                        <Select onValueChange={(value) => {
                          const provider = utilityProviders.find(p => p.address === value);
                          if (provider) selectUtilityProvider(provider);
                        }}>
                          <SelectTrigger className="h-12 border-2 focus:border-green-500 transition-colors">
                            <SelectValue placeholder="Choose a utility provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {utilityProviders.map((provider) => (
                              <SelectItem key={provider.address} value={provider.address}>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{provider.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {provider.type}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Recipient Address */}
                    <div className="space-y-2">
                      <Label htmlFor="recipient" className="text-base font-semibold">
                        {paymentType === 'utility' ? 'Provider Address' : 'Recipient Address'}
                      </Label>
                      <Input
                        id="recipient"
                        type="text"
                        placeholder="0x..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="text-lg h-12 border-2 focus:border-green-500 transition-colors"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {paymentType === 'utility' ? 'Utility provider wallet address' : 'Recipient wallet address'}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-base font-semibold flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        Amount (cUSD)
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="50"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-lg h-12 border-2 focus:border-green-500 transition-colors"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Minimum: 1 cUSD • Only pay Celo network fees
                      </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-base font-semibold">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder={paymentType === 'utility' ? 'Monthly electricity bill payment' : 'Donation for community project'}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-20 border-2 focus:border-green-500 transition-colors"
                      />
                    </div>

                    {/* Payment Button */}
                    <Button
                      onClick={handlePayment}
                      disabled={!isConnected || isPending || !recipient || !amount || !description}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing Payment...
                        </div>
                      ) : !isConnected ? (
                        'Connect Wallet to Pay'
                      ) : (
                        `Make ${paymentType === 'utility' ? 'Utility Payment' : 'Donation'}`
                      )}
                    </Button>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Failed to process payment. Please check your inputs and try again.
                        </AlertDescription>
                      </Alert>
                    )}

                    {isSuccess && (
                      <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                          Payment processed successfully! Transaction recorded on blockchain.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Information Panel */}
                <div className="space-y-6">
                  <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Why Pay with PiggySavfe?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Transparent & Secure</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Every payment is recorded immutably on the Celo blockchain
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">No Hidden Fees</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Only pay for Celo network gas fees, no additional charges
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Instant Processing</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Payments are processed instantly on the fast Celo network
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Community Support</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Support local utilities and community projects directly
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <Building className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Supported Utilities
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-600" />
                            <span>Electricity</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                            <span>Water</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-purple-600 rounded"></div>
                            <span>Internet</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
                            <span>Gas</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Payment History Tab */}
            <TabsContent value="history" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockPayments.map((payment) => (
                  <Card key={payment.id} className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                          {payment.type === 'utility' ? (
                            <Zap className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Heart className="h-5 w-5 text-red-600" />
                          )}
                          {payment.type === 'utility' ? 'Utility Payment' : 'Donation'}
                        </CardTitle>
                        <Badge variant="outline" className="capitalize bg-green-50 text-green-700 border-green-200">
                          {payment.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {payment.date} • {payment.recipient}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                        <span className="text-xl font-bold text-green-600">${payment.amount}</span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                        <p className="text-sm font-medium">{payment.description}</p>
                      </div>

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Transaction Hash</p>
                        <p className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                          {payment.txHash}
                        </p>
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        View on Explorer
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {mockPayments.length === 0 && (
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Payment History</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Your payment history will appear here once you make your first transaction.
                    </p>
                    <Button onClick={() => setActiveTab('pay')} className="bg-green-600 hover:bg-green-700">
                      Make Your First Payment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* How It Works Section */}
        <Card className="mt-12 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <CreditCard className="h-6 w-6 text-green-600" />
              How Payments Work
            </CardTitle>
            <CardDescription className="text-lg">
              Simple and secure payments for utilities and donations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-green-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Choose Type</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select utility payment or donation
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Enter Details</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Provide recipient address and amount
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Confirm Payment</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Review and submit your transaction
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-orange-600">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Receive Confirmation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Transaction recorded on blockchain
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
