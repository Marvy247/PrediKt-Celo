'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Unlock, TrendingUp, Clock, DollarSign, Shield, Target, AlertTriangle, CheckCircle, PiggyBank, Calendar, Zap } from 'lucide-react';

const ESUSU_PIGGY_ADDRESS = '0x94cE3e8BA73477f6A3Ff3cd1B211B81c9c095125'; // Replace with deployed address

export default function PiggyPage() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('30');
  const [activeTab, setActiveTab] = useState('lock');

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  // Mock data for demonstration
  const mockLocks = [
    {
      id: 1,
      amount: '500',
      duration: 90,
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      rewards: '25',
      status: 'active',
      progress: 65
    },
    {
      id: 2,
      amount: '200',
      duration: 30,
      startDate: '2024-01-01',
      endDate: '2024-02-01',
      rewards: '5',
      status: 'completed',
      progress: 100
    }
  ];

  const calculateRewards = (amount: string, duration: string): string => {
    const amt = parseFloat(amount) || 0;
    const dur = parseInt(duration) || 0;
    // Simple reward calculation: 5% APY equivalent
    return ((amt * dur * 0.05) / 365).toFixed(2);
  };

  const handleLockFunds = async () => {
    if (!isConnected) return;

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const durationSeconds = parseInt(duration) * 24 * 60 * 60; // Convert days to seconds

      writeContract({
        address: ESUSU_PIGGY_ADDRESS,
        abi: [
          {
            inputs: [
              { name: '_amount', type: 'uint256' },
              { name: '_duration', type: 'uint256' }
            ],
            name: 'lockFunds',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ],
        functionName: 'lockFunds',
        args: [parseEther(amount), BigInt(durationSeconds)]
      });
    } catch (error) {
      console.error('Error locking funds:', error);
    }
  };

  const durationOptions = [
    { value: '30', label: '30 days', description: 'Short-term commitment' },
    { value: '90', label: '90 days', description: 'Quarterly savings' },
    { value: '180', label: '180 days', description: 'Half-year discipline' },
    { value: '365', label: '365 days', description: 'Full year commitment' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <PiggyBank className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent mb-4">
            Piggy Box
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Lock your funds to earn rewards and build unbreakable savings habits.
            The longer you commit, the more you earn.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Locked</p>
                  <p className="text-3xl font-bold">$89.2K</p>
                </div>
                <Lock className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Rewards Earned</p>
                  <p className="text-3xl font-bold">2,847 MST</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Avg. Lock Time</p>
                  <p className="text-3xl font-bold">142d</p>
                </div>
                <Clock className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Success Rate</p>
                  <p className="text-3xl font-bold">94.7%</p>
                </div>
                <Target className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <TabsTrigger value="lock" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all duration-200">
                Lock Funds
              </TabsTrigger>
              <TabsTrigger value="manage" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all duration-200">
                My Locks
              </TabsTrigger>
            </TabsList>

            {/* Lock Funds Tab */}
            <TabsContent value="lock" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Lock Form */}
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                      <Lock className="h-6 w-6 text-purple-600" />
                      Lock Your Funds
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Secure your savings and earn rewards
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Amount Input */}
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-base font-semibold flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        Amount to Lock (cUSD)
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-lg h-12 border-2 focus:border-purple-500 transition-colors"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Minimum: 10 cUSD • Maximum: 10,000 cUSD
                      </p>
                    </div>

                    {/* Duration Select */}
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-base font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        Lock Duration
                      </Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger className="h-12 border-2 focus:border-purple-500 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-sm text-gray-500">{option.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rewards Preview */}
                    {amount && (
                      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Zap className="h-5 w-5 text-green-600" />
                              <span className="font-semibold text-green-800 dark:text-green-200">Potential Rewards</span>
                            </div>
                            <span className="text-2xl font-bold text-green-600">
                              {calculateRewards(amount, duration)} MST
                            </span>
                          </div>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Earn MST tokens based on your lock amount and duration
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Warning Alert */}
                    <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-orange-800 dark:text-orange-200">
                        <strong>Important:</strong> Early withdrawal burns 50% of potential rewards.
                        Only lock funds you can commit to for the full duration.
                      </AlertDescription>
                    </Alert>

                    {/* Lock Button */}
                    <Button
                      onClick={handleLockFunds}
                      disabled={!isConnected || isPending || !amount || parseFloat(amount) < 10}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Locking Funds...
                        </div>
                      ) : !isConnected ? (
                        'Connect Wallet to Lock'
                      ) : (
                        'Lock Funds & Earn Rewards'
                      )}
                    </Button>

                    {error && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Failed to lock funds. Please check your inputs and try again.
                        </AlertDescription>
                      </Alert>
                    )}

                    {isSuccess && (
                      <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                          Funds locked successfully! Start earning rewards immediately.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Benefits & Info */}
                <div className="space-y-6">
                  <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        Why Lock Funds?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Earn Rewards</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Get MST tokens based on amount and duration locked
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Build Discipline</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Remove temptation and build better saving habits
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Blockchain Security</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Your funds are secured by smart contracts on Celo
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Flexible Terms</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Choose from 30 days to 1 year lock periods
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Reward Multipliers
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>30 days:</span>
                            <span className="font-semibold text-purple-600">1x rewards</span>
                          </div>
                          <div className="flex justify-between">
                            <span>90 days:</span>
                            <span className="font-semibold text-purple-600">2.5x rewards</span>
                          </div>
                          <div className="flex justify-between">
                            <span>180 days:</span>
                            <span className="font-semibold text-purple-600">5x rewards</span>
                          </div>
                          <div className="flex justify-between">
                            <span>365 days:</span>
                            <span className="font-semibold text-purple-600">10x rewards</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* My Locks Tab */}
            <TabsContent value="manage" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockLocks.map((lock) => (
                  <Card key={lock.id} className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold">Lock #{lock.id}</CardTitle>
                        <Badge variant={lock.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                          {lock.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        ${lock.amount} locked for {lock.duration} days
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{lock.progress}%</span>
                        </div>
                        <Progress value={lock.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Start Date</p>
                          <p className="font-semibold">{lock.startDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">End Date</p>
                          <p className="font-semibold">{lock.endDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">Rewards Earned</span>
                        <span className="text-lg font-bold text-green-600">{lock.rewards} MST</span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                        </Button>
                        {lock.status === 'active' && lock.progress < 100 && (
                          <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                            Early Unlock
                          </Button>
                        )}
                        {lock.status === 'completed' && (
                          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                            Claim Rewards
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {mockLocks.length === 0 && (
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Active Locks</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Start your savings journey by locking some funds and earning rewards.
                    </p>
                    <Button onClick={() => setActiveTab('lock')} className="bg-purple-600 hover:bg-purple-700">
                      Lock Your First Funds
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
              <Target className="h-6 w-6 text-purple-600" />
              How Piggy Box Works
            </CardTitle>
            <CardDescription className="text-lg">
              Simple steps to disciplined savings and rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-purple-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Choose Amount</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Decide how much you want to lock away for savings
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Set Duration</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pick a lock period from 30 days to 1 year
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-green-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Lock & Earn</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Funds are locked and you start earning MST rewards
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-orange-600">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Unlock & Claim</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unlock at maturity and claim your rewards
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
