import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  brandAccounts,
  creatorAssets,
  dashboardKpis,
  dashboardMeta,
  focusProjects,
  monthlySales,
  overviewProjects,
  risks,
  salesMeta,
  supportItems
} from "./data.js";
import { salesChannels, salesChannelRows } from "./sales-channel-data.js";

const statusStyles = {
  green: "bg-green-50 text-green-700 ring-green-200",
  yellow: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200"
};

const statusDot = {
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  blue: "bg-blue-500"
};

const priorityStyles = {
  P0: "bg-red-50 text-red-700 ring-red-200",
  P1: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  P2: "bg-blue-50 text-blue-700 ring-blue-200"
};

const campaignBatchOptions = ["5月投放笔记", "6月投放笔记", "7月投放笔记"];

function getBatchOptions(assets) {
  return [
    "全部月份",
    ...new Set([
      ...campaignBatchOptions,
      ...assets.map(item => item.batch || "待补充")
    ])
  ];
}

function money(value) {
  if (value === null || value === undefined) return "待补充";
  return `¥${new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 }).format(value)}`;
}

function number(value, suffix = "") {
  if (value === null || value === undefined) return "待补充";
  return `${new Intl.NumberFormat("zh-CN").format(value)}${suffix}`;
}

function hkMoney(value) {
  if (value === null || value === undefined) return "待补充";
  return `HK$${new Intl.NumberFormat("zh-HK", { maximumFractionDigits: 0 }).format(value)}`;
}

function percent(value) {
  if (!Number.isFinite(value)) return "待补充";
  return `${value > 0 ? "+" : ""}${(value * 100).toFixed(1)}%`;
}

function StatusBadge({ status, text }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[status]}`}>
      <span className={`h-2 w-2 rounded-full ${statusDot[status]}`} />
      {text}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${priorityStyles[priority] || "bg-slate-50 text-slate-700 ring-slate-200"}`}>
      {priority}
    </span>
  );
}

