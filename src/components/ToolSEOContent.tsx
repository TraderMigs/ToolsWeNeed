import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Wrench } from 'lucide-react';
import { RequestToolButton } from './RequestToolButton';
import { FeedbackButton } from './FeedbackButton';

interface Tool {
  id: string;
  title: string;
  description: string;
  tags?: string;
  category?: string;
}

interface ToolSEOContentProps {
  tool: Tool;
}

export const ToolSEOContent: React.FC<ToolSEOContentProps> = ({ tool }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Generate SEO content based on tool metadata
  const generateSEOContent = () => {
    switch (tool.id) {
      case 'budget-card-conveyor':
        return {
          summary: `The Budget Card Conveyor is a comprehensive, free online budget planner that helps you track income and expenses across daily, weekly, monthly, and yearly periods. Unlike traditional budgeting apps that require signup and store your financial data on remote servers, this tool processes everything locally in your browser for complete privacy. It features intuitive category management, visual spending breakdowns, and flexible export options to help you take control of your finances without the complexity of spreadsheets.`,
          faqs: [
            {
              question: "What makes the Budget Card Conveyor different from other budget tools?",
              answer: "Unlike most budgeting apps that require paid subscriptions or account creation, the Budget Card Conveyor is completely free, works entirely in your browser for maximum privacy, and offers flexible categorization with visual spending breakdowns. It combines the simplicity of a card-based interface with powerful features like recurring transaction tracking and category analysis."
            },
            {
              question: "Can I export my budget data to other formats?",
              answer: "Yes, you can export your budget in multiple formats including PDF, Excel, CSV, and JSON. This makes it easy to share your financial plan with advisors, import into other software, or keep for your personal records. All exports are processed locally in your browser for complete data privacy."
            },
            {
              question: "Is my financial data secure when using this tool?",
              answer: "Absolutely. The Budget Card Conveyor processes all data locally in your browser. Your financial information never leaves your device unless you explicitly choose to export it. We don't store your data on our servers, and we don't require you to create an account or provide any personal information."
            }
          ]
        };
      case 'self-employed-tax-estimator':
        return {
          summary: `The Self-Employed Tax Estimator is a specialized calculator designed for freelancers, independent contractors, and small business owners who need to estimate their quarterly tax obligations. This free tool calculates both self-employment tax (Social Security and Medicare) and income tax based on your 1099 income, business deductions, and filing status. It provides clear breakdowns of federal taxes, self-employment taxes, and estimated quarterly payments to help you budget appropriately and avoid underpayment penalties.`,
          faqs: [
            {
              question: "How accurate is the Self-Employed Tax Estimator?",
              answer: "The Self-Employed Tax Estimator uses current tax brackets and self-employment tax rates to provide accurate estimates based on the information you provide. While it's designed to give you a reliable projection of your tax obligations, it should be used as a planning tool rather than a replacement for professional tax advice, especially for complex tax situations."
            },
            {
              question: "What deductions can I include in the tax calculator?",
              answer: "The calculator allows you to enter basic business deductions in the standard mode. In advanced mode, you can specify health insurance premiums, retirement contributions, home office deductions, vehicle expenses, equipment costs, and professional services. These specific deductions help provide a more accurate tax estimate tailored to your business situation."
            },
            {
              question: "How do I use this for quarterly estimated tax payments?",
              answer: "After entering your income and deductions, the calculator will show your estimated quarterly tax payment amount. This figure represents approximately 25% of your annual tax liability, which you would typically pay four times per year (April 15, June 15, September 15, and January 15). The tool also shows a monthly savings target to help you set aside the right amount each month."
            }
          ]
        };
      case 'debt-snowball-tracker':
        return {
          summary: `The Debt Snowball Tracker is a powerful tool that helps you implement the popular debt snowball method pioneered by financial experts. This strategy focuses on paying off your smallest debts first to build momentum and motivation as you work toward becoming debt-free. The tracker allows you to input all your debts, including credit cards, loans, and other liabilities, along with their balances, interest rates, and minimum payments. It then calculates your optimal payoff strategy, total payoff time, and monthly payment requirements.`,
          faqs: [
            {
              question: "What's the difference between the snowball and avalanche methods?",
              answer: "The debt snowball method prioritizes paying off debts from smallest balance to largest, regardless of interest rate. This approach provides psychological wins as you eliminate debts quickly, building momentum. The avalanche method prioritizes debts with the highest interest rates first, which mathematically saves more money in interest over time. Our Debt Snowball Tracker supports both methods, allowing you to choose the approach that works best for your financial situation and motivation style."
            },
            {
              question: "How do I track my progress with the Debt Snowball Tracker?",
              answer: "The tracker provides visual progress indicators showing how much debt you've paid off and how much remains. It calculates your projected debt-free date based on your current payment strategy and extra payment amount. You can update your debt balances regularly to see your progress and stay motivated as you watch your debts decrease over time."
            },
            {
              question: "Can I see how much interest I'll save by making extra payments?",
              answer: "Yes, the advanced mode of the Debt Snowball Tracker shows you the total interest you'll pay over the life of your debts, as well as how much interest you'll save by making extra payments. It also calculates how much faster you'll be debt-free by increasing your monthly payment amount, helping you understand the significant impact of even small additional payments."
            }
          ]
        };
      case 'hourly-rate-calculator':
        return {
          summary: `The Hourly Rate Calculator is a specialized tool for freelancers, consultants, and independent professionals who need to determine their optimal pricing strategy. Unlike basic calculators that simply convert annual salaries to hourly rates, this comprehensive tool factors in business expenses, taxes, desired profit margins, and non-billable time to calculate a sustainable rate that ensures profitability. It provides multiple rate structures including hourly, daily, weekly, and monthly options, giving you flexibility when presenting proposals to clients.`,
          faqs: [
            {
              question: "Why is my calculated hourly rate higher than expected?",
              answer: "Your calculated rate likely accounts for factors many freelancers overlook, such as taxes (which can be 25-30% for self-employed individuals), business expenses, non-billable time (admin, marketing, etc.), and a profit margin for business growth. The calculator provides a sustainable rate that ensures you can cover all these costs while meeting your income goals, rather than just converting your desired salary to an hourly figure, which often leads to underpricing and financial stress."
            },
            {
              question: "How do I account for non-billable time in my rate?",
              answer: "The calculator automatically factors in non-billable time by using industry standards where typically only 60-75% of working hours are billable. This adjustment ensures your billable hours generate enough revenue to cover the time spent on administrative tasks, marketing, professional development, and other non-billable activities that are essential to running your business."
            },
            {
              question: "Should I charge the same rate for all clients and projects?",
              answer: "While the calculator provides a baseline rate that ensures profitability, you may want to adjust your rates based on factors like project complexity, client budget, value delivered, and market positioning. The calculator gives you different rate structures (hourly, daily, weekly, monthly) that you can use for different scenarios, and the advanced mode provides insights on minimum project rates and retainer discounts."
            }
          ]
        };
      case 'fasting-planner':
      case 'macro-micronutrient-tracker':
        return {
          summary: `The Health Hub is a comprehensive tool that combines intermittent fasting tracking with nutrition monitoring in one seamless interface. The fasting component helps you implement various fasting protocols including 16:8, 18:6, 20:4, and OMAD (One Meal A Day), with a visual timer that shows your progress and remaining fasting time. The nutrition tracker monitors calories, protein, carbs, fat, fiber, and other essential nutrients with visual progress indicators. This all-in-one health companion helps you maintain optimal health without requiring paid subscriptions or account creation.`,
          faqs: [
            {
              question: "Which intermittent fasting schedule is best for beginners?",
              answer: "For beginners, the 16:8 fasting schedule (16 hours fasting, 8 hours eating) is generally recommended as it's the most sustainable and easiest to implement. This often means skipping breakfast and eating between noon and 8 PM. Our Health Hub tool supports multiple fasting schedules including 16:8, 18:6, 20:4, and OMAD (One Meal A Day), allowing you to start with an easier schedule and gradually progress to more advanced protocols as your body adapts."
            },
            {
              question: "What should I eat to break my fast?",
              answer: "The Health Hub includes a database of fast-breaking foods that are gentle on your digestive system after a period of fasting. Ideal foods include bone broth, avocados, leafy greens, eggs, and nuts. These foods provide essential nutrients without causing a significant insulin spike. The tool helps you log these foods and track their nutritional content to ensure you're breaking your fast optimally."
            },
            {
              question: "How do I track my macronutrients during eating windows?",
              answer: "The nutrition tracking component of the Health Hub allows you to log foods and automatically calculates their macronutrient content (protein, carbs, and fat). You can set daily goals for each macronutrient and see visual progress bars showing how close you are to meeting these targets. The tool also provides a breakdown of your macronutrient ratios, helping you maintain the balance that works best for your health goals."
            }
          ]
        };
      case 'trade-profit-risk-calculator':
        return {
          summary: `The Multi-Asset Trading Calculator is a comprehensive tool for traders and investors to calculate profit/loss, risk parameters, and margin requirements across multiple asset classes. Unlike specialized calculators limited to specific markets, this versatile tool handles Forex, Stocks, Futures, Options, Precious Metals, and Commodities with asset-specific calculations and terminology. It provides detailed analysis including position sizing, margin requirements, risk/reward ratios, breakeven prices, and pip/tick values to help you make informed trading decisions.`,
          faqs: [
            {
              question: "How do I calculate proper position sizing for risk management?",
              answer: "Proper position sizing is crucial for risk management in trading. Our Multi-Asset Trading Calculator helps you determine appropriate position sizes by factoring in your account size, risk tolerance (typically 1-2% of account per trade), and the distance to your stop loss. Enter your entry price and stop loss level, and the calculator will show you the maximum position size that keeps your risk within your predetermined limits, helping you maintain consistent risk management across different markets and instruments."
            },
            {
              question: "What's the difference between pip value and tick value?",
              answer: "Pip value and tick value are market-specific measurements of price movement. In Forex, a pip is typically the fourth decimal place (0.0001) for most currency pairs, while in futures markets, a tick is the minimum price movement (which varies by contract). The calculator automatically adjusts these values based on the asset class you select, showing you exactly how much money you'll make or lose per pip/tick movement, which is essential for precise risk calculation."
            },
            {
              question: "How does leverage affect my margin requirements?",
              answer: "Leverage allows you to control a larger position with a smaller amount of capital, but it also increases risk. The calculator shows you exactly how much margin (actual capital) is required based on your selected leverage ratio. Higher leverage means lower margin requirements but amplified gains and losses. The tool helps you understand the relationship between position size, leverage, and margin, ensuring you don't overleverage your account and risk margin calls."
            }
          ]
        };
      case 'freelance-proposal-estimator':
        return {
          summary: `The Freelance Proposal Estimator is a specialized tool designed to help freelancers, consultants, and independent professionals create accurate, professional project proposals with proper pricing. This comprehensive estimator breaks down projects into milestones, calculates costs based on hourly rates and estimated time, and generates complete proposal documents ready to send to clients. It helps freelancers avoid underpricing their services by providing a systematic approach to project estimation that includes all relevant costs and time requirements.`,
          faqs: [
            {
              question: "How do I determine the right contingency percentage for my project?",
              answer: "The appropriate contingency percentage depends on several factors including project complexity, your familiarity with the client and work type, and potential unknowns. For straightforward projects with clear requirements and familiar clients, 10-15% is typically sufficient. For complex projects with many variables or new clients, consider 20-25%. The Freelance Proposal Estimator allows you to adjust this percentage and immediately see how it affects your total project price."
            },
            {
              question: "Should I include a detailed breakdown of hours in my client proposal?",
              answer: "While the Freelance Proposal Estimator helps you calculate hours accurately for internal planning, whether to include detailed hourly breakdowns in client-facing proposals depends on your pricing strategy. For value-based pricing, you might show only milestone totals without hourly details. For time-based pricing, transparent hourly breakdowns can build trust. The tool generates a professional proposal text that you can customize based on your preferred approach."
            },
            {
              question: "How can I ensure my proposal is competitive without underpricing?",
              answer: "The Freelance Proposal Estimator helps you find this balance by starting with your actual costs (time at your sustainable hourly rate) and adding appropriate contingency. This ensures you're covering your needs while remaining competitive. Rather than reducing your price to win projects, consider adjusting scope or deliverables to meet client budgets while maintaining your rates. The tool's milestone structure makes it easy to present different project options at different price points."
            }
          ]
        };
      default:
        // Generic SEO content for other tools
        return {
          summary: `The ${tool.title} is a free online tool designed to help you ${tool.description.toLowerCase()} without requiring any signup, download, or installation. This browser-based calculator provides professional-grade functionality that works on any device, from smartphones to desktop computers, making it accessible whenever and wherever you need it. Unlike many similar tools that require paid subscriptions or limit features in free versions, our ${tool.title} offers complete functionality at no cost, with all calculations and data processing happening directly in your browser for maximum privacy and security.`,
          faqs: [
            {
              question: `How accurate is the ${tool.title}?`,
              answer: `The ${tool.title} uses standard formulas and best practices to provide accurate calculations and estimates. However, it should be used for informational purposes only. For critical financial, health, or business decisions, we recommend consulting with a qualified professional who can provide personalized advice based on your specific situation.`
            },
            {
              question: `Can I save or export my data from the ${tool.title}?`,
              answer: `Yes, the ${tool.title} allows you to export your data in multiple formats including PDF, CSV, and Excel. Your data is automatically saved in your browser's local storage, so you can return to it later without losing your work. For additional privacy, you can clear saved data at any time using the "Clear Saved Data" button.`
            },
            {
              question: `Is my data private when using the ${tool.title}?`,
              answer: `Absolutely. The ${tool.title} processes all data locally in your browser. Your information never leaves your device unless you explicitly choose to export it. We don't store your inputs on our servers, and we don't require you to create an account or provide any personal information to use the tool.`
            }
          ]
        };
    }
  };

  const seoContent = generateSEOContent();

  return (
    <section className="mt-8 pt-8 border-t border-gray-800" id={`seo-content-${tool.id}`}>
      <div className="max-w-4xl mx-auto text-left">
        <h2 id={`about-${tool.id}`} className="text-xl font-bold text-white mb-4">About {tool.title}</h2>
        <div className="text-gray-400 text-sm space-y-4">
          <p>{seoContent.summary}</p>
        </div>
        
        <div className="mt-8">
          <h3 id={`${tool.id}-faq`} className="text-lg font-bold text-white mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {seoContent.faqs.map((faq, index) => (
              <details key={index} className="bg-gray-800 rounded-lg p-4">
                <summary className="font-medium text-white cursor-pointer">{faq.question}</summary>
                <p className="mt-2 text-gray-400 text-sm">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <h3 className="text-lg font-bold text-white mb-4">Can't Find What You Need?</h3>
          <div className="flex justify-center">
            <div className="flex gap-2">
              <RequestToolButton variant="primary" />
              <FeedbackButton 
                toolId={tool.id} 
                toolName={tool.title} 
                variant="secondary" 
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            We're constantly adding new tools based on user requests.
          </p>
        </div>
        
        <div className="mt-8">
          <h3 id={`tips-for-${tool.id}`} className="text-lg font-bold text-white mb-4">Tips for Getting the Most from {tool.title}</h3>
          <div className="space-y-3">
            {tool.id === 'budget-card-conveyor' && (
              <>
                <p className="text-sm text-gray-400">• Start by entering all your income sources to get an accurate picture of your total monthly income.</p>
                <p className="text-sm text-gray-400">• Categorize expenses consistently to better track spending patterns over time.</p>
                <p className="text-sm text-gray-400">• Use the advanced mode to prioritize expenses and identify non-essential spending.</p>
                <p className="text-sm text-gray-400">• Export your budget regularly to track changes and progress over time.</p>
              </>
            )}
            {tool.id === 'self-employed-tax-estimator' && (
              <>
                <p className="text-sm text-gray-400">• Keep detailed records of all business expenses to maximize your deductions.</p>
                <p className="text-sm text-gray-400">• Use the advanced mode to account for health insurance, retirement contributions, and home office deductions.</p>
                <p className="text-sm text-gray-400">• Calculate your taxes quarterly to avoid underpayment penalties.</p>
                <p className="text-sm text-gray-400">• Save your estimated quarterly tax amount in a separate account to ensure funds are available when taxes are due.</p>
              </>
            )}
            {tool.id === 'debt-snowball-tracker' && (
              <>
                <p className="text-sm text-gray-400">• Enter all your debts, even small ones, to get a complete picture of your debt situation.</p>
                <p className="text-sm text-gray-400">• Try both the snowball and avalanche methods to see which saves more money and time.</p>
                <p className="text-sm text-gray-400">• Add any extra funds you can to your monthly debt payment to accelerate your payoff timeline.</p>
                <p className="text-sm text-gray-400">• Update your balances regularly to stay motivated by seeing your progress.</p>
              </>
            )}
            {tool.id === 'fasting-planner' && (
              <>
                <p className="text-sm text-gray-400">• Start with a 16:8 fasting schedule if you're new to intermittent fasting.</p>
                <p className="text-sm text-gray-400">• Enable hydration reminders to maintain proper water intake during fasting periods.</p>
                <p className="text-sm text-gray-400">• Use the nutrition tracker to ensure you're getting balanced nutrition during eating windows.</p>
                <p className="text-sm text-gray-400">• Track your fasting history to identify patterns and optimize your schedule.</p>
              </>
            )}
            {tool.id === 'trade-profit-risk-calculator' && (
              <>
                <p className="text-sm text-gray-400">• Always set stop loss and take profit levels before entering a trade.</p>
                <p className="text-sm text-gray-400">• Aim for a risk-reward ratio of at least 1:2 (risking 1 to potentially gain 2).</p>
                <p className="text-sm text-gray-400">• Use the position size calculator to ensure you're not risking more than 1-2% of your account on any single trade.</p>
                <p className="text-sm text-gray-400">• Account for commission costs in your calculations for more accurate profit/loss projections.</p>
              </>
            )}
            {tool.id === 'hourly-rate-calculator' && (
              <>
                <p className="text-sm text-gray-400">• Include all business expenses, including software subscriptions, equipment, and professional development.</p>
                <p className="text-sm text-gray-400">• Account for non-billable time spent on admin, marketing, and client acquisition.</p>
                <p className="text-sm text-gray-400">• Add a profit margin to ensure business growth and financial stability.</p>
                <p className="text-sm text-gray-400">• Revisit and recalculate your rates at least annually as expenses and experience increase.</p>
              </>
            )}
            {!['budget-card-conveyor', 'self-employed-tax-estimator', 'debt-snowball-tracker', 'fasting-planner', 'trade-profit-risk-calculator', 'hourly-rate-calculator'].includes(tool.id) && (
              <>
                <p className="text-sm text-gray-400">• Take time to explore all features and options available in the tool.</p>
                <p className="text-sm text-gray-400">• Use the export functionality to save your data for future reference.</p>
                <p className="text-sm text-gray-400">• Check out related tools that might complement your current task.</p>
                <p className="text-sm text-gray-400">• Bookmark this tool for easy access whenever you need it.</p>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-sm text-gray-500 hover:text-gray-400 flex items-center gap-1 mx-auto"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Learn more about this tool
            </>
          )}
        </button>
      </div>
    </section>
  );
};