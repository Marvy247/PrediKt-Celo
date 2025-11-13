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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Minus, Clock, DollarSign, Shield, TrendingUp, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';

const ESUSU_THRIFT_ADDRESS = '0x51F3c2Eb22BD3aaBcF5159dCDc8a1C3C7DDACaB7'; // Replace with deployed address

export default function ThriftPage() {
  const { address, isConnected } = useAccount();
  const [participants, setParticipants] = useState<string[]>(['', '']);
  const [contributionAmount, setContributionAmount] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [activeTab, setActiveTab] = useState('create');

  // Join tab states
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minContribution, setMinContribution] = useState('');
  const [maxContribution, setMaxContribution] = useState('');
  const [minParticipants, setMinParticipants] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  // Read campaign count
  const { data: campaignCount } = useReadContract({
    address: ESUSU_THRIFT_ADDRESS,
    abi: [
      {
        inputs: [],
        name: 'campaignCount',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      }
    ],
    functionName: 'campaignCount'
  });

  // Fetch campaigns on mount or when campaignCount changes
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!campaignCount) return;

      const fetchedCampaigns: any[] = [];
      for (let i = 1; i <= Number(campaignCount); i++) {
        try {
          const { data: campaignData } = useReadContract({
            address: ESUSU_THRIFT_ADDRESS,
            abi: [
              {
                inputs: [{ name: '_campaignId', type: 'uint256' }],
                name: 'getCampaign',
                outputs: [
                  { name: 'participants', type: 'address[]' },
                  { name: 'contributionAmount', type: 'uint256' },
                  { name: 'currentRound', type: 'uint256' },
                  { name: 'active', type: 'bool' }
                ],
                stateMutability: 'view',
                type: 'function'
              }
            ],
            functionName: 'getCampaign',
            args: [BigInt(i)]
          });

          if (campaignData) {
            const [participants, contributionAmount, currentRound, active] = campaignData;
            fetchedCampaigns.push({
              id: i,
              participants: participants.length,
              participantAddresses: participants,
              contributionAmount: formatEther(contributionAmount),
              currentRound: Number(currentRound),
              totalRounds: 5,
              status: active ? 'active' : 'completed',
              nextPayout: active ? 'Next round pending' : 'Completed'
            });
          }
        } catch (error) {
          console.error(`Error fetching campaign ${i}:`, error);
        }
      }
      setCampaigns(fetchedCampaigns);
      setFilteredCampaigns(fetchedCampaigns);
    };

    fetchCampaigns();
  }, [campaignCount]);

  // Apply filters
  useEffect(() => {
    let filtered = campaigns;

    if (searchId) {
      filtered = filtered.filter(c => c.id.toString().includes(searchId));
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (minContribution) {
      filtered = filtered.filter(c => parseFloat(c.contributionAmount) >= parseFloat(minContribution));
    }

    if (maxContribution) {
      filtered = filtered.filter(c => parseFloat(c.contributionAmount) <= parseFloat(maxContribution));
    }

    if (minParticipants) {
      filtered = filtered.filter(c => c.participants >= parseInt(minParticipants));
    }

    if (maxParticipants) {
      filtered = filtered.filter(c => c.participants <= parseInt(maxParticipants));
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchId, statusFilter, minContribution, maxContribution, minParticipants, maxParticipants]);

  const handleCreateCampaign = async () => {
    if (!isConnected) return;

    const validParticipants = participants.filter(p => p.length === 42 && p.startsWith('0x'));
    if (validParticipants.length < 2 || validParticipants.length > 5) {
      alert('Please enter 2-5 valid Ethereum addresses');
      return;
    }

    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      alert('Please enter a valid contribution amount');
      return;
    }

    try {
      writeContract({
        address: ESUSU_THRIFT_ADDRESS,
        abi: [
          {
            inputs: [
              { name: '_participants', type: 'address[]' },
              { name: '_contributionAmount', type: 'uint256' }
            ],
            name: 'createCampaign',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ],
        functionName: 'createCampaign',
        args: [validParticipants as `0x${string}`[], parseEther(contributionAmount)]
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const handleJoinCampaign = async (campaignId: number) => {
    if (!isConnected || !selectedCampaign) return;

    // Check if user is a participant
    const isParticipant = selectedCampaign.participantAddresses.some((addr: string) => addr.toLowerCase() === address?.toLowerCase());
    if (!isParticipant) {
      alert('You are not a participant in this campaign. Only participants can contribute.');
      return;
    }

    try {
      writeContract({
        address: ESUSU_THRIFT_ADDRESS,
        abi: [
          {
            inputs: [{ name: '_campaignId', type: 'uint256' }],
            name: 'contribute',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ],
        functionName: 'contribute',
        args: [BigInt(campaignId)]
      });
    } catch (error) {
      console.error('Error joining campaign:', error);
    }
  };

  const addParticipant = () => {
    if (participants.length < 5) {
      setParticipants([...participants, '']);
    }
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 2) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const updateParticipant = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-6 shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-4">
            Thrift Savings
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join rotating savings groups where you contribute monthly and take turns receiving the full pot.
            Build wealth faster through community-powered savings.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Groups</p>
                  <p className="text-3xl font-bold">247</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Saved</p>
                  <p className="text-3xl font-bold">$125K</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Avg. Cycle</p>
                  <p className="text-3xl font-bold">4.2mo</p>
                </div>
                <Clock className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Success Rate</p>
                  <p className="text-3xl font-bold">98.5%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <TabsTrigger value="create" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all duration-200">
                Create Campaign
              </TabsTrigger>
              <TabsTrigger value="join" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all duration-200">
                Join Campaign
              </TabsTrigger>
              <TabsTrigger value="manage" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all duration-200">
                My Campaigns
              </TabsTrigger>
            </TabsList>

            {/* Create Campaign Tab */}
            <TabsContent value="create" className="space-y-6">
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                    <Plus className="h-6 w-6 text-blue-600" />
                    Create New Thrift Campaign
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Set up a rotating savings group with friends and family
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contribution Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="contribution" className="text-base font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      Monthly Contribution (cUSD)
                    </Label>
                    <Input
                      id="contribution"
                      type="number"
                      placeholder="100"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="text-lg h-12 border-2 focus:border-blue-500 transition-colors"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Each participant contributes this amount every month
                    </p>
                  </div>

                  {/* Participants */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        Participants ({participants.length})
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addParticipant}
                          disabled={participants.length >= 5}
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Add
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {participants.map((participant, index) => (
                        <div key={index} className="flex gap-3 items-center">
                          <div className="flex-1">
                            <Input
                              type="text"
                              placeholder={`Participant ${index + 1} wallet address`}
                              value={participant}
                              onChange={(e) => updateParticipant(index, e.target.value)}
                              className="h-12 border-2 focus:border-blue-500 transition-colors"
                            />
                          </div>
                          {participants.length > 2 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeParticipant(index)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Only add wallet addresses you trust. All contributions are secured by smart contracts on the blockchain.
                      </AlertDescription>
                    </Alert>
                  </div>

                  {/* Create Button */}
                  <Button
                    onClick={handleCreateCampaign}
                    disabled={!isConnected || isPending || !contributionAmount || participants.filter(p => p.length === 42 && p.startsWith('0x')).length < 2}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Campaign...
                      </div>
                    ) : !isConnected ? (
                      'Connect Wallet to Create'
                    ) : (
                      'Create Thrift Campaign'
                    )}
                  </Button>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Failed to create campaign. Please check your inputs and try again.
                      </AlertDescription>
                    </Alert>
                  )}

                  {isSuccess && (
                    <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        Campaign created successfully! Check your campaigns tab to manage it.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Join Campaign Tab */}
            <TabsContent value="join" className="space-y-6">
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                    <Users className="h-6 w-6 text-green-600" />
                    Join Existing Campaign
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Browse and join active thrift campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-1">
                        <Search className="h-4 w-4" />
                        Search by ID
                      </Label>
                      <Input
                        type="text"
                        placeholder="Campaign ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-1">
                        <Filter className="h-4 w-4" />
                        Status
                      </Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Contribution Range (cUSD)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={minContribution}
                          onChange={(e) => setMinContribution(e.target.value)}
                          className="h-9"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={maxContribution}
                          onChange={(e) => setMaxContribution(e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Participants Range</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={minParticipants}
                          onChange={(e) => setMinParticipants(e.target.value)}
                          className="h-9"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={maxParticipants}
                          onChange={(e) => setMaxParticipants(e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Campaign Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampaigns.map((campaign) => (
                      <Card key={campaign.id} className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => { setSelectedCampaign(campaign); setDialogOpen(true); }}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold">Campaign #{campaign.id}</CardTitle>
                            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                              {campaign.status}
                            </Badge>
                          </div>
                          <CardDescription>
                            {campaign.participants} participants • ${campaign.contributionAmount}/month
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{campaign.currentRound}/{campaign.totalRounds} rounds</span>
                            </div>
                            <Progress value={(campaign.currentRound / campaign.totalRounds) * 100} className="h-2" />
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                            <span>{campaign.nextPayout}</span>
                            <span className="font-semibold text-green-600">
                              ${(parseFloat(campaign.contributionAmount) * campaign.participants).toLocaleString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredCampaigns.length === 0 && (
                    <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <CardContent className="text-center py-12">
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Campaigns Found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Try adjusting your filters or create a new campaign.
                        </p>
                        <Button onClick={() => setActiveTab('create')} className="bg-blue-600 hover:bg-blue-700">
                          Create Campaign
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Campaign Details Dialog */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                      <Users className="h-6 w-6 text-green-600" />
                      Campaign #{selectedCampaign?.id} Details
                    </DialogTitle>
                    <DialogDescription>
                      Review campaign details and join if you're a participant
                    </DialogDescription>
                  </DialogHeader>

                  {selectedCampaign && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Status</Label>
                          <Badge variant={selectedCampaign.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                            {selectedCampaign.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Participants</Label>
                          <p className="text-lg font-semibold">{selectedCampaign.participants}</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Monthly Contribution</Label>
                          <p className="text-lg font-semibold">${selectedCampaign.contributionAmount} cUSD</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Current Round</Label>
                          <p className="text-lg font-semibold">{selectedCampaign.currentRound}/{selectedCampaign.totalRounds}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Participant Addresses</Label>
                        <div className="max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          {selectedCampaign.participantAddresses.map((addr: string, index: number) => (
                            <p key={index} className="text-sm font-mono break-all">
                              {index + 1}. {addr}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Progress</Label>
                        <Progress value={(selectedCampaign.currentRound / selectedCampaign.totalRounds) * 100} className="h-3" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedCampaign.nextPayout}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleJoinCampaign(selectedCampaign.id)}
                          disabled={!isConnected || selectedCampaign.status !== 'active' || isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {isPending ? 'Contributing...' : !isConnected ? 'Connect Wallet' : 'Contribute & Join'}
                        </Button>
                        <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                          Close
                        </Button>
                      </div>

                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Failed to contribute. Please check your wallet and try again.
                          </AlertDescription>
                        </Alert>
                      )}

                      {isSuccess && (
                        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription className="text-green-800 dark:text-green-200">
                            Successfully contributed to the campaign!
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* My Campaigns Tab */}
            <TabsContent value="manage" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.filter(c => c.participantAddresses.some((addr: string) => addr.toLowerCase() === address?.toLowerCase())).map((campaign) => (
                  <Card key={campaign.id} className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold">Campaign #{campaign.id}</CardTitle>
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                          {campaign.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {campaign.participants} participants • ${campaign.contributionAmount}/month
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{campaign.currentRound}/{campaign.totalRounds} rounds</span>
                        </div>
                        <Progress value={(campaign.currentRound / campaign.totalRounds) * 100} className="h-2" />
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                        <span>Next payout: {campaign.nextPayout}</span>
                        <span className="font-semibold text-green-600">
                          ${(parseFloat(campaign.contributionAmount) * campaign.participants).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedCampaign(campaign); setDialogOpen(true); }}>
                          View Details
                        </Button>
                        {campaign.status === 'active' && (
                          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handleJoinCampaign(campaign.id)}>
                            Contribute
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {campaigns.filter(c => c.participantAddresses.some((addr: string) => addr.toLowerCase() === address?.toLowerCase())).length === 0 && (
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Campaigns Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Create your first thrift campaign or join an existing one to get started.
                    </p>
                    <Button onClick={() => setActiveTab('create')} className="bg-blue-600 hover:bg-blue-700">
                      Create Campaign
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
              <Shield className="h-6 w-6 text-blue-600" />
              How Thrift Savings Works
            </CardTitle>
            <CardDescription className="text-lg">
              A proven method for building wealth through community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Form a Group</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  2-5 trusted participants agree to contribute monthly
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Monthly Contributions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Each member contributes the agreed amount every month
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Rotating Payouts</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Each month, one participant receives the entire pot
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-orange-600">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Complete the Cycle</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Continue until all members have received their payout
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
