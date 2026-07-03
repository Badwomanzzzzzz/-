<template>
  <div class="exhibition-board">
    <header class="board-header">
      <div class="header-title">
        <h1>古韵新章 · 城市焕新</h1>
        <p class="subtitle">历史街区更新设计方案</p>
      </div>
      <div class="header-badge">XX市历史文化街区</div>
    </header>

    <div class="board-content">
      <section class="section section-hero">
        <div class="section-header">
          <span class="section-number">01</span>
          <h2>项目概览</h2>
        </div>
        <div class="hero-content">
          <div class="hero-image">
            <img src="https://neeko-copilot.bytedance.net/api/text2image?prompt=Aerial%20view%20of%20traditional%20Chinese%20architecture%20complex%20with%20modern%20renovation%2C%20courtyards%2C%20red%20lanterns%2C%20urban%20planning%2C%20photorealistic%2C%20golden%20hour%20lighting&image_size=landscape_16_9" alt="鸟瞰图" />
          </div>
          <div class="hero-info">
            <div class="info-item">
              <span class="info-label">项目名称</span>
              <span class="info-value">古韵新章 · 城市焕新</span>
            </div>
            <div class="info-item">
              <span class="info-label">项目地点</span>
              <span class="info-value">XX市历史文化街区</span>
            </div>
            <div class="info-item">
              <span class="info-label">规划面积</span>
              <span class="info-value">5.2公顷</span>
            </div>
            <div class="info-item">
              <span class="info-label">设计理念</span>
              <span class="info-value">传承历史 · 创新未来</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-location">
        <div class="section-header">
          <span class="section-number">02</span>
          <h2>区位分析</h2>
        </div>
        <div class="location-content">
          <div class="location-map">
            <svg viewBox="0 0 300 200" class="map-svg">
              <defs>
                <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#8B4513;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#D2691E;stop-opacity:0.1" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="300" height="200" fill="url(#mapGradient)" />
              <circle cx="150" cy="100" r="30" fill="#8B0000" opacity="0.6" />
              <circle cx="150" cy="100" r="20" fill="#DC143C" opacity="0.8" />
              <text x="150" y="105" text-anchor="middle" fill="white" font-size="12">核心区</text>
              <line x1="150" y1="70" x2="150" y2="20" stroke="#DC143C" stroke-width="2" marker-end="url(#arrow)" />
              <text x="155" y="15" fill="#8B4513" font-size="10">市政府</text>
              <line x1="180" y1="100" x2="260" y2="80" stroke="#DC143C" stroke-width="2" />
              <text x="270" y="78" fill="#8B4513" font-size="10">商业中心</text>
              <line x1="120" y1="100" x2="40" y2="120" stroke="#DC143C" stroke-width="2" />
              <text x="30" y="125" fill="#8B4513" font-size="10">文化广场</text>
              <line x1="150" y1="130" x2="130" y2="180" stroke="#DC143C" stroke-width="2" />
              <text x="125" y="185" fill="#8B4513" font-size="10">火车站</text>
            </svg>
          </div>
          <div class="location-list">
            <div class="location-item">
              <div class="location-icon">🚇</div>
              <div class="location-text">
                <strong>交通便利</strong>
                <p>距地铁站500米，公交枢纽直达</p>
              </div>
            </div>
            <div class="location-item">
              <div class="location-icon">🏛️</div>
              <div class="location-text">
                <strong>文化核心</strong>
                <p>周边历史遗迹众多，文化底蕴深厚</p>
              </div>
            </div>
            <div class="location-item">
              <div class="location-icon">🏬</div>
              <div class="location-text">
                <strong>商业繁荣</strong>
                <p>毗邻市中心商圈，消费潜力巨大</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-analysis">
        <div class="section-header">
          <span class="section-number">03</span>
          <h2>现状问题分析</h2>
        </div>
        <div class="analysis-content">
          <div class="analysis-grid">
            <div class="analysis-card">
              <div class="card-icon">🏠</div>
              <h3>建筑老化</h3>
              <p>部分建筑年代久远，结构老化严重，存在安全隐患</p>
            </div>
            <div class="analysis-card">
              <div class="card-icon">🛣️</div>
              <h3>交通拥堵</h3>
              <p>街巷狭窄，人车混行，消防通道不畅</p>
            </div>
            <div class="analysis-card">
              <div class="card-icon">⚡</div>
              <h3>设施陈旧</h3>
              <p>水电管网老化，缺乏现代化基础设施</p>
            </div>
            <div class="analysis-card">
              <div class="card-icon">🏪</div>
              <h3>业态单一</h3>
              <p>商业业态老化，缺乏活力与特色</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-crowd">
        <div class="section-header">
          <span class="section-number">04</span>
          <h2>人群需求分析</h2>
        </div>
        <div class="crowd-content">
          <div class="crowd-chart">
            <div class="chart-bar">
              <div class="bar-fill" style="height: 85%">
                <span class="bar-label">本地居民</span>
              </div>
              <span class="bar-value">85%</span>
            </div>
            <div class="chart-bar">
              <div class="bar-fill" style="height: 72%">
                <span class="bar-label">年轻游客</span>
              </div>
              <span class="bar-value">72%</span>
            </div>
            <div class="chart-bar">
              <div class="bar-fill" style="height: 65%">
                <span class="bar-label">文化爱好者</span>
              </div>
              <span class="bar-value">65%</span>
            </div>
            <div class="chart-bar">
              <div class="bar-fill" style="height: 58%">
                <span class="bar-label">商务人士</span>
              </div>
              <span class="bar-value">58%</span>
            </div>
          </div>
          <div class="crowd-info">
            <div class="info-card">
              <div class="info-icon">👨👩👧👦</div>
              <div class="info-content">
                <strong>家庭游客</strong>
                <p>期望亲子互动空间、文化体验项目</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-icon">👨💼</div>
              <div class="info-content">
                <strong>商务人群</strong>
                <p>需要高品质餐饮、会议空间</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-plan">
        <div class="section-header">
          <span class="section-number">05</span>
          <h2>规划总平面图</h2>
        </div>
        <div class="plan-content">
          <div class="plan-map">
            <svg viewBox="0 0 400 250" class="plan-svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#D2B48C" stroke-width="0.5" />
                </pattern>
              </defs>
              <rect width="400" height="250" fill="url(#grid)" />
              <rect x="50" y="30" width="80" height="60" fill="#DEB887" stroke="#8B4513" stroke-width="2" />
              <text x="90" y="65" text-anchor="middle" fill="#8B4513" font-size="10">文化展示区</text>
              <rect x="150" y="30" width="70" height="80" fill="#FAEBD7" stroke="#8B4513" stroke-width="2" />
              <text x="185" y="75" text-anchor="middle" fill="#8B4513" font-size="10">商业街区</text>
              <rect x="240" y="30" width="60" height="50" fill="#F5DEB3" stroke="#8B4513" stroke-width="2" />
              <text x="270" y="57" text-anchor="middle" fill="#8B4513" font-size="9">餐饮区</text>
              <rect x="50" y="110" width="100" height="70" fill="#DEB887" stroke="#8B4513" stroke-width="2" />
              <text x="100" y="147" text-anchor="middle" fill="#8B4513" font-size="10">非遗工坊</text>
              <rect x="170" y="130" width="90" height="50" fill="#FAEBD7" stroke="#8B4513" stroke-width="2" />
              <text x="215" y="157" text-anchor="middle" fill="#8B4513" font-size="10">文创市集</text>
              <rect x="280" y="100" width="80" height="80" fill="#F5DEB3" stroke="#8B4513" stroke-width="2" />
              <text x="320" y="142" text-anchor="middle" fill="#8B4513" font-size="10">休闲广场</text>
              <circle cx="200" cy="200" r="25" fill="#90EE90" stroke="#228B22" stroke-width="2" />
              <text x="200" y="204" text-anchor="middle" fill="#228B22" font-size="10">绿地公园</text>
              <path d="M 30 230 Q 200 220 370 230" stroke="#8B4513" stroke-width="3" fill="none" />
              <text x="200" y="245" text-anchor="middle" fill="#8B4513" font-size="10">主入口</text>
            </svg>
          </div>
          <div class="plan-legend">
            <div class="legend-item">
              <span class="legend-color" style="background: #DEB887"></span>
              <span class="legend-text">文化展示</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #FAEBD7"></span>
              <span class="legend-text">商业零售</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #F5DEB3"></span>
              <span class="legend-text">餐饮休闲</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #90EE90"></span>
              <span class="legend-text">绿地公园</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-swot">
        <div class="section-header">
          <span class="section-number">06</span>
          <h2>SWOT分析</h2>
        </div>
        <div class="swot-content">
          <div class="swot-grid">
            <div class="swot-card swot-strength">
              <div class="swot-icon">📈</div>
              <h3>优势</h3>
              <ul>
                <li>历史文化底蕴深厚</li>
                <li>地理位置优越</li>
                <li>建筑特色鲜明</li>
                <li>政府政策支持</li>
              </ul>
            </div>
            <div class="swot-card swot-weakness">
              <div class="swot-icon">📉</div>
              <h3>劣势</h3>
              <ul>
                <li>基础设施陈旧</li>
                <li>空间布局受限</li>
                <li>业态单一老化</li>
                <li>消防隐患突出</li>
              </ul>
            </div>
            <div class="swot-card swot-opportunity">
              <div class="swot-icon">🎯</div>
              <h3>机会</h3>
              <ul>
                <li>文旅融合趋势</li>
                <li>消费升级需求</li>
                <li>城市更新政策</li>
                <li>数字文旅发展</li>
              </ul>
            </div>
            <div class="swot-card swot-threat">
              <div class="swot-icon">⚠️</div>
              <h3>威胁</h3>
              <ul>
                <li>周边竞品增多</li>
                <li>维护成本高昂</li>
                <li>同质化竞争</li>
                <li>商业运营压力</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-design">
        <div class="section-header">
          <span class="section-number">07</span>
          <h2>设计构思</h2>
        </div>
        <div class="design-content">
          <div class="design-card">
            <div class="design-icon">🏛️</div>
            <h3>传承历史文脉</h3>
            <p>保留传统建筑风貌，延续历史街区肌理，注入现代功能</p>
          </div>
          <div class="design-card">
            <div class="design-icon">🌿</div>
            <h3>绿色生态理念</h3>
            <p>引入海绵城市设计，打造绿色空间，提升环境品质</p>
          </div>
          <div class="design-card">
            <div class="design-icon">💡</div>
            <h3>智慧科技赋能</h3>
            <p>建设智慧街区，实现数字化管理与服务升级</p>
          </div>
          <div class="design-card">
            <div class="design-icon">🤝</div>
            <h3>多元业态融合</h3>
            <p>打造文化体验、商业休闲、创意办公复合型街区</p>
          </div>
        </div>
      </section>

      <section class="section section-details">
        <div class="section-header">
          <span class="section-number">08</span>
          <h2>设计详图</h2>
        </div>
        <div class="details-content">
          <div class="detail-item">
            <img src="https://neeko-copilot.bytedance.net/api/text2image?prompt=Traditional%20Chinese%20architecture%20detail%2C%20wooden%20structure%2C%20carved%20patterns%2C%20red%20lanterns%2C%20architectural%20drawing%20style&image_size=square" alt="建筑细节" />
            <h4>建筑细节设计</h4>
          </div>
          <div class="detail-item">
            <img src="https://neeko-copilot.bytedance.net/api/text2image?prompt=Urban%20street%20furniture%20design%2C%20traditional%20style%20benches%2C%20lanterns%2C%20signage%2C%20pedestrian%20friendly&image_size=square" alt="街道设施" />
            <h4>街道设施设计</h4>
          </div>
          <div class="detail-item">
            <img src="https://neeko-copilot.bytedance.net/api/text2image?prompt=Landscape%20design%20plan%2C%20courtyard%20garden%2C%20traditional%20Chinese%20elements%2C%20plants%20layout%2C%20architectural%20rendering&image_size=square" alt="景观设计" />
            <h4>景观节点设计</h4>
          </div>
        </div>
      </section>
    </div>

    <footer class="board-footer">
      <div class="footer-info">
        <p>设计单位：XX建筑设计研究院</p>
        <p>设计时间：2024年</p>
      </div>
      <div class="footer-logo">
        <span>古韵新章 · 城市焕新</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
.exhibition-board {
  min-height: 100vh;
  background: linear-gradient(135deg, #FAEBD7 0%, #F5DEB3 100%);
  padding: 20px;
}

.board-header {
  background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%);
  color: white;
  padding: 30px 40px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(139, 0, 0, 0.3);
}

.header-title h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.header-badge {
  float: right;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.board-content {
  display: grid;
  gap: 20px;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #DEB887;
}

.section-number {
  background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
}

.section-header h2 {
  margin: 0;
  color: #8B4513;
  font-size: 1.4rem;
}

.hero-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.hero-image img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hero-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  background: #FAEBD7;
  padding: 15px;
  border-radius: 8px;
}

.info-label {
  display: block;
  font-size: 0.85rem;
  color: #8B4513;
  margin-bottom: 5px;
}

.info-value {
  font-weight: bold;
  color: #333;
}

.location-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.location-map {
  background: #FAEBD7;
  border-radius: 8px;
  padding: 15px;
}

.map-svg {
  width: 100%;
  height: 200px;
}

.location-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #FAEBD7;
  border-radius: 8px;
}

.location-icon {
  font-size: 2rem;
}

.location-text strong {
  display: block;
  color: #8B0000;
  margin-bottom: 5px;
}

.location-text p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.analysis-card {
  background: #FAEBD7;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.analysis-card h3 {
  margin: 0 0 10px 0;
  color: #8B0000;
}

.analysis-card p {
  margin: 0;
  color: #666;
  font-size: 0.85rem;
}

.crowd-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.crowd-chart {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-bar {
  display: flex;
  align-items: center;
  gap: 15px;
}

.bar-fill {
  background: linear-gradient(180deg, #8B0000 0%, #DC143C 100%);
  width: 300px;
  border-radius: 4px;
  display: flex;
  align-items: flex-end;
  padding: 5px 10px;
  color: white;
  font-size: 0.85rem;
  transition: height 0.5s ease;
}

.bar-value {
  font-weight: bold;
  color: #8B0000;
  min-width: 40px;
  text-align: right;
}

.crowd-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #FAEBD7;
  border-radius: 8px;
}

.info-icon {
  font-size: 2.5rem;
}

.info-content strong {
  display: block;
  color: #8B0000;
  margin-bottom: 5px;
}

.info-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.plan-content {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px;
}

.plan-map {
  background: white;
  border-radius: 8px;
  border: 2px solid #DEB887;
}

.plan-svg {
  width: 100%;
  height: 250px;
}

.plan-legend {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #FAEBD7;
  padding: 20px;
  border-radius: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.legend-text {
  color: #8B4513;
  font-size: 0.9rem;
}

.swot-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.swot-card {
  padding: 20px;
  border-radius: 8px;
}

.swot-strength {
  background: #E8F5E9;
  border-left: 4px solid #2E7D32;
}

.swot-weakness {
  background: #FFEBEE;
  border-left: 4px solid #C62828;
}

.swot-opportunity {
  background: #E3F2FD;
  border-left: 4px solid #1976D2;
}

.swot-threat {
  background: #FFF3E0;
  border-left: 4px solid #EF6C00;
}

.swot-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.swot-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.swot-card ul {
  margin: 0;
  padding-left: 20px;
}

.swot-card li {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 5px;
}

.swot-card li:last-child {
  margin-bottom: 0;
}

.design-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.design-card {
  background: linear-gradient(135deg, #FAEBD7 0%, #F5DEB3 100%);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #DEB887;
}

.design-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.design-card h3 {
  margin: 0 0 10px 0;
  color: #8B0000;
}

.design-card p {
  margin: 0;
  color: #666;
  font-size: 0.85rem;
}

.details-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.detail-item {
  text-align: center;
}

.detail-item img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
}

.detail-item h4 {
  margin: 0;
  color: #8B4513;
}

.board-footer {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: white;
  padding: 25px 40px;
  border-radius: 12px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info p {
  margin: 5px 0;
  opacity: 0.9;
}

.footer-logo {
  font-weight: bold;
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .hero-content,
  .location-content,
  .crowd-content,
  .plan-content {
    grid-template-columns: 1fr;
  }
  
  .analysis-grid,
  .swot-grid,
  .design-content,
  .details-content {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .header-title h1 {
    font-size: 1.8rem;
  }
  
  .header-badge {
    float: none;
    display: inline-block;
    margin-top: 10px;
  }
  
  .board-footer {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .analysis-grid,
  .swot-grid,
  .design-content,
  .details-content {
    grid-template-columns: 1fr;
  }
  
  .header-title h1 {
    font-size: 1.5rem;
  }
}
</style>
