// import { NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { portfolio } from '@/lib/db';


// export async function GET() {
//   try {
//     const summary = await db
//       .select({
//         assetType: portfolio.assetType,
//         totalValue: sql<number>`SUM(quantity * current_price)`.as('total_value'),
//       })
//       .from(portfolio)
//       .groupBy(portfolio.assetType);

//     const total = summary.reduce((acc, curr) => acc + curr.totalValue, 0);
//     const allocation = summary.map(item => ({
//       type: item.assetType,
//       value: item.totalValue,
//       percentage: (item.totalValue / total) * 100
//     }));

//     return NextResponse.json({
//       total,
//       allocation
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch portfolio summary' },
//       { status: 500 }
//     );
//   }
// }