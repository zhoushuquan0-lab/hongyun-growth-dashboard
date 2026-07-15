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
    ["sales", "销售趋势"],
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

function SalesTrendChart() {
  const width = 1000;
  const height = 360;
  const margin = { top: 20, right: 24, bottom: 54, left: 76 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const maxValue = Math.ceil(Math.max(...monthlySales.flatMap(item => [item.bullAmount, item.oilAmount])) / 100000) * 100000;
  const x = index => margin.left + (index / (monthlySales.length - 1)) * plotWidth;
  const y = value => margin.top + plotHeight - (value / maxValue) * plotHeight;
  const bullPoints = monthlySales.map((item, index) => `${x(index)},${y(item.bullAmount)}`).join(" ");
  const oilPoints = monthlySales.map((item, index) => `${x(index)},${y(item.oilAmount)}`).join(" ");
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(ratio => ratio * maxValue);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-5 text-sm">
        <div className="flex items-center gap-2"><span className="h-0.5 w-6 bg-blue-700" />公牛牌风痛灵</div>
        <div className="flex items-center gap-2"><span className="h-0.5 w-6 bg-orange-500" />济众堂百步追风活络油</div>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[760px]" role="img" aria-label="2025年4月至2026年6月两款产品月度销售额趋势，单位为港币">
          <title>月度销售额趋势（港币）</title>
          {yTicks.map(tick => (
            <g key={tick}>
              <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} stroke="#E4E7EC" strokeWidth="1" />
              <text x={margin.left - 12} y={y(tick) + 4} textAnchor="end" fontSize="12" fill="#667085">
                {tick === 0 ? "HK$0" : `HK$${Math.round(tick / 1000)}k`}
              </text>
            </g>
          ))}
          {monthlySales.map((item, index) => (
            <text key={item.month} x={x(index)} y={height - 20} textAnchor="middle" fontSize="11" fill="#667085">
              {item.month.slice(2)}
            </text>
          ))}
          <polyline points={bullPoints} fill="none" stroke="#1D4ED8" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          <polyline points={oilPoints} fill="none" stroke="#F97316" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          {monthlySales.map((item, index) => (
            <g key={`points-${item.month}`}>
              <circle cx={x(index)} cy={y(item.bullAmount)} r="4" fill="#1D4ED8">
                <title>{`${item.month} 公牛牌风痛灵：${hkMoney(item.bullAmount)}`}</title>
              </circle>
              <circle cx={x(index)} cy={y(item.oilAmount)} r="4" fill="#F97316">
                <title>{`${item.month} 济众堂百步追风活络油：${hkMoney(item.oilAmount)}`}</title>
              </circle>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function SalesPage() {
  const latest = monthlySales[monthlySales.length - 1];
  const previous = monthlySales[monthlySales.length - 2];
  const latestTotal = latest.bullAmount + latest.oilAmount;
  const previousTotal = previous.bullAmount + previous.oilAmount;
  const totalMoM = latestTotal / previousTotal - 1;
  const bullMoM = latest.bullAmount / previous.bullAmount - 1;
  const oilMoM = latest.oilAmount / previous.oilAmount - 1;
  const recentRows = monthlySales.slice(-6).reverse();

  return (
    <div className="space-y-5">
      <Panel title="销售趋势" subtitle={`${salesMeta.period}｜币种：港币｜数据更新至${salesMeta.latestMonth}`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MiniMetric label="2026年6月总销售额" value={hkMoney(latestTotal)} />
          <MiniMetric label="总销售额月环比" value={percent(totalMoM)} />
          <MiniMetric label="公牛牌6月销售额" value={`${hkMoney(latest.bullAmount)}｜${percent(bullMoM)}`} />
          <MiniMetric label="活络油6月销售额" value={`${hkMoney(latest.oilAmount)}｜${percent(oilMoM)}`} />
        </div>
        <p className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm leading-6 text-yellow-900">
          6月总销售额较5月下降{Math.abs(totalMoM * 100).toFixed(1)}%。其中公牛牌下降{Math.abs(bullMoM * 100).toFixed(1)}%，活络油下降{Math.abs(oilMoM * 100).toFixed(1)}%；活络油6月包含万宁退货326件，净开票数量为-31。
        </p>
      </Panel>

      <Panel title="月度销售额趋势（港币）" subtitle="双产品按月对比，后续每月追加当月销售数据">
        <SalesTrendChart />
      </Panel>

      <Panel title="最近6个月销售明细" subtitle={salesMeta.note}>
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead className="bg-slate-50 text-left text-xs text-muted">
              <tr>
                {["月份", "公牛牌销售额", "活络油销售额", "合计销售额", "公牛牌开票数量", "活络油开票数量"].map(head => (
                  <th key={head} className="border-b border-line px-3 py-3 font-semibold">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentRows.map(item => (
                <tr key={item.month}>
                  <td className="border-b border-line px-3 py-3 font-semibold text-ink">{item.month}</td>
                  <td className="border-b border-line px-3 py-3">{hkMoney(item.bullAmount)}</td>
                  <td className="border-b border-line px-3 py-3">{hkMoney(item.oilAmount)}</td>
                  <td className="border-b border-line px-3 py-3 font-semibold">{hkMoney(item.bullAmount + item.oilAmount)}</td>
                  <td className="border-b border-line px-3 py-3">{number(item.bullQty)}</td>
                  <td className={`border-b border-line px-3 py-3 ${item.oilQty < 0 ? "font-semibold text-red-700" : ""}`}>{number(item.oilQty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">数据来源：{salesMeta.source}</p>
      </Panel>
    </div>
  );
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
