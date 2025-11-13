import Link from "next/link";
import { PiggyBank, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <PiggyBank className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PiggySavfe
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              A decentralized savings platform on Celo blockchain. Build wealth through community thrift, time-locked savings, and secure payments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/thrift" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Thrift Savings</Link></li>
              <li><Link href="/piggy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Piggy Box</Link></li>
              <li><Link href="/pay" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Pay Bills</Link></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">MST Rewards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2024 PiggySavfe. Built on{" "}
            <a href="https://celo.org" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              Celo
            </a>
            {" "}blockchain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