function Shell({ page, setPage, children }) {
  const nav = [
    ["home", "总览看板"],
    ["overview", "项目总览"],
    ["bull", "公牛牌"],
    ["jzt", "济众堂"],
    ["sales", "销售分析"],
    ["risks", "风险中心"],
    ["support", "资源需求"],
    ["ai", "AI问答"]
  ];

  return (
    <div className="min-h-screen bg-[#f3f5f7]">
      <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">{dashboardMeta.version}</div>
            <h1 className="text-2xl font-bold text-ink">{dashboardMeta.title}</h1>
            <p className="mt-1 text-sm text-muted">更新时间：{dashboardMeta.updatedAt}｜负责人：{dashboardMeta.owner}</p>
          </div>
          <nav className="no-print flex gap-2 overflow-x-auto">
            {nav.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPage(key)}
                className={`whitespace-nowrap rounded-md border px-3 py-2 text-sm font-medium transition ${
                  page === key ? "border-blue-600 bg-blue-600 text-white" : "border-line bg-white text-slate-700 hover:border-blue-300"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}

function Panel({ title, subtitle, children, action }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="mb-4 flex flex-col gap-2 border-b border-line pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Home({ setPage }) {
  const [brandBatchFilter, setBrandBatchFilter] = useState("全部月份");
  const brandBatchOptions = useMemo(
    () => getBatchOptions(creatorAssets),
    []
  );
  const stats = useMemo(
    () => [
      ["累计增长投入", money(dashboardKpis.totalInvestment)],
      ["小红书累计笔记", number(dashboardKpis.totalNotes, "篇")],
      ["小红书累计曝光", number(dashboardKpis.totalExposure)],
      ["小红书累计阅读", number(dashboardKpis.totalReads)],
      ["小红书累计互动", number(dashboardKpis.totalInteractions)],
      ["高风险", `${risks.filter(item => item.level === "red").length}项`],
      ["资源需求", `${supportItems.length}项`]
    ],
    []
  );

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink">总览看板</h2>
          </div>
          <button onClick={() => window.print()} className="no-print rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            打印 / 导出PDF
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-line bg-soft p-4">
              <div className="text-xs text-muted">{label}</div>
              <div className="mt-2 text-xl font-bold text-ink">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <Panel title="核心增长目标">
        <div className="grid gap-3 md:grid-cols-3">
          {dashboardMeta.coreGoals.map((goal, index) => (
            <div key={goal} className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <div className="text-xs font-bold text-blue-700">目标 {index + 1}</div>
              <div className="mt-2 text-base font-semibold text-ink">{goal}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="分品牌数据总览"
        subtitle="按品牌查看增长投入、内容成果和搜索/销售反馈"
        action={
          <select
            value={brandBatchFilter}
            onChange={event => setBrandBatchFilter(event.target.value)}
            className="no-print rounded-md border border-line bg-white px-3 py-2 text-sm"
          >
            {brandBatchOptions.map(option => <option key={option}>{option}</option>)}
          </select>
        }
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <BrandOverviewCard brand="公牛牌" selectedBatch={brandBatchFilter} setPage={setPage} />
          <BrandOverviewCard brand="济众堂" selectedBatch={brandBatchFilter} setPage={setPage} />
        </div>
      </Panel>

      <Panel title="当前重点项目卡片" subtitle="点击项目进入对应品牌详情页">
        <div className="grid gap-4 lg:grid-cols-3">
          {focusProjects.map(project => (
            <button
              key={project.id}
              onClick={() => setPage(project.brandGroup === "公牛牌" ? "bull" : "jzt")}
              className="text-left rounded-lg border border-line bg-white p-4 transition hover:border-blue-300 hover:shadow-panel"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-ink">{project.name}</h3>
                <StatusBadge status={project.status} text={project.statusText} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <MiniMetric label="累计增长投入" value={money(project.investment)} />
                <MiniMetric label="小红书笔记" value={number(project.notes, "篇")} />
                <MiniMetric label="累计曝光" value={number(project.exposure)} />
                <MiniMetric label="累计阅读" value={number(project.reads)} />
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <Info label="当前阶段" value={project.stage} />
                <Info label="阶段/本周成果" value={project.weeklyResult} />
                <Info label="当前风险" value={project.risk} danger={project.status === "red"} />
                <Info label="当前重点" value={project.next} />
                <Info label="需要支持" value={project.bossSupport} />
              </dl>
            </button>
          ))}
        </div>
      </Panel>

      <AssetSections />
    </div>
  );
}

function BrandOverviewCard({ brand, selectedBatch, setPage }) {
  const brandProjects = focusProjects.filter(item => item.brandGroup === brand);
  const mainProject = brandProjects[0];
  const filteredAssets = creatorAssets.filter(item => {
    const brandOk = item.brand === brand;
    const batchOk = selectedBatch === "全部月份" || (item.batch || "待补充") === selectedBatch;
    return brandOk && batchOk;
  });
  const useAssetData = selectedBatch !== "全部月份";
  const hasBatchInvestment = brandProjects.some(item => item.batchInvestments?.[selectedBatch] != null);
  const batchInvestment = brandProjects.reduce(
    (sum, item) => sum + (item.batchInvestments?.[selectedBatch] || 0),
    0
  );
  const investment = useAssetData
    ? hasBatchInvestment
      ? batchInvestment
      : filteredAssets.reduce((sum, item) => sum + (item.cost || 0), 0)
    : brandProjects.reduce((sum, item) => sum + (item.investment || 0), 0);
  const notes = useAssetData
    ? filteredAssets.length
    : brandProjects.reduce((sum, item) => sum + (item.notes || 0), 0);
  const exposure = useAssetData
    ? filteredAssets.reduce((sum, item) => sum + (item.exposure || 0), 0)
    : brandProjects.reduce((sum, item) => sum + (item.exposure || 0), 0);
  const reads = useAssetData
    ? filteredAssets.reduce((sum, item) => sum + (item.reads || 0), 0)
    : brandProjects.reduce((sum, item) => sum + (item.reads || 0), 0);
  const interactions = useAssetData
    ? filteredAssets.reduce((sum, item) => sum + (item.interactions || 0), 0)
    : brandProjects.reduce((sum, item) => sum + (item.interactions || 0), 0);
  const targetPage = brand === "公牛牌" ? "bull" : "jzt";

  return (
    <button onClick={() => setPage(targetPage)} className="rounded-lg border border-line bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-ink">{brand}数据总览</h3>
          <p className="mt-1 text-xs text-muted">
            {selectedBatch === "全部月份" ? brandProjects.map(item => item.name).join(" / ") : selectedBatch}
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <MiniMetric label="累计增长投入" value={useAssetData ? money(investment) : investment ? money(investment) : "待补充"} />
        <MiniMetric label="小红书累计笔记" value={useAssetData ? number(notes, "篇") : notes ? number(notes, "篇") : "待补充"} />
        <MiniMetric label="小红书累计曝光" value={useAssetData ? number(exposure) : exposure ? number(exposure) : "待补充"} />
        <MiniMetric label="小红书累计阅读" value={useAssetData ? number(reads) : reads ? number(reads) : "待补充"} />
        <MiniMetric label="小红书累计互动" value={useAssetData ? number(interactions) : interactions ? number(interactions) : "待补充"} />
        <MiniMetric label="近90天品牌搜索量" value={mainProject?.search90d ? number(mainProject.search90d) : "待补充"} />
        <MiniMetric label="近90天品牌搜索环比" value={mainProject?.searchGrowth90d || "待补充"} />
        <MiniMetric label="淘宝搜索人气值" value={mainProject?.taobaoSearch || "待补充"} />
        <MiniMetric label="淘宝近30天销量环比" value={mainProject?.taobaoSalesGrowth30d || "待补充"} />
        <MiniMetric label="万宁近90天销量环比" value={mainProject?.manningSalesGrowth90d || "待补充"} />
      </div>
    </button>
  );
}

function Info({ label, value, danger }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-muted">{label}</dt>
      <dd className={`mt-1 leading-6 ${danger ? "text-red-700" : "text-slate-800"}`}>{value || "待补充"}</dd>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-soft p-3">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 font-bold text-ink">{value}</div>
    </div>
  );
}

function ProjectOverview({ setPage }) {
  return (
    <Panel title="项目总览">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs text-muted">
              {["状态灯", "项目名称", "项目一句话目标", "当前阶段", "已完成事项", "当前增长投入", "当前成果", "当前风险", "下一步动作", "负责人", "需要老板支持"].map(head => (
                <th key={head} className="border border-line px-3 py-2 font-semibold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {overviewProjects.map(project => (
              <tr key={project.id} className="align-top">
                <td className="border border-line px-3 py-3"><StatusBadge status={project.status} text={project.statusText} /></td>
                <td className="border border-line px-3 py-3">
                  <button onClick={() => setPage(project.brandGroup === "公牛牌" ? "bull" : "jzt")} className="font-semibold text-blue-700 hover:underline">
                    {project.name}
                  </button>
                </td>
                <td className="border border-line px-3 py-3">{project.shortGoal}</td>
                <td className="border border-line px-3 py-3">{project.stage}</td>
                <td className="border border-line px-3 py-3">{project.completed?.join("、") || "待补充"}</td>
                <td className="border border-line px-3 py-3 font-semibold">{money(project.investment)}</td>
                <td className="border border-line px-3 py-3">{project.currentResult}</td>
                <td className="border border-line px-3 py-3 text-red-700">{project.risk}</td>
                <td className="border border-line px-3 py-3">{project.next}</td>
                <td className="border border-line px-3 py-3">{project.owner}</td>
                <td className="border border-line px-3 py-3">{project.bossSupport}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function BullPage() {
  const project = focusProjects.find(item => item.id === "bull-fengtongling");
  return (
    <div className="space-y-5">
      <ProjectHero project={project} />
      <Panel title="增长路径">
        <Flow items={project.path} />
      </Panel>
      <DetailGrid
        items={[
          ["项目背景", project.background],
          ["已完成事项", project.completed.join("、")],
          ["当前数据", `累计增长投入${money(project.investment)}；小红书笔记${number(project.notes, "篇")}；曝光${number(project.exposure)}；阅读${number(project.reads)}；互动${number(project.interactions)}；近90天品牌搜索量${number(project.search90d)}；搜索环比${project.searchGrowth90d}`],
          ["投放/达人/内容进度", project.contentProgress.map(item => `${item.label}：${item.value}`).join("；")],
          ["费用概览", project.costItems.map(item => `${item.name}：${money(item.amount)}`).join("；")],
          ["风险", project.risk],
          ["下一步计划", project.plan.join("；")]
        ]}
      />
      <AssetSections onlyBrand="公牛牌" />
    </div>
  );
}

function JztPage() {
  const oil = focusProjects.find(item => item.id === "jzt-huoluo-oil");
  const health = focusProjects.find(item => item.id === "jzt-health-food");
  return (
    <div className="space-y-5">
      <ProjectHero project={oil} />
      <Panel title="中成药增长路径">
        <Flow items={oil.path} />
      </Panel>
      <DetailGrid
        items={[
          ["百步追风活络油项目背景", oil.background],
          ["当前阶段", oil.stage],
          ["当前数据", `累计增长投入${money(oil.investment)}；小红书笔记${number(oil.notes, "篇")}；曝光${number(oil.exposure)}；阅读${number(oil.reads)}；互动${number(oil.interactions)}；近90天品牌搜索量${number(oil.search90d)}；搜索环比${oil.searchGrowth90d}`],
          ["万宁资源沟通进度", oil.manningProgress.map(item => `${item.label}：${item.value}`).join("；")],
          ["当前风险", oil.risk],
          ["下一步计划", oil.plan.join("；")]
        ]}
      />

      <ProjectHero project={health} />
      <Panel title="保健食品增长路径">
        <Flow items={health.healthPath} />
      </Panel>
      <Panel title="保健食品上市流程">
        <Flow items={health.launchFlow} />
      </Panel>
      <DetailGrid
        items={[
          ["产品", health.products.join("、")],
          ["当前阶段", health.stage],
          ["阶段成果", health.weeklyResult],
          ["当前风险", health.risk],
          ["下一步计划", health.plan.join("；")],
          ["需要老板支持", health.bossSupport]
        ]}
      />
      <AssetSections onlyBrand="济众堂" />
    </div>
  );
}

function ProjectHero({ project }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <StatusBadge status={project.status} text={project.statusText} />
          <h2 className="mt-3 text-2xl font-bold text-ink">{project.name}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-muted">{project.shortGoal}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 lg:min-w-[520px]">
          <MiniMetric label="累计增长投入" value={money(project.investment)} />
          <MiniMetric label="小红书笔记" value={number(project.notes, "篇")} />
          <MiniMetric label="累计曝光" value={number(project.exposure)} />
          <MiniMetric label="累计阅读" value={number(project.reads)} />
        </div>
      </div>
    </section>
  );
}

function Flow({ items }) {
  return (
    <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="rounded-lg border border-line bg-soft p-4">
          <div className="text-xs font-bold text-blue-700">STEP {index + 1}</div>
          <div className="mt-2 text-sm font-semibold text-ink">{item}</div>
        </div>
      ))}
    </div>
  );
}

function DetailGrid({ items }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map(([title, value]) => (
        <section key={title} className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <h3 className="text-base font-bold text-ink">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-700">{value}</p>
        </section>
      ))}
    </div>
  );
}

function AssetSections({ onlyBrand }) {
  const [brandFilter, setBrandFilter] = useState(onlyBrand || "全部品牌");
  const [projectFilter, setProjectFilter] = useState("全部项目");
  const [batchFilter, setBatchFilter] = useState("全部月份");
  const accounts = onlyBrand ? brandAccounts.filter(item => item.brand === onlyBrand) : brandAccounts;
  const baseAssets = onlyBrand ? creatorAssets.filter(item => item.brand === onlyBrand) : creatorAssets;
  const projectOptions = ["全部项目", ...new Set(baseAssets.map(item => item.project))];
  const batchOptions = getBatchOptions(baseAssets);
  const brandOptions = onlyBrand ? [onlyBrand] : ["全部品牌", ...new Set(baseAssets.map(item => item.brand))];
  const assets = baseAssets.filter(item => {
    const brandOk = brandFilter === "全部品牌" || item.brand === brandFilter;
    const projectOk = projectFilter === "全部项目" || item.project === projectFilter;
    const batchOk = batchFilter === "全部月份" || (item.batch || "待补充") === batchFilter;
    return brandOk && projectOk && batchOk;
  });
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="品牌内容资产库" subtitle="品牌账号入口，点击后新窗口打开小红书主页">
        <div className="space-y-3">
          {accounts.map(account => (
            <a
              key={account.name}
              href={account.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-line bg-soft p-4 hover:border-blue-300"
            >
              <div className="text-xs font-semibold text-muted">{account.brand}</div>
              <div className="mt-1 font-bold text-blue-700">{account.name} ↗</div>
            </a>
          ))}
        </div>
      </Panel>
      <Panel
        title="达人内容资产库"
        subtitle={`已导入 ${baseAssets.length} 条小红书种草笔记数据，当前显示 ${assets.length} 条`}
        action={
          <div className="no-print flex flex-wrap gap-2">
            {!onlyBrand ? (
              <select value={brandFilter} onChange={event => setBrandFilter(event.target.value)} className="rounded-md border border-line bg-white px-3 py-2 text-sm">
                {brandOptions.map(option => <option key={option}>{option}</option>)}
              </select>
            ) : null}
            <select value={projectFilter} onChange={event => setProjectFilter(event.target.value)} className="rounded-md border border-line bg-white px-3 py-2 text-sm">
              {projectOptions.map(option => <option key={option}>{option}</option>)}
            </select>
            <select value={batchFilter} onChange={event => setBatchFilter(event.target.value)} className="rounded-md border border-line bg-white px-3 py-2 text-sm">
              {batchOptions.map(option => <option key={option}>{option}</option>)}
            </select>
          </div>
        }
      >
        <div className="max-h-[520px] overflow-auto rounded-lg border border-line">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead className="sticky top-0 bg-slate-50 text-left text-xs text-muted">
              <tr>
                {["项目", "品牌", "月份", "达人", "费用", "曝光", "阅读", "互动", "链接"].map(head => (
                  <th key={head} className="border-b border-line px-3 py-2 font-semibold">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr key={`${asset.link}-${index}`} className="align-top">
                  <td className="border-b border-line px-3 py-2">{asset.project}</td>
                  <td className="border-b border-line px-3 py-2">{asset.brand}</td>
                  <td className="border-b border-line px-3 py-2">
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">{asset.batch || "待补充"}</span>
                  </td>
                  <td className="border-b border-line px-3 py-2 font-semibold text-ink">{asset.creator}</td>
                  <td className="border-b border-line px-3 py-2">{money(asset.cost)}</td>
                  <td className="border-b border-line px-3 py-2">{number(asset.exposure)}</td>
                  <td className="border-b border-line px-3 py-2">{number(asset.reads)}</td>
                  <td className="border-b border-line px-3 py-2">{number(asset.interactions)}</td>
                  <td className="border-b border-line px-3 py-2">
                    <a href={asset.link} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 hover:underline">打开笔记</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function RisksPage() {
  return (
    <Panel title="风险中心" subtitle="集中展示影响进度、销量、资质和渠道的风险">
      <div className="grid gap-4 lg:grid-cols-2">
        {risks.map(risk => (
          <article key={risk.title} className="rounded-lg border border-line bg-white p-5">
            <StatusBadge status={risk.level} text={risk.level === "red" ? "红色风险" : "黄色风险"} />
            <h3 className="mt-3 text-base font-bold text-ink">{risk.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700"><span className="font-semibold">风险说明：</span>{risk.desc}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700"><span className="font-semibold">影响：</span>{risk.impact}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700"><span className="font-semibold">建议动作：</span>{risk.action}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function SupportPage() {
  return (
    <Panel title="资源需求" subtitle="集中展示需要公司支持的事项">
      <div className="grid gap-4 lg:grid-cols-2">
        {supportItems.map(item => (
          <article key={item.title} className="rounded-lg border border-line bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-bold text-ink">{item.title}</h3>
              <PriorityBadge priority={item.priority} />
            </div>
            <p className="mt-3 text-sm text-muted">项目：{item.project}</p>
            <p className="mt-3 text-sm leading-6 text-slate-700"><span className="font-semibold">需要确认：</span>{item.decision}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700"><span className="font-semibold">不处理影响：</span>{item.impact}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

const productOptions = ["全部产品", "公牛牌风痛灵", "济众堂百步追风活络油"];
const channelColors = {
  "万宁": "#2563EB",
  "药房及本地零售": "#16A34A",
  "电商": "#F97316",
  "国际及其他客户": "#7C3AED",
  "公牛牌风痛灵": "#1D4ED8",
  "济众堂百步追风活络油": "#F97316"
};

function salesValue(row, product, metric, kind = "value") {
  const isBull = product === "公牛牌风痛灵";
  if (kind === "customers") return row[isBull ? 6 : 7];
  if (kind === "orders") return row[isBull ? 8 : 9];
  if (kind === "returnAmount") return row[isBull ? 10 : 11];
  if (kind === "returnQty") return row[isBull ? 12 : 13];
  return row[metric === "销售额" ? (isBull ? 2 : 3) : (isBull ? 4 : 5)];
}

function sumRow(row, product, metric, kind = "value") {
  return product === "全部产品"
    ? salesValue(row, "公牛牌风痛灵", metric, kind) + salesValue(row, "济众堂百步追风活络油", metric, kind)
    : salesValue(row, product, metric, kind);
}

function monthsForPeriod(period) {
  const all = monthlySales.map(item => item.month);
  if (period === "最近6个月") return all.slice(-6);
  if (period === "最近12个月") return all.slice(-12);
  if (period === "2025年") return all.filter(month => month.startsWith("2025"));
  if (period === "2026年") return all.filter(month => month.startsWith("2026"));
  return all;
}

function metricText(value, metric) {
  return metric === "销售额" ? hkMoney(value) : `${number(value)}件`;
}

function SalesTrendChart({ months, product, channel, metric }) {
  const width = 1000;
  const height = 360;
  const margin = { top: 20, right: 24, bottom: 54, left: 82 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  let names;
  if (product === "全部产品") names = ["公牛牌风痛灵", "济众堂百步追风活络油"];
  else if (channel === "全部渠道") names = salesChannels;
  else names = [product];
  const series = names.map(name => ({
    name,
    color: channelColors[name],
    values: months.map(month => salesChannelRows
      .filter(row => row[0] === month && row[1] === (product !== "全部产品" && channel === "全部渠道" ? name : channel === "全部渠道" ? row[1] : channel))
      .reduce((sum, row) => sum + salesValue(row, product === "全部产品" ? name : product, metric), 0))
  }));
  const rawMax = Math.max(1, ...series.flatMap(item => item.values));
  const maxValue = metric === "销售额" ? Math.ceil(rawMax / 100000) * 100000 : Math.ceil(rawMax / 500) * 500;
  const x = index => margin.left + (months.length === 1 ? plotWidth / 2 : (index / (months.length - 1)) * plotWidth);
  const y = value => margin.top + plotHeight - (Math.max(0, value) / maxValue) * plotHeight;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(ratio => ratio * maxValue);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-4 text-sm">
        {series.map(item => (
          <div key={item.name} className="flex items-center gap-2"><span className="h-0.5 w-6" style={{ background: item.color }} />{item.name}</div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[760px]" role="img" aria-label={`月度${metric}趋势`}>
          <title>鼠标停留在数据点可查看月度数值</title>
          {yTicks.map(tick => (
            <g key={tick}>
              <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} stroke="#E4E7EC" />
              <text x={margin.left - 12} y={y(tick) + 4} textAnchor="end" fontSize="12" fill="#667085">
                {metric === "销售额" ? (tick === 0 ? "HK$0" : `HK$${Math.round(tick / 1000)}k`) : number(Math.round(tick))}
              </text>
            </g>
          ))}
          {months.map((month, index) => <text key={month} x={x(index)} y={height - 20} textAnchor="middle" fontSize="11" fill="#667085">{month.slice(2)}</text>)}
          {series.map(item => (
            <g key={item.name}>
              <polyline points={item.values.map((value, index) => `${x(index)},${y(value)}`).join(" ")} fill="none" stroke={item.color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              {item.values.map((value, index) => (
                <circle key={`${item.name}-${months[index]}`} cx={x(index)} cy={y(value)} r="4.5" fill={item.color} className="cursor-pointer">
                  <title>{`${months[index]} ${item.name}：${metricText(value, metric)}`}</title>
                </circle>
              ))}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function ChannelStructureChart({ months, product, metric, selectedChannel, setChannel }) {
  const monthData = months.map(month => {
    const values = salesChannels.map(channel => ({
      channel,
      value: salesChannelRows.filter(row => row[0] === month && row[1] === channel).reduce((sum, row) => sum + sumRow(row, product, metric), 0)
    }));
    return { month, values, total: values.reduce((sum, item) => sum + Math.max(0, item.value), 0) };
  });
  const maxTotal = Math.max(1, ...monthData.map(item => item.total));
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3 text-xs">
        {salesChannels.map(channel => (
          <button key={channel} onClick={() => setChannel(selectedChannel === channel ? "全部渠道" : channel)} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${selectedChannel === channel ? "border-slate-700 bg-slate-100 font-semibold" : "border-line bg-white"}`}>
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: channelColors[channel] }} />{channel}
          </button>
        ))}
      </div>
      <div className="flex h-64 min-w-[720px] items-end gap-3 border-b border-line px-2">
        {monthData.map(item => (
          <div key={item.month} className="flex h-full flex-1 flex-col justify-end text-center">
            <div className="mx-auto flex w-full max-w-12 flex-col-reverse overflow-hidden rounded-t-sm" style={{ height: `${Math.max(2, (item.total / maxTotal) * 88)}%` }}>
              {item.values.map(segment => segment.value > 0 ? (
                <button key={segment.channel} onClick={() => setChannel(segment.channel)} style={{ background: channelColors[segment.channel], height: `${(segment.value / item.total) * 100}%`, opacity: selectedChannel === "全部渠道" || selectedChannel === segment.channel ? 1 : 0.25 }}>
                  <title>{`${item.month} ${segment.channel}：${metricText(segment.value, metric)}（${((segment.value / item.total) * 100).toFixed(1)}%）`}</title>
                </button>
              ) : null)}
            </div>
            <div className="mt-2 text-[11px] text-muted">{item.month.slice(2)}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">点击图例、柱形分段或下方渠道表，可联动筛选销售趋势。</p>
    </div>
  );
}

function SalesPage() {
  const [period, setPeriod] = useState("最近12个月");
  const [product, setProduct] = useState("全部产品");
  const [channel, setChannel] = useState("全部渠道");
  const [metric, setMetric] = useState("销售额");
  const months = monthsForPeriod(period);
  const rows = salesChannelRows.filter(row => months.includes(row[0]) && (channel === "全部渠道" || row[1] === channel));
  const monthlyValues = months.map(month => rows.filter(row => row[0] === month).reduce((sum, row) => sum + sumRow(row, product, metric), 0));
  const latestValue = monthlyValues[monthlyValues.length - 1] || 0;
  const previousValue = monthlyValues[monthlyValues.length - 2] || 0;
  const latestMoM = previousValue ? latestValue / previousValue - 1 : NaN;
  const periodTotal = monthlyValues.reduce((sum, value) => sum + value, 0);
  const channelSummary = salesChannels.map(name => {
    const channelRows = salesChannelRows.filter(row => months.includes(row[0]) && row[1] === name);
    const amount = channelRows.reduce((sum, row) => sum + sumRow(row, product, "销售额"), 0);
    const qty = channelRows.reduce((sum, row) => sum + sumRow(row, product, "开票数量"), 0);
    const latestRows = channelRows.filter(row => row[0] === months[months.length - 1]);
    const latestAmount = latestRows.reduce((sum, row) => sum + sumRow(row, product, "销售额"), 0);
    const customers = latestRows.reduce((sum, row) => sum + sumRow(row, product, "销售额", "customers"), 0);
    const orders = channelRows.reduce((sum, row) => sum + sumRow(row, product, "销售额", "orders"), 0);
    return { name, amount, qty, latestAmount, customers, orders };
  }).sort((a, b) => b.amount - a.amount);
  const channelTotal = channelSummary.reduce((sum, item) => sum + item.amount, 0);
  const leader = channel === "全部渠道" ? channelSummary[0] : channelSummary.find(item => item.name === channel);
  const returns = salesChannelRows.filter(row => months.includes(row[0]) && (channel === "全部渠道" || row[1] === channel))
    .map(row => ({ month: row[0], channel: row[1], amount: sumRow(row, product, "销售额", "returnAmount"), qty: sumRow(row, product, "销售额", "returnQty") }))
    .filter(item => item.amount < 0 || item.qty < 0);

  return (
    <div className="space-y-5">
      <Panel title="全渠道销售分析" subtitle={`${salesMeta.period}｜数据更新至${salesMeta.latestMonth}｜币种：港币`}>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <FilterSelect label="时间范围" value={period} setValue={setPeriod} options={["最近6个月", "最近12个月", "全部时间", "2025年", "2026年"]} />
          <FilterSelect label="产品" value={product} setValue={setProduct} options={productOptions} />
          <FilterSelect label="渠道" value={channel} setValue={setChannel} options={["全部渠道", ...salesChannels]} />
          <FilterSelect label="观察指标" value={metric} setValue={setMetric} options={["销售额", "开票数量"]} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MiniMetric label={`${period}${metric}`} value={metricText(periodTotal, metric)} />
          <MiniMetric label={`${months[months.length - 1]} ${metric}`} value={metricText(latestValue, metric)} />
          <MiniMetric label="最新月环比" value={percent(latestMoM)} />
          <MiniMetric label={channel === "全部渠道" ? "筛选期第一渠道" : "所选渠道销售占比"} value={leader ? `${leader.name}｜${channelTotal ? ((leader.amount / channelTotal) * 100).toFixed(1) : 0}%` : "待补充"} />
        </div>
        <p className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
          本页统计口径为公司开票／出货销售，不等同于终端消费者动销；退货及冲销按净额计入。
        </p>
      </Panel>

      <Panel title={`月度${metric}趋势`} subtitle="筛选条件会同步影响趋势、指标与明细；鼠标停留在数据点可查看数值">
        <SalesTrendChart months={months} product={product} channel={channel} metric={metric} />
      </Panel>

      <div className="grid gap-5 xl:grid-cols-5">
        <div className="min-w-0 xl:col-span-3"><Panel title={`月度渠道结构（${metric}）`} subtitle="按渠道拆分每月贡献，柱高代表当月规模"><div className="overflow-x-auto"><ChannelStructureChart months={months} product={product} metric={metric} selectedChannel={channel} setChannel={setChannel} /></div></Panel></div>
        <div className="xl:col-span-2"><Panel title="数据提醒" subtitle="根据当前筛选条件自动识别波动与退货">
          <div className="space-y-3 text-sm leading-6">
            {Number.isFinite(latestMoM) && latestMoM <= -0.2 ? <Alert text={`${months[months.length - 1]}${metric}较上月下降${Math.abs(latestMoM * 100).toFixed(1)}%，建议核查渠道订单与库存。`} /> : null}
            {returns.map(item => <Alert key={`${item.month}-${item.channel}`} text={`${item.month}｜${item.channel}出现退货：${Math.abs(item.qty)}件，金额${hkMoney(Math.abs(item.amount))}。`} />)}
            {(!Number.isFinite(latestMoM) || latestMoM > -0.2) && returns.length === 0 ? <p className="rounded-lg bg-green-50 p-3 text-green-800">当前筛选范围暂无明显下降或退货异常。</p> : null}
          </div>
        </Panel></div>
      </div>

      <Panel title="渠道表现" subtitle={`汇总${period}；“最新月客户数”按产品分别去重后合计`}>
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead className="bg-slate-50 text-left text-xs text-muted"><tr>{["渠道", "筛选期销售额", "销售占比", "开票数量", "单据数", "最新月销售额", "最新月客户数"].map(head => <th key={head} className="border-b border-line px-3 py-3 font-semibold">{head}</th>)}</tr></thead>
            <tbody>{channelSummary.map(item => (
              <tr key={item.name} className={channel === item.name ? "bg-blue-50" : ""}>
                <td className="border-b border-line px-3 py-3"><button onClick={() => setChannel(channel === item.name ? "全部渠道" : item.name)} className="font-semibold text-blue-700 hover:underline">{item.name}</button></td>
                <td className="border-b border-line px-3 py-3">{hkMoney(item.amount)}</td>
                <td className="border-b border-line px-3 py-3">{channelTotal ? `${((item.amount / channelTotal) * 100).toFixed(1)}%` : "—"}</td>
                <td className={`border-b border-line px-3 py-3 ${item.qty < 0 ? "font-semibold text-red-700" : ""}`}>{number(item.qty)}</td>
                <td className="border-b border-line px-3 py-3">{number(item.orders)}</td>
                <td className={`border-b border-line px-3 py-3 ${item.latestAmount < 0 ? "font-semibold text-red-700" : ""}`}>{hkMoney(item.latestAmount)}</td>
                <td className="border-b border-line px-3 py-3">{number(item.customers)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">数据来源：{salesMeta.source}｜{salesMeta.note}</p>
      </Panel>
    </div>
  );
}

function FilterSelect({ label, value, setValue, options }) {
  return <label className="text-sm font-semibold text-slate-700"><span className="mb-1.5 block text-xs text-muted">{label}</span><select value={value} onChange={event => setValue(event.target.value)} className="w-full rounded-md border border-line bg-white px-3 py-2.5 font-normal">{options.map(option => <option key={option}>{option}</option>)}</select></label>;
}

function Alert({ text }) {
  return <p className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-yellow-900">{text}</p>;
}

function AiPage() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "你好，我是增长看板AI助手。当前为静态演示版，可先基于页面数据回答固定方向问题。" }
  ]);
  const [input, setInput] = useState("");

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const reply = text.includes("风险")
      ? "当前重点风险包括：公牛牌万宁仅9家门店有货、活络油等待万宁恢复上架、保健食品资质暂无明确时间节点。"
      : text.includes("公牛")
        ? "公牛牌当前累计增长投入¥116,240，7月上半旬27篇内容投放中；投流资质等待审核，主要卡点是万宁仅9家门店有货。"
      : text.includes("济众堂")
          ? "济众堂当前重点是等待活络油于7月20日-25日恢复上架，并继续追踪肝轻松、眼清清资质及确定定位与定价。"
          : "这个问题后续可接入真实AI和数据库回答。当前静态版建议先查看总览看板、风险中心和资源需求。";
    setMessages([...messages, { role: "user", text }, { role: "ai", text: reply }]);
    setInput("");
  }

  return (
    <Panel title="AI问答" subtitle="静态聊天窗口，后续可接入真实AI和增长数据库">
      <div className="mx-auto max-w-3xl rounded-lg border border-line bg-soft p-4">
        <div className="h-[420px] space-y-3 overflow-auto rounded-lg bg-white p-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] rounded-lg px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={event => setInput(event.target.value)}
            onKeyDown={event => {
              if (event.key === "Enter") sendMessage();
            }}
            placeholder="输入问题，例如：公牛牌现在最大的风险是什么？"
            className="min-w-0 flex-1 rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <button onClick={sendMessage} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            发送
          </button>
        </div>
        <div className="mt-3 grid gap-2 text-xs text-muted sm:grid-cols-2">
          {["公牛牌累计增长投入是多少？", "济众堂现在有哪些风险？", "保健食品上市还缺什么？", "当前需要公司支持什么？"].map(item => (
            <button key={item} onClick={() => setInput(item)} className="rounded-md border border-line bg-white px-3 py-2 text-left hover:border-blue-300">
              {item}
            </button>
          ))}
          </div>
      </div>
    </Panel>
  );
}

function App() {
  const [page, setPage] = useState("home");

  return (
    <Shell page={page} setPage={setPage}>
      {page === "home" ? <Home setPage={setPage} /> : null}
      {page === "overview" ? <ProjectOverview setPage={setPage} /> : null}
      {page === "bull" ? <BullPage /> : null}
      {page === "jzt" ? <JztPage /> : null}
      {page === "sales" ? <SalesPage /> : null}
      {page === "risks" ? <RisksPage /> : null}
      {page === "support" ? <SupportPage /> : null}
      {page === "ai" ? <AiPage /> : null}
    </Shell>
  );
}

createRoot(document.getElementById("root")).render(<App />);
