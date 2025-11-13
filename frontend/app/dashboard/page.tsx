"use client";
import { Badge } from "@/components/ui/badge";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { PiggyBank, Users, Lock, CreditCard, TrendingUp, Shield, Zap, Award } from 'lucide-react';

// Contract addresses (replace with deployed addresses)
const ESUSU_THRIFT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Replace with actual
const MST_TOKEN_ADDRESS = '0x0987654321098765432109876543210987654321'; // Replace with actual

export default function DashboardPage() {
  const { isConnected, address } = useAccount();
  const [isClient, setIsClient] = useState(false);

  // Fix hydration mismatch by only showing connection status after client mount
  useEffect(() => {
    setIsClient(true);
    AOS.init({
      duration: 800,
      once: false,
      offset: 100,
    });
  }, []);

  // Mock data for demonstration - replace with actual contract reads
  const userStats = {
    totalSaved: 1250.50,
    activeGroups: 2,
    lockedSavings: 750.00,
    mstBalance: 125.75,
    nextPayout: "2024-02-15",
    savingsGoal: 2000,
    currentProgress: 62.5
  };

  const recentActivities = [
    { type: 'contribution', amount: 50, group: 'Family Circle', date: '2024-01-15', status: 'confirmed' },
    { type: 'payout', amount: 250, group: 'Work Team', date: '2024-01-10', status: 'received' },
    { type: 'lock', amount: 100, duration: '30 days', date: '2024-01-08', status: 'active' },
    { type: 'payment', amount: 75, recipient: 'Electricity Co.', date: '2024-01-05', status: 'paid' }
  ];

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-black dark:via-black dark:to-primary/10 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-black dark:via-black dark:to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-8">Please connect your wallet to access your dashboard</p>
          <div className="px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary hover:bg-primary/90 rounded-lg cursor-pointer">
            Connect Wallet
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-black dark:via-black dark:to-primary/10">
      <div className="relative flex w-full flex-col items-start justify-start overflow-hidden pb-20">
        <BackgroundRippleEffect />
        <div className="z-10 mt-10 w-full">
          <div className="flex justify-center items-center space-x-2 mb-2" data-aos="fade-down">
            <Badge
              variant="secondary"
              className="text-sm font-medium rounded-full py-2 px-4 shadow-lg backdrop-blur-sm bg-white/10 dark:bg-black/20 border border-white/20"
            >
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse mr-2"></span>{" "}
              Your Dashboard
            </Badge>
          </div>

          <p className="relative z-10 mx-auto mt-6 max-w-3xl text-center text-lg md:text-xl text-neutral-700 dark:text-neutral-300 leading-relaxed" data-aos="fade-up" data-aos-delay="400">
            Track your progress, manage your savings, and grow your wealth with real-time insights.

          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <section className="py-16 px-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800" data-aos="zoom-in" data-aos-delay="100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
                <PiggyBank className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">${userStats.totalSaved.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800" data-aos="zoom-in" data-aos-delay="200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{userStats.activeGroups}</div>
                <p className="text-xs text-muted-foreground">Rotating savings circles</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800" data-aos="zoom-in" data-aos-delay="300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Locked Savings</CardTitle>
                <Lock className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">${userStats.lockedSavings.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Time-locked funds</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800" data-aos="zoom-in" data-aos-delay="400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">MST Balance</CardTitle>
                <Award className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{userStats.mstBalance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Reward tokens earned</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-16 px-4" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Savings Progress */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl" data-aos="fade-right">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Savings Progress
                  </CardTitle>
                  <CardDescription>
                    Track your journey towards financial goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Current: ${userStats.totalSaved.toFixed(2)}</span>
                      <span>Goal: ${userStats.savingsGoal}</span>
                    </div>
                    <Progress value={userStats.currentProgress} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {userStats.currentProgress}% complete • ${(userStats.savingsGoal - userStats.totalSaved).toFixed(2)} remaining
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{userStats.nextPayout}</div>
                      <p className="text-sm text-muted-foreground">Next Payout Date</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">+${(userStats.totalSaved * 0.08).toFixed(2)}</div>
                      <p className="text-sm text-muted-foreground">Monthly Growth</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="mt-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl" data-aos="fade-right" data-aos-delay="200">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Your latest transactions and savings activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            activity.type === 'contribution' ? 'bg-blue-100 text-blue-600' :
                            activity.type === 'payout' ? 'bg-green-100 text-green-600' :
                            activity.type === 'lock' ? 'bg-purple-100 text-purple-600' :
                            'bg-orange-100 text-orange-600'
                          }`}>
                            {activity.type === 'contribution' && <PiggyBank className="h-4 w-4" />}
                            {activity.type === 'payout' && <TrendingUp className="h-4 w-4" />}
                            {activity.type === 'lock' && <Lock className="h-4 w-4" />}
                            {activity.type === 'payment' && <CreditCard className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{activity.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.type === 'contribution' && `to ${activity.group}`}
                              {activity.type === 'payout' && `from ${activity.group}`}
                              {activity.type === 'lock' && `${activity.duration} lock`}
                              {activity.type === 'payment' && `to ${activity.recipient}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${activity.type === 'payout' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                            {activity.type === 'payout' ? '+' : '-'}${activity.amount}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Features */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl" data-aos="fade-left">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Access your savings features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/thrift">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Join Thrift Group
                    </Button>
                  </Link>
                  <Link href="/piggy">
                    <Button className="w-full justify-start" variant="outline">
                      <Lock className="mr-2 h-4 w-4" />
                      Lock Savings
                    </Button>
                  </Link>
                  <Link href="/pay">
                    <Button className="w-full justify-start" variant="outline">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay Bills
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Security Status */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800" data-aos="fade-left" data-aos-delay="200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">All Systems Secure</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your funds are protected by smart contracts and blockchain security.
                  </p>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl" data-aos="fade-left" data-aos-delay="400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">APY</span>
                    <span className="font-semibold text-green-600">8.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Network Fee</span>
                    <span className="font-semibold">$0.01</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Uptime</span>
                    <span className="font-semibold text-green-600">99.9%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-blue-500/10" data-aos="fade-up">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-aos="fade-down">
            Ready to Grow Your Savings?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            Join thousands of users building wealth through community-powered savings on the blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
            <Link href="/thrift">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
                Start Saving Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2 hover:bg-primary hover:text-white transition-all duration-300">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
