import React from 'react';
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
      case 'health-hub':
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
      case 'net-worth-snapshot':
        return {
          summary: `The Net Worth Snapshot gives you a complete picture of your financial position in one place: everything you own (cash, bank accounts, investments, retirement accounts, property, vehicles) minus everything you owe (credit cards, student loans, car loans, mortgage). The difference is your net worth — the single most useful number for measuring long-term financial progress, because it captures the combined effect of saving, investing, and paying down debt. Everything is calculated locally in your browser: no account, no bank connections, and none of your financial details ever leave your device.`,
          faqs: [
            {
              question: "What counts as an asset and what counts as a liability?",
              answer: "Assets are things you own that have monetary value: checking and savings balances, investment and retirement accounts, your home's market value, vehicles, and valuables. Liabilities are debts you owe: mortgage balance, car loans, student loans, credit card balances, and personal loans. Net worth is simply total assets minus total liabilities — and it's completely normal for it to be negative early on, especially with student loans or a new mortgage."
            },
            {
              question: "How often should I update my net worth?",
              answer: "Monthly or quarterly is the sweet spot. Checking more often just adds noise from market swings; checking less often makes it hard to spot trends. The direction over time matters far more than any single number — a net worth that rises steadily, even slowly, means your saving and debt payoff are working."
            },
            {
              question: "Should I include my home and car in my net worth?",
              answer: "Yes — use realistic current market values, not what you paid. For your home, a conservative estimate from recent neighborhood sales works well; list the remaining mortgage as a liability so only your equity adds to net worth. Cars belong too, but remember they depreciate, so revisit their value when you update. Some people track a second 'liquid net worth' that excludes home and vehicles to see what's actually accessible."
            }
          ]
        };
      case 'savings-goal-tracker':
        return {
          summary: `The Savings Goal Tracker turns a vague intention — "I should save more" — into a concrete, dated plan. Set a target amount for anything from an emergency fund to a house down payment, tell it what you've saved so far and what you can put aside regularly, and it projects exactly when you'll hit the goal, with visual progress tracking to keep you motivated along the way. Because progress you can see is progress you keep making, the tracker shows how small changes to your monthly contribution move your finish date. All data stays in your browser — no signup and no bank access required.`,
          faqs: [
            {
              question: "How much should I save for an emergency fund?",
              answer: "The standard guidance is three to six months of essential expenses — rent or mortgage, food, utilities, insurance, and minimum debt payments. If your income is variable (freelancing, commission, seasonal work), aim closer to six months or more. Set that number as your goal in the tracker and it will show exactly how long your current savings rate needs to get there."
            },
            {
              question: "Is it better to save for multiple goals at once or one at a time?",
              answer: "Both approaches work; what matters is intentionality. Focusing on one goal builds momentum fast and suits urgent priorities like a starter emergency fund. Splitting contributions across goals — say 70% to a house fund and 30% to travel — keeps long and short-term priorities moving together. The tracker's projections make the trade-off visible: you can see exactly how splitting contributions changes each finish date."
            },
            {
              question: "Where should I keep the money I'm saving toward a goal?",
              answer: "For goals within a few years, a high-yield savings account keeps the money safe and accessible while earning meaningful interest. For goals five or more years out, some people invest a portion for growth, accepting market swings along the way. This tracker helps with the how-much and by-when; for where-to-put-it questions involving investments, consider talking to a qualified financial adviser."
            }
          ]
        };
      case 'loan-comparison-tool':
        return {
          summary: `The Loan Comparison Tool lets you put two or more loan offers side by side and see what each one really costs. Enter the amount, interest rate, term, and any fees for each offer, and it produces monthly payments, total interest paid, and complete amortization schedules — the month-by-month breakdown of how much of each payment goes to interest versus principal. The difference between two seemingly similar offers routinely adds up to thousands of dollars over a loan's life, and this tool makes that difference visible before you sign anything. It works entirely in your browser with no credit check, no personal information, and no effect on your credit score.`,
          faqs: [
            {
              question: "What's the difference between interest rate and APR?",
              answer: "The interest rate is what the lender charges on the borrowed money itself. APR (Annual Percentage Rate) includes that interest plus most fees — origination fees, closing costs, and other charges — expressed as a yearly rate. That makes APR the better number for comparing offers: a loan with a lower interest rate but heavy fees can easily have a higher APR, and cost more, than a competitor."
            },
            {
              question: "Is a shorter loan term always better?",
              answer: "A shorter term means higher monthly payments but dramatically less total interest — on a typical mortgage, choosing 15 years over 30 can save six figures in interest. But the higher payment is mandatory every single month, so it only makes sense if your budget comfortably absorbs it. The amortization tables in this tool show the exact trade-off for your numbers, so you can decide with real figures instead of rules of thumb."
            },
            {
              question: "How do extra payments change what I owe?",
              answer: "Extra payments go straight at the principal, which shrinks the balance that future interest is calculated on — so every extra dollar saves interest for the entire remaining life of the loan. Paying extra early in the term has an outsized effect because that's when balances, and therefore interest charges, are highest. Check whether a loan carries prepayment penalties before committing to that strategy."
            }
          ]
        };
      case 'subscription-purge-tool':
        return {
          summary: `The Subscription Purge Tool helps you find out what your recurring payments actually add up to — and the answer usually stings. List every subscription you can find (streaming, software, apps, memberships, deliveries), and the tool totals them monthly and yearly so the true cost stops hiding as a scatter of small charges. Surveys consistently find people underestimate their subscription spending by well over a hundred dollars a month, largely from services they forgot they had. Everything runs locally in your browser, and you can export your list to keep or share.`,
          faqs: [
            {
              question: "How do I find subscriptions I've forgotten about?",
              answer: "Go through the last two or three months of statements on every card and bank account, and search your email for the words 'receipt', 'renewal', and 'subscription'. Check your phone's app-store subscription page (App Store or Google Play), which quietly accumulates recurring charges. Add each one to the tool as you find it — seeing the running total grow is usually all the motivation needed to start cancelling."
            },
            {
              question: "Which subscriptions should I cancel first?",
              answer: "Sort by the simple question: when did I last actually use this? Anything untouched in 60+ days is a strong cancel candidate — you can nearly always re-subscribe later if you genuinely miss it. Next, look for overlap: multiple streaming services, duplicate cloud storage, or a gym plus fitness apps. The tool's totals help you see what each cut is worth per year, which makes the decision concrete."
            },
            {
              question: "What's the annual cost of my subscriptions really telling me?",
              answer: "Monthly prices are designed to feel small — $12.99 sounds trivial, but that's $156 a year, and ten subscriptions like it are $1,500+ a year. The yearly total in this tool represents real trade-offs: a vacation, an emergency fund contribution, or a chunk of debt payoff. Many services also offer annual billing at a discount, so for subscriptions you're keeping, switching billing cycles can trim the total further."
            }
          ]
        };
      case 'cost-of-living-calculator':
        return {
          summary: `The Cost of Living Calculator compares what everyday life actually costs between major US cities — housing, food, transportation, utilities, healthcare, and entertainment — so you can evaluate a move or a job offer with real numbers instead of guesses. A higher salary in a pricier city can easily leave you worse off, and this calculator shows the break-even clearly: what you'd need to earn in the new city to keep your current standard of living. The underlying city data is based on 2024 averages adjusted to 2026 dollars using cumulative US CPI, and every comparison runs privately in your browser.`,
          faqs: [
            {
              question: "How should I compare a job offer in another city?",
              answer: "Compare the percentage difference in living costs against the percentage difference in pay. If the new city costs 25% more overall but the offer pays only 10% more, you're effectively taking a pay cut. Housing dominates the math in most comparisons, so pay special attention to that line — and remember state and local taxes, which this comparison doesn't include, can move the answer further in either direction."
            },
            {
              question: "Why do the numbers here differ from what I see on other sites?",
              answer: "Cost-of-living figures are estimates built from averages, and every source samples differently — different neighborhoods, apartment sizes, and spending habits. Our figures are city-wide averages (2024 base data adjusted to 2026 dollars via CPI) meant for comparing cities against each other, which is more reliable than treating any single dollar figure as exact. For a big decision, use this tool for the big picture, then verify actual rents on listing sites for the specific neighborhoods you'd consider."
            },
            {
              question: "What costs does the comparison include and what should I add myself?",
              answer: "The calculator covers the six major recurring categories: housing, food, transportation, utilities, healthcare, and entertainment. It doesn't include income taxes (which vary hugely by state), childcare, or one-time moving costs — all worth adding to your own math. Childcare in particular can rival rent in some metros, so if it applies to you, research it separately before deciding."
            }
          ]
        };
      case 'subscription-swap-finder':
        return {
          summary: `The Subscription Swap Finder helps you stop overpaying for software and services by surfacing free or cheaper alternatives to popular paid subscriptions. Search for a service you currently pay for — design tools, cloud storage, streaming, productivity apps — and see comparable options with feature comparisons and the potential yearly savings from switching. Many paid tools have genuinely capable free or budget alternatives that most people simply never hear about, because free products don't buy ads. The finder runs in your browser and never asks what you're subscribed to or who you are.`,
          faqs: [
            {
              question: "Are free alternatives actually good enough to replace paid tools?",
              answer: "Frequently, yes — for the way most people actually use them. Casual users of design, office, or storage tools typically touch a fraction of the features they pay for, and mature free alternatives cover that core usage well. Power users with advanced needs may still be better served by the paid option. The honest test: list the three features you genuinely use every week, and check the alternative covers them before switching."
            },
            {
              question: "What should I check before cancelling and switching?",
              answer: "Three things: first, export your data from the old service while your account is still active. Second, confirm the alternative handles your files or formats — run it in parallel for a week before cancelling. Third, check the cancellation terms so you don't pay for an extra cycle. Doing the switch in that order makes it painless and reversible."
            },
            {
              question: "How much can switching realistically save per year?",
              answer: "Households and freelancers commonly carry several hundred to over a thousand dollars a year in software and service subscriptions. Swapping even two or three of them for capable free alternatives routinely saves $200–$600 annually, and downgrading overpowered plans (paying for team tiers as a solo user, for instance) adds more. The finder shows per-service savings so you can total up your own number rather than trusting a generic claim."
            }
          ]
        };
      case 'resume-scanner':
        return {
          summary: `The Resume Scanner compares your resume against a job description the way applicant tracking systems (ATS) do: by matching keywords and skills. Paste in both documents and it shows your match percentage, which required terms appear in your resume, and which are missing — so you can close the gaps before a hiring system or recruiter filters you out. Most mid-size and large employers screen applications with ATS software before a human reads them, which means tailoring your resume to each posting isn't optional anymore; it's the price of entry. Your resume text is processed entirely in your browser and never uploaded anywhere.`,
          faqs: [
            {
              question: "What match percentage should I aim for?",
              answer: "There's no universal cutoff, but as a working rule, above roughly 70% keyword alignment puts you in solid shape, while below 50% suggests the resume needs tailoring for this specific posting. Focus on the missing terms the scanner flags — especially hard skills, tools, and certifications named in the requirements section — and add the ones you genuinely have. Never add skills you don't possess; the goal is to accurately describe your experience in the language the employer uses."
            },
            {
              question: "How do I add keywords without making my resume read like spam?",
              answer: "Weave missing terms into real accomplishments rather than listing them bare. If the posting wants 'project management' and you led projects, rewrite a bullet as 'Managed a 6-month project across 3 teams...' — the keyword lands inside evidence. Mirror the job posting's exact phrasing where honest (if they say 'customer success' and you wrote 'client relations', use their term). A skills section helps for tools and certifications, but the strongest matches appear inside experience bullets."
            },
            {
              question: "Why does my strong resume score low against some postings?",
              answer: "Usually vocabulary mismatch, not weak experience. Different industries name the same skill differently — 'stakeholder management' vs 'client relations', 'CI/CD' vs 'deployment automation'. Job postings also bury requirements in paragraphs the eye skims but a scanner reads. A low score is a signal to translate your experience into that employer's dialect, and occasionally it's a genuine signal that the role emphasizes skills you'd need to build — useful information either way."
            }
          ]
        };
      case 'meeting-cost-estimator':
        return {
          summary: `The Meeting Cost Estimator puts a dollar figure on something organizations rarely measure: what a meeting actually costs in salaried time. Enter the number of attendees, their approximate hourly rates, and the meeting length, and the tool calculates the true cost of that recurring status call or planning session. A one-hour meeting with eight mid-level attendees routinely costs several hundred dollars — and run weekly, it's a five-figure annual line item that never appears in any budget. Seeing the number changes behavior: shorter meetings, tighter invite lists, and agendas that respect what the time is worth.`,
          faqs: [
            {
              question: "How do I estimate attendee hourly rates without knowing salaries?",
              answer: "Use role-level approximations rather than actual salaries: a rough annual salary for each seniority level divided by 2,080 (working hours in a year). Many teams add 25–40% on top for benefits and overhead to reflect the true employment cost. The result doesn't need to be precise to be useful — even conservative estimates usually make the point that meeting time is expensive."
            },
            {
              question: "What's a reasonable way to cut meeting costs without cutting communication?",
              answer: "Three levers move the number most: fewer attendees (invite only people who will speak or decide — others can read notes), shorter default lengths (25 minutes instead of 60 forces agendas to focus), and lower frequency (many weekly meetings work fine biweekly). Run the estimator on your standing meetings, and start with the most expensive one. A written status update often replaces the priciest recurring meeting outright."
            },
            {
              question: "Should every meeting be judged by its dollar cost?",
              answer: "No — cost is one side of the ledger. A decision meeting that unblocks a project, or a one-on-one that retains a valuable teammate, can be worth far more than its time cost. The estimator's real job is making the cost side visible so it can be weighed against value deliberately. The meetings worth killing are the ones where nobody can articulate what the money buys."
            }
          ]
        };
      case 'sleep-debt-calculator':
        return {
          summary: `The Sleep Debt Calculator measures the gap between the sleep you need and the sleep you're actually getting — and shows what it takes to pay that debt back. Log your recent nights against your personal sleep need (most adults require 7–9 hours), and the calculator totals your accumulated deficit and builds a realistic recovery plan. Sleep debt is cumulative: an hour short each weeknight adds up to nearly a full night's sleep missing by Friday, and it measurably affects concentration, mood, reaction time, and long-term health. Tracking the number makes the invisible cost visible. All data stays private in your browser.`,
          faqs: [
            {
              question: "Can I really 'catch up' on lost sleep?",
              answer: "Partially, yes — but not the way most people try. Research suggests recovering from sleep debt takes longer than incurring it, and one long weekend lie-in doesn't fully restore performance after a short week. A more effective approach is adding 30–60 minutes per night consistently until the debt clears, which the calculator's recovery plan models. Chronic large debts are best addressed by fixing the underlying schedule, not by heroic weekend recovery sleeps."
            },
            {
              question: "How do I know how much sleep I personally need?",
              answer: "The 7–9 hour adult range is wide because individual need varies genuinely. A practical test: over a vacation or low-obligation stretch, sleep without an alarm for several nights and note when you wake naturally feeling rested — that duration is close to your true need. Feeling fine on 6 hours usually reflects adaptation to impairment rather than a genuinely low need; objective performance still suffers even when sleepiness fades."
            },
            {
              question: "Does sleeping in on weekends fix a bad weekly schedule?",
              answer: "It helps less than it feels like it does. Big weekend shifts create 'social jet lag' — your body clock drifts late, making Monday morning harder and restarting the debt cycle. Sleep scientists generally recommend keeping wake times within about an hour of your weekday schedule and banking extra sleep through earlier bedtimes instead. The calculator makes the weekly pattern visible so you can adjust the schedule rather than patching it."
            }
          ]
        };
      case 'wedding-budget-planner':
        return {
          summary: `The Wedding Budget Planner keeps the full financial picture of your wedding in one place: every vendor, every category, every deposit and remaining balance. Set a total budget, break it into categories like venue, catering, photography, attire, and flowers, then track actual commitments against the plan as quotes become contracts. Weddings are notorious for silent budget creep — dozens of small overages that individually feel harmless and collectively add thousands. A running planner catches the creep early, while there's still room to rebalance. Everything stays in your browser: your budget is nobody's business but yours.`,
          faqs: [
            {
              question: "How should I split my wedding budget across categories?",
              answer: "A common starting allocation: roughly 40–45% to venue and catering combined (it's almost always the biggest line), 10–12% to photography and video, 8–10% to attire, 8–10% to flowers and décor, 5–8% to music and entertainment, and the remainder across stationery, transport, rings, and a buffer. Treat these as starting points, not rules — couples who care most about photos or food should deliberately shift budget toward what they'll remember, and cut what they won't."
            },
            {
              question: "What wedding costs do couples most often forget?",
              answer: "The classics: vendor tips and service charges (often 20%+ added to catering), alterations on top of attire prices, delivery and setup fees, overtime charges when the party runs long, marriage license fees, and meals for vendors. A day-of buffer of 5–10% of the total budget absorbs these gracefully. Add each as its own line in the planner as soon as you learn about it — surprises hurt most when they arrive together at the end."
            },
            {
              question: "How do I track deposits versus remaining balances?",
              answer: "Record each vendor with the full contracted amount, then log deposits as they're paid so the planner shows what's still owed and when. Most vendors take 20–50% up front with the balance due near the wedding date, which means the final month is heavy with payments — seeing them totaled in advance prevents a cash-flow scramble during the most stressful stretch of planning."
            }
          ]
        };
      case 'event-cost-estimator':
        return {
          summary: `The Event Cost Estimator builds a line-by-line budget for any gathering — birthday parties, corporate events, reunions, fundraisers, conferences — and calculates both the total and the per-attendee cost. Add cost lines for venue, food and drink, entertainment, rentals, and anything else, adjust attendee count, and watch the per-head figure update. That per-person number is the estimator's superpower: it turns 'is this too expensive?' into a concrete comparison, reveals what a ticket price would need to be, and shows instantly how guest-list changes move the bottom line. Runs entirely in your browser, no account needed.`,
          faqs: [
            {
              question: "Why does cost per attendee matter more than the total?",
              answer: "Because it's the number you can act on. A $2,000 event sounds expensive in isolation; at 100 guests it's $20 a head — modest for a catered evening. Per-attendee cost also exposes the fixed-vs-variable structure: venue costs are fixed (per-head cost falls as attendance grows) while catering scales per person. Understanding which lines are which tells you whether inviting more people makes the event cheaper or dearer per head."
            },
            {
              question: "How much buffer should an event budget include?",
              answer: "10–15% of the total for most events. The buffer absorbs the near-certainties: slightly higher attendance than the RSVP count, delivery fees, last-minute supplies, and the one vendor whose final invoice exceeds the quote. Add it as its own line in the estimator rather than mentally rounding up — a visible contingency line gets defended; invisible padding gets spent twice."
            },
            {
              question: "How do I set a ticket price that covers costs?",
              answer: "Start with the estimator's per-attendee cost at your realistic attendance, then add margin for no-shows and unsold capacity — pricing at bare break-even means any shortfall becomes a loss. A common approach is to price so that roughly 80% of expected sales covers all costs. For fundraisers, remember the goal is surplus: price meaningfully above per-head cost, and let sponsorship lines in the estimator offset the fixed costs."
            }
          ]
        };
      case 'bill-splitter-pro':
        return {
          summary: `Bill Splitter Pro ends the post-dinner math scramble: enter the bill, add the people, and get exact per-person amounts including tax and tip — with support for uneven splits when someone ordered the lobster and someone had a salad. You can assign specific items to specific people or split evenly, adjust tip percentage transparently so everyone sees the same math, and export a per-person breakdown to share with the group. Fair, visible math keeps money friction out of friendships, whether it's one dinner or a week-long group trip. Everything computes locally in your browser.`,
          faqs: [
            {
              question: "Should we split evenly or by what each person ordered?",
              answer: "Even splits are faster and fine when everyone's orders are roughly comparable — the occasional few-dollar difference washes out over repeated meals together. Itemized splits are fairer when orders diverge widely (drinks vs no drinks, entrées vs appetizers) or when budgets differ meaningfully within the group. Bill Splitter Pro handles both; a good habit is agreeing on the method before ordering, which removes any awkwardness when the check lands."
            },
            {
              question: "How should tax and tip be split fairly?",
              answer: "Proportionally to each person's share of the bill, not as a flat amount per head — someone who ordered $15 of food shouldn't pay the same tip as someone who ordered $60. The splitter applies tax and tip percentages to each person's subtotal automatically, which is the mathematically fair method and, conveniently, the one that requires no negotiation."
            },
            {
              question: "What's the best way to handle shared items like appetizers?",
              answer: "Split shared items evenly among the people who actually shared them, then keep individual orders itemized. Most groups do a hybrid: communal plates divided across the table, personal mains and drinks assigned individually. The tool's per-person export shows each person exactly what they're paying for, which answers questions before they're asked."
            }
          ]
        };
      case 'packing-checklist-generator':
        return {
          summary: `The Packing Checklist Generator builds a customized packing list from your actual trip: destination type, duration, season, and purpose. Instead of a one-size-fits-all list that has you scanning past ski gear on a beach trip, it assembles the categories that match your travel — clothing scaled to your trip length, toiletries, documents, electronics, and activity-specific gear — as an interactive checklist you can tick off while packing and export to keep. The forgotten-item panic at the airport is entirely preventable; a checklist generated the week before departure is the cheapest travel insurance there is.`,
          faqs: [
            {
              question: "How far in advance should I start packing?",
              answer: "Generate the checklist about a week out, pack in earnest two or three days before departure. The week's head start matters for items you can't buy last-minute: prescription refills, passport or visa checks, adapters for your destination's outlets, and laundry timing so the clothes you want are actually clean. The final day should be topping up toiletries, not discovering your passport expired."
            },
            {
              question: "How do I pack light without forgetting essentials?",
              answer: "The reliable formula: pack for a week regardless of trip length and plan to wash mid-trip for anything longer. Choose clothes around one or two base colors so everything combines, and cut anything you 'might' wear — the might-wear items are what fill the second bag. A checklist helps you pack light with confidence, because forgetting-anxiety is what drives overpacking in the first place."
            },
            {
              question: "What are the most commonly forgotten travel items?",
              answer: "Phone chargers and power banks top every survey, followed by toothbrushes, sunscreen, medications, umbrellas, and — expensively — travel documents and booking confirmations. Also frequently missed: destination-specific plug adapters, a pen for arrival forms on international trips, and copies of important documents stored separately from the originals. The generator includes these in its base lists precisely because they're the ones memory drops."
            }
          ]
        };
      case 'time-blocking-scheduler':
        return {
          summary: `The Time Blocking Scheduler helps you plan your day the way productive people actually work: by assigning every hour a job before the day starts. Build visual blocks for focused work, meetings, breaks, and personal time, see your whole day at a glance, and download the schedule to keep yourself honest. Time blocking works because it converts an open-ended to-do list into concrete appointments with yourself — research and practice both show that deciding when you'll do something dramatically raises the odds you actually do it, and that protected focus blocks beat reactive, interruption-driven days for deep work.`,
          faqs: [
            {
              question: "How is time blocking different from a to-do list?",
              answer: "A to-do list says what; time blocking adds when and how long. That forces two honest reckonings a list never does: your day has a fixed number of hours, and tasks take real time. When you must physically fit tasks into blocks, overcommitment becomes visible before it happens instead of at 6 PM. Most practitioners keep both — the list feeds the blocks — but the calendar, not the list, runs the day."
            },
            {
              question: "How long should my focus blocks be?",
              answer: "60–90 minutes suits most deep work — long enough to reach real concentration (which takes 15–20 minutes to build after any interruption), short enough to sustain quality. Batch shallow tasks like email into one or two dedicated 30-minute blocks rather than letting them perforate the day. And schedule breaks explicitly: back-to-back focus blocks without recovery degrade quickly after the first couple of hours."
            },
            {
              question: "What do I do when the day blows up my schedule?",
              answer: "Rebuild, don't abandon. The plan's value isn't perfect execution — it's knowing at any moment what matters most next. When a surprise eats a block, take two minutes to shuffle the remaining blocks and consciously demote the least important item to tomorrow. Practitioners also learn to schedule one or two deliberately empty 'buffer' blocks per day; days with buffers survive contact with reality far better than days scheduled wall to wall."
            }
          ]
        };
      case 'resume-builder-pro':
        return {
          summary: `Resume Builder Pro connects you to SexyResume.com, a dedicated AI resume platform that crafts professional, ATS-optimized resumes and matching cover letters using Claude AI. Unlike template-only builders that just format your text, it helps write and structure the content itself — framing your experience with strong action verbs, quantified accomplishments, and the keyword alignment applicant tracking systems screen for. This listing is a clearly labeled doorway: the resume building happens on SexyResume.com, an independent site, while the Resume Scanner here on Tools We Need remains a fully local, private way to check any resume against a job description.`,
          faqs: [
            {
              question: "What does ATS-optimized actually mean?",
              answer: "Applicant Tracking Systems are the software most employers use to filter applications before a human reads them. ATS-optimized means the resume uses a clean parseable structure (standard headings, no tables or graphics that confuse parsers) and mirrors the vocabulary of the job posting so keyword screens score it well. An excellent resume that an ATS can't parse may simply never be seen — formatting is a gatekeeping issue, not just aesthetics."
            },
            {
              question: "How is an AI resume builder different from a template?",
              answer: "A template gives you empty boxes and leaves the hard part — what to write — to you. An AI builder drafts and refines the content: turning 'was responsible for sales' into a quantified accomplishment, tailoring emphasis toward the roles you're targeting, and generating a matching cover letter from the same source material. You should always review and personalize the result; the AI provides the strong first draft that's hardest to face alone."
            },
            {
              question: "Should I tailor my resume for every application?",
              answer: "For roles you genuinely want, yes — it's the single highest-leverage habit in job searching. Tailoring doesn't mean rewriting from scratch; it means adjusting the professional summary, reordering bullet emphasis, and aligning terminology with each posting's language. Pair the builder with the free Resume Scanner on this site: scan your resume against the specific job description, close the keyword gaps it flags, and submit with measurably better odds of passing the first screen."
            }
          ]
        };
      case 'pomodoro-timer':
        return {
          summary: `The Pomodoro Timer implements the classic focus technique: work in timed sprints (traditionally 25 minutes), take a short break, and repeat — with a longer break after four rounds. The method works because it makes starting easy (anyone can commit to 25 minutes), makes distraction expensive (interruptions visibly break the sprint), and builds recovery into the rhythm so focus doesn't decay across the day. This timer runs entirely in your browser with visual progress and configurable work/break lengths, no app install or account required.`,
          faqs: [
            {
              question: "Why 25 minutes — and can I change it?",
              answer: "The 25-minute default comes from Francesco Cirillo's original technique and is short enough to feel startable while long enough to accomplish real work. It's a starting point, not a law: many deep-work practitioners run 45–50 minute sprints once their focus stamina builds, while people battling procrastination sometimes drop to 15 to lower the barrier further. Adjust the timer to the sprint length you'll actually honor — consistency beats orthodoxy."
            },
            {
              question: "What should I do during the breaks?",
              answer: "Anything that isn't the work and isn't another screen-based rabbit hole: stand up, stretch, get water, look out a window. The break's job is letting your attention recover, and switching from work-screen to social-media-screen doesn't accomplish that. Keep short breaks to the timer's length — the technique's structure collapses when a 5-minute break quietly becomes 25."
            },
            {
              question: "What if I get interrupted mid-pomodoro?",
              answer: "The orthodox rule: a broken pomodoro doesn't count — handle the interruption, then start a fresh sprint. That strictness is the point, because it makes the cost of interruptions visible and trains you (and colleagues) to defer non-urgent ones. Keep a notepad beside you for intrusive thoughts and to-dos that surface mid-sprint; jotting them down in two seconds lets you return to work without losing the round."
            }
          ]
        };
      case 'countdown-timer':
        return {
          summary: `A clean, no-nonsense countdown timer: set hours, minutes, and seconds, start it, and get a clear alert when time's up. It covers everything a kitchen timer or phone app does — cooking, workouts, study sessions, presentations, timed exams, kids' turn-taking — but lives in a browser tab with a large readable display and no app to install or ads to dodge. The timer keeps counting accurately in a background tab, so you can work elsewhere while it runs.`,
          faqs: [
            {
              question: "Will the timer keep running if I switch tabs?",
              answer: "Yes. The countdown tracks elapsed real time rather than counting ticks, so backgrounding the tab or focusing another window doesn't drift or pause it. Keep your device awake for the alert, though — a laptop that goes to sleep suspends everything, including timers."
            },
            {
              question: "What's the difference between a countdown timer and a Pomodoro timer?",
              answer: "A countdown is a single stretch of time with an end alert — perfect for one-off needs like an exam, a cooking step, or a meeting hard-stop. A Pomodoro timer automates a repeating work/break cycle for sustained focus. If you're timing one thing, use this; if you're structuring an afternoon of work, the Pomodoro Timer on this site handles the cycling for you."
            },
            {
              question: "Can I use this for presentations or public speaking practice?",
              answer: "It's one of the most popular uses. Set the timer to your speaking slot, position the tab where you can glance at it, and rehearse until your material fits comfortably inside the limit with a minute to spare. Conference speakers often run it during the real talk too — the large display reads at a glance without the fiddliness of a phone."
            }
          ]
        };
      case 'unit-converter':
        return {
          summary: `The Unit Converter handles the conversions daily life and work actually require — length, weight, temperature, area, volume, speed, and digital data — with instant results as you type. Recipes in grams when your scale reads ounces, weather in Celsius when you think in Fahrenheit, file sizes in gigabytes versus gibibytes, mileage in kilometers: it's all one tool, computed locally in your browser with no lookup tables to squint at and no ads between you and the answer.`,
          faqs: [
            {
              question: "Why do Celsius/Fahrenheit conversions feel unintuitive?",
              answer: "Because temperature scales differ by both a multiplier and an offset: °F = °C × 9/5 + 32. Zero on one scale isn't zero on the other, which is why doubling a Celsius value doesn't double the Fahrenheit one. Handy anchors: 0°C = 32°F (freezing), 20°C = 68°F (room temperature), 37°C = 98.6°F (body temperature), 100°C = 212°F (boiling)."
            },
            {
              question: "What's the difference between a gigabyte (GB) and a gibibyte (GiB)?",
              answer: "GB uses powers of 1,000 (1 GB = 1,000,000,000 bytes) while GiB uses powers of 1,024 (1 GiB = 1,073,741,824 bytes) — about a 7% difference. Storage manufacturers advertise in GB; operating systems often report in GiB while labeling it GB, which is why a '1 TB' drive shows up as roughly 931 'GB'. The converter's data section handles both conventions."
            },
            {
              question: "Are cooking conversions between weight and volume exact?",
              answer: "Between two weight units or two volume units, yes — those are exact mathematical conversions. But converting a volume (cups) to a weight (grams) depends on the ingredient's density: a cup of flour weighs about 120g while a cup of sugar weighs about 200g. For baking precision, use ingredient-specific weights from your recipe; use the converter for the unit math around them."
            }
          ]
        };
      case 'password-generator':
        return {
          summary: `The Password Generator creates strong, random passwords using your browser's cryptographically secure random number generator — with your choices of length, uppercase, lowercase, numbers, and symbols, plus an option to exclude look-alike characters (Il1O0) for passwords you'll ever type by hand. Generation happens entirely on your device: no password is ever transmitted, logged, or seen by anyone, including us. Length is the single biggest strength factor, and the built-in strength meter shows how your settings translate into resistance against modern cracking attempts.`,
          faqs: [
            {
              question: "How long should my passwords be?",
              answer: "16 characters or more for anything that matters. Cracking difficulty grows exponentially with length: a random 8-character password can fall to modern hardware in hours, while a random 16-character one is beyond practical attack. Since a password manager remembers them for you, there's no cost to generating 20+ characters for important accounts like email and banking."
            },
            {
              question: "Is it safe to generate passwords in a browser?",
              answer: "With this tool, yes — it uses the Web Crypto API (crypto.getRandomValues), the same cryptographically secure randomness standard used by security software, and the generated password never leaves your device. You can verify the network claim yourself: the page makes no request when you click generate. The unsafe pattern is reusing passwords across sites, not generating them locally."
            },
            {
              question: "Do I really need a different password for every site?",
              answer: "Yes — it's the single most important password rule. When any site suffers a breach (they regularly do), attackers immediately try the leaked email/password pairs everywhere else; that's called credential stuffing, and it's how one minor forum breach becomes a drained account. Unique passwords contain the damage of any breach to that one site. Pair this generator with a password manager and the habit costs nothing."
            }
          ]
        };
      case 'color-picker':
        return {
          summary: `The Color Picker lets you choose any color visually and instantly copy its value in every format developers and designers need: HEX for CSS and design tools, RGB for screen work, HSL for intuitive hue and lightness adjustments, and CMYK for print. One click copies the code; no plugins, accounts, or uploads involved. It's the quick bridge between 'that's the color I want' and the exact string your stylesheet, design file, or print shop requires.`,
          faqs: [
            {
              question: "When should I use HEX vs RGB vs HSL?",
              answer: "They describe the same colors differently. HEX (#3B82F6) is the compact convention for CSS and design handoffs. RGB exposes the red/green/blue channels, useful when working with opacity via rgba(). HSL (hue, saturation, lightness) is the most human-friendly for adjustments — need a darker shade of the same blue? Lower the lightness and keep hue untouched. Modern CSS accepts all three, so pick per task."
            },
            {
              question: "Why does CMYK matter if I work on screens?",
              answer: "Screens emit light (RGB); printers lay ink (CMYK), and the two can't reproduce identical ranges of color. Vivid screen colors — especially bright blues and greens — often print duller than expected. If your color is destined for business cards, packaging, or anything physical, checking its CMYK version early avoids the classic surprise of a brand color that looks great on the site and muddy on paper."
            },
            {
              question: "How do I pick an accessible color combination for text?",
              answer: "Contrast is the key: WCAG accessibility guidelines call for a contrast ratio of at least 4.5:1 between text and background for normal-size text. Practically, that rules out light gray text on white and many mid-tone pairings. Use the picker to fine-tune your foreground color's lightness until it clearly separates from the background — HSL mode makes that adjustment a single slider."
            }
          ]
        };
      case 'word-counter':
        return {
          summary: `The Word & Character Counter analyzes text as you type or paste: words, characters with and without spaces, sentences, paragraphs, and estimated reading time. It's the quick answer to every length limit — essay and application word counts, social media character caps, meta descriptions, abstracts, cover letters — without uploading your text anywhere. Everything is counted locally in your browser, so drafts, confidential documents, and unpublished work stay entirely on your device.`,
          faqs: [
            {
              question: "How is reading time calculated?",
              answer: "From an average adult silent-reading speed of roughly 200–250 words per minute. It's an estimate: technical material reads slower, light narrative faster. For speaking time — speeches and presentations — use roughly 130–150 words per minute instead, so a 5-minute talk runs about 650–750 words. Rehearsing against a timer remains the gold standard for spoken material."
            },
            {
              question: "What are the character limits on major platforms?",
              answer: "The commonly hit ones: X/Twitter posts 280 characters, Instagram captions 2,200, LinkedIn posts about 3,000, YouTube titles 100, Google search results display roughly the first 155–160 characters of a meta description, and SMS messages segment at 160. Character-with-spaces is the figure these platforms count, which this tool shows prominently."
            },
            {
              question: "Do word count rules differ for essays and applications?",
              answer: "Most institutions count every word including small ones (a, the, of), which matches how this counter works. Staying within stated limits matters more than filling them — admissions and grant reviewers routinely note that limits are tested for compliance, and 'about 500 words' generally tolerates ±10%. When a limit is strict, trim by cutting redundant qualifiers first; meaning usually survives, and the count drops fast."
            }
          ]
        };
      case 'text-case-converter':
        return {
          summary: `The Text Case Converter transforms any text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case in one click. It rescues text typed with caps lock on, formats headlines consistently, and converts names between the identifier styles different programming languages expect — without retyping a word. Paste, click, copy: all processed locally in your browser.`,
          faqs: [
            {
              question: "When do the programmer cases (camelCase, snake_case, kebab-case) each get used?",
              answer: "By convention per language and context: camelCase for JavaScript/Java variables, PascalCase for class and component names, snake_case for Python variables and database columns, kebab-case for URLs, CSS classes, and file names. Converting a phrase like 'user profile image' into each style by hand is error-prone busywork — exactly what this tool eliminates."
            },
            {
              question: "What's the difference between Title Case and Sentence case?",
              answer: "Title Case Capitalizes Most Words and is the traditional style for headlines and titles (conventions vary on small words like 'of' and 'the'). Sentence case capitalizes only the first word and proper nouns, like a normal sentence, and has become the dominant style in modern product and web writing for its readability. Pick one per project and apply it consistently — the converter makes consistency cheap."
            },
            {
              question: "Can this fix text accidentally typed in all caps?",
              answer: "Yes — that's one of its most common uses. Convert to lowercase first, then apply Sentence case or Title Case as the destination format requires. It beats retyping a paragraph, though give the result a quick scan afterward: proper nouns and acronyms (NASA, iPhone) need their capitals restored by hand since no converter can know every name."
            }
          ]
        };
      case 'qr-code-generator':
        return {
          summary: `The QR Code Generator turns any text or URL into a scannable QR code you can download as a PNG — generated entirely in your browser, with nothing sent to any server. Use it for menus and flyers, Wi-Fi sharing, event links, business cards, product packaging, or moving a long URL from screen to phone in one scan. Because generation is local, the links and text you encode stay private, and there's no third-party redirect service sitting between your QR code and its destination.`,
          faqs: [
            {
              question: "Do QR codes expire or stop working?",
              answer: "Codes from this generator never expire — the destination is encoded directly in the pattern, permanently. What can die is the destination itself: if the URL you encoded goes offline, the code scans fine but leads nowhere. (Some commercial QR services route through their own short links, which do break when subscriptions lapse — a problem direct encoding avoids entirely.) For anything printed at volume, double-check the URL before you print."
            },
            {
              question: "How big should a QR code be printed?",
              answer: "The rule of thumb is a minimum width of one-tenth the intended scanning distance: a code scanned from 30 cm (a flyer in hand) needs to be at least 3 cm wide; a poster scanned from 3 meters needs 30 cm. Shorter URLs also produce simpler, more forgiving patterns — worth using a concise link for small print sizes. Always test-scan a real print at real distance before mass production."
            },
            {
              question: "Should I scan QR codes I find in public?",
              answer: "With the same caution as clicking an unknown link — 'quishing' scams place malicious QR stickers over legitimate ones in places like parking meters and restaurant tables. Modern phones preview the URL before opening; read it. Codes you generate yourself with this tool carry no such risk: the code contains exactly what you put in, with no intermediary."
            }
          ]
        };
      case 'base64-tool':
        return {
          summary: `The Base64 Encoder/Decoder converts text to Base64 and back instantly, entirely in your browser. Base64 is the encoding that lets binary or special-character data travel safely through text-only channels — it's what you're seeing in data URLs, email attachments, API payloads, and configuration secrets. Developers use this tool to decode tokens and payloads during debugging, encode strings for embedding, and inspect what's actually inside that opaque wall of letters — without pasting potentially sensitive data into a random website's server, because nothing here leaves your machine.`,
          faqs: [
            {
              question: "Is Base64 encryption?",
              answer: "No — this matters. Base64 is encoding: a reversible representation anyone can decode with zero keys or secrets, as this tool demonstrates. It provides no confidentiality whatsoever. If you see 'encrypted' data that's merely Base64, it's effectively plain text. Use real cryptography for secrets; use Base64 only for transport formatting."
            },
            {
              question: "Why does Base64 output end with = signs?",
              answer: "Padding. Base64 represents every 3 bytes of input as 4 output characters; when input length isn't a multiple of 3, one or two '=' characters pad the final group. It's structural, not meaningful — decoders use it to reconstruct the exact original length. Some variants (like the URL-safe Base64 in JWTs) omit padding entirely, which is why tokens often lack the trailing equals."
            },
            {
              question: "Why is Base64-encoded data bigger than the original?",
              answer: "By design, about 33% bigger: every 3 bytes become 4 characters drawn from a 64-symbol alphabet. That overhead is the price of surviving text-only channels. It's why embedding large images as Base64 data URLs bloats pages — fine for tiny icons, poor for photographs — and why binary formats are preferred when the channel supports them."
            }
          ]
        };
      case 'json-formatter':
        return {
          summary: `The JSON Formatter & Validator prettifies, minifies, and validates JSON instantly in your browser. Paste a wall of single-line JSON from an API response or log file and get properly indented, readable structure; paste hand-edited JSON and get precise validation errors pointing at the problem; minify formatted JSON back down for production payloads. Because everything runs locally, API responses containing real data — often sensitive — never leave your machine, which is the way JSON tooling should work.`,
          faqs: [
            {
              question: "What are the most common JSON syntax errors?",
              answer: "In rough order of frequency: trailing commas after the last item (valid in JavaScript, fatal in JSON), single quotes instead of required double quotes, unquoted property names, missing commas between items, and unescaped special characters inside strings. The validator pinpoints the failure location — though note the true mistake sometimes sits just before where the parser gives up."
            },
            {
              question: "What's the difference between formatting and minifying?",
              answer: "Two directions of the same transform. Formatting (pretty-printing) adds indentation and line breaks for human reading — debugging, code review, documentation. Minifying strips every non-essential character for machines — smaller payloads, faster transfers. The data is identical either way; choose based on whether the next reader is a person or a parser."
            },
            {
              question: "Is JSON from an API safe to paste into online tools?",
              answer: "Only if the tool processes it locally, as this one does. API responses routinely contain tokens, emails, and internal identifiers, and pasting them into a tool that ships input to its server is an accidental data leak — a real category of incident in security audits. This formatter makes no network request with your data; the trust panel above the tool documents exactly that."
            }
          ]
        };
      case 'pdf-merger':
        return {
          summary: `The Private PDF Merger combines multiple PDF files into one, with drag-to-reorder control over page sequence — and it does the entire job inside your browser. Your files are never uploaded: the merging happens on your own device using local processing, which makes this tool categorically different from the typical 'free PDF merger' that quietly ships your contracts, statements, and records to someone else's server. Merge scanned pages, combine chapters, assemble application packets — then download the result, which existed nowhere but your machine.`,
          faqs: [
            {
              question: "Are my PDFs really not uploaded anywhere?",
              answer: "Really. The merger uses in-browser processing (the pdf-lib library running locally), so file contents never cross the network — you can watch the network tab and see no upload. This matters more for PDFs than almost any file type, because what people merge is precisely their most sensitive paperwork: contracts, medical records, financial statements, IDs."
            },
            {
              question: "Is there a limit to how many PDFs or pages I can merge?",
              answer: "No fixed count — the practical limit is your device's memory, since the work happens locally. Dozens of typical documents merge comfortably; very large scanned files (hundreds of image-heavy megabytes) may get slow on modest hardware. If a merge stalls, combining in two or three batches then merging the results usually solves it."
            },
            {
              question: "Will merging change the quality or content of my PDFs?",
              answer: "No — pages are copied into the new document as-is, preserving text, images, and layout at original quality. Merging doesn't recompress or re-render content. Note that interactive features spanning documents (bookmarks, cross-document links, form field interactions) may not carry over intact, as merging concatenates pages rather than rebuilding document-level structures."
            }
          ]
        };
      case 'image-optimizer':
        return {
          summary: `The Batch Image Optimizer resizes, compresses, and converts images between JPG, PNG, and WebP — multiple files at once, entirely in your browser. Photos never leave your device: optimization uses your browser's own image processing rather than an upload service. Shrink camera photos that are absurdly oversized for the web, convert to WebP for meaningfully smaller files at equal quality, and prepare batches of listing or product photos in one pass — then download the results.`,
          faqs: [
            {
              question: "Which format should I choose — JPG, PNG, or WebP?",
              answer: "WebP for most web use: it delivers photo quality comparable to JPG at 25–35% smaller sizes and supports transparency, with universal modern-browser support. JPG remains the safe universal choice for photographs headed anywhere unusual (older software, some upload forms). PNG is for images needing lossless quality or transparency where WebP isn't accepted — logos, screenshots with text, graphics with sharp edges."
            },
            {
              question: "How much can I compress a photo before quality visibly suffers?",
              answer: "Further than most people expect. For photographs, quality settings around 75–85% typically cut file size by 60–80% with no visible difference at normal viewing sizes. Artifacts appear first in areas of subtle gradient (skies, skin). The practical method: compress a representative photo at a couple of settings and compare at the size it will actually be displayed — not zoomed to 400%."
            },
            {
              question: "What dimensions do my images actually need?",
              answer: "Match the display, not the camera. A modern phone shoots 4,000+ pixels wide; a full-width web image needs at most about 1,920, a content-column image around 1,200, and a thumbnail a few hundred. Resizing to the needed dimensions before compressing is the single biggest file-size win — a 12-megapixel photo resized for web use often drops 90% in size before compression even starts."
            }
          ]
        };
      case 'csv-workbench':
        return {
          summary: `The CSV Cleaner & Preview opens CSV and spreadsheet-export files right in your browser for inspection and cleanup: preview the data as a table, remove duplicate rows, and export the cleaned result — without the file ever leaving your device. It's the fast path for the everyday CSV chores that don't deserve a full spreadsheet session: sanity-checking an export before importing it somewhere, deduplicating a contact list, or inspecting what's actually inside a file a system handed you.`,
          faqs: [
            {
              question: "Why does my CSV look wrong when opened in Excel but fine here?",
              answer: "Usually delimiter or encoding mismatches: some regions' Excel expects semicolons rather than commas, and files with UTF-8 characters can display garbled without the right encoding signal. A plain preview like this one shows the file's actual structure, which tells you whether the data is broken or just being misread — valuable information before you 'fix' a file that isn't broken."
            },
            {
              question: "How does duplicate removal decide what's a duplicate?",
              answer: "Rows that are identical across their compared columns are collapsed to one. Watch for near-duplicates that legitimately differ — trailing spaces, capitalization, 'Bob' vs 'Robert' — which are the same real-world record but different text. Exact-match dedup handles the mechanical duplicates (double exports, repeated imports); human-judgment duplicates still need a human."
            },
            {
              question: "Is it safe to open CSVs with sensitive data here?",
              answer: "Yes — the file is parsed locally in your browser and never uploaded, which you can verify in the network tab. That's the point of the tool: customer lists, financial exports, and personnel data are exactly the files you shouldn't feed to an upload-based converter site. Processing stays on the machine the file is already on."
            }
          ]
        };
      case 'file-hash-generator':
        return {
          summary: `The File Checksum Generator computes SHA-256, SHA-384, and SHA-512 hashes of any file directly in your browser — the file is read locally and never uploaded. A hash is a compact fingerprint: identical files always produce identical hashes, and even a single changed byte produces a completely different one. That makes checksums the standard way to verify a download wasn't corrupted or tampered with, confirm two files are truly identical, and document file integrity for records or evidence.`,
          faqs: [
            {
              question: "How do I verify a downloaded file against a published checksum?",
              answer: "Download the file, generate its SHA-256 hash here, and compare against the checksum the software publisher lists (usually beside the download link). Matching hashes mean the file is bit-for-bit what the publisher released — no corruption, no tampering in transit. A mismatch means don't run it: re-download first, and if it still mismatches, get it from a different official source."
            },
            {
              question: "Which algorithm should I use — SHA-256, SHA-384, or SHA-512?",
              answer: "SHA-256 is the modern default and what most publishers list; use it unless you're matching a checksum published in another algorithm. All three are current-generation secure hashes — the longer variants offer larger safety margins that mainly matter in specialized contexts. Older algorithms you may still encounter, MD5 and SHA-1, are cryptographically broken and shouldn't be trusted for security verification, though they still detect accidental corruption."
            },
            {
              question: "Can two different files have the same hash?",
              answer: "Theoretically yes (files are infinite, hashes finite) — practically no. For SHA-256 the chance is so astronomically small that no collision has ever been found, and constructing one is beyond all current computing capability combined. When two files share a SHA-256 hash, the working conclusion in engineering, forensics, and law alike is that they're the same file."
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
    <section className="mt-8 border-t border-gray-800 px-4 pt-8 pb-24 sm:px-6" id={`seo-content-${tool.id}`}>
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
          <div className="flex flex-wrap justify-center gap-2">
            <RequestToolButton variant="primary" />
            <FeedbackButton
              toolId={tool.id}
              toolName={tool.title}
              variant="secondary"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            We're constantly adding new tools based on user requests.
          </p>
        </div>
        
        {/* Tips render only for tools with genuinely useful, specific tips */}
        {['budget-card-conveyor', 'self-employed-tax-estimator', 'debt-snowball-tracker', 'trade-profit-risk-calculator', 'hourly-rate-calculator'].includes(tool.id) && (
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
          </div>
        </div>
        )}
      </div>
      
    </section>
  );
};