/**
 * Matrix Template View Renderer
 * Cyberpunk Terminal interface, HUD panels, neon green accents, digital nodes
 */

export function renderMatrixView(container, data, currentPath, state) {
  if (currentPath === '/side-quests') {
    container.innerHTML = renderMatrixSideQuests();
    return;
  }

  if (currentPath === '/writing') {
    container.innerHTML = renderMatrixWriting();
    return;
  }

  container.innerHTML = renderMatrixHome(data, state);
  setupMatrixInteractions(container, state);
}

function renderMatrixHome(data, state) {
  const { name, job_description, resume, skills, projects, experiences, education, volunteer, contact } = data;

  return `
    <div class="container" style="padding-top: 1.5rem;">
      <!-- Matrix HUD Status Bar -->
      <header class="matrix-hud">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div class="matrix-prompt-line" style="margin-bottom: 0;">
            <span>root@tbs-mainframe:~$</span>
            <span style="color: var(--accent-primary); font-weight: 700;">./init_portfolio.sh --candidate="OZ"</span>
            <span class="blink">_</span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <button type="button" class="matrix-rain-toggle" id="matrix-toggle-rain">
              <span>Rain FX:</span>
              <strong id="rain-status-text">${state.matrixRain ? 'ONLINE' : 'PAUSED'}</strong>
            </button>
            <span class="badge" style="border: 1px solid var(--accent-primary);">SECURE_SSL</span>
          </div>
        </div>

        <div class="hud-stats-grid">
          <div class="hud-stat-box">
            <div class="hud-stat-label">OPERATIONAL STATUS</div>
            <div class="hud-stat-value">ONLINE // ACTIVE</div>
          </div>
          <div class="hud-stat-box">
            <div class="hud-stat-label">PRIMARY DIRECTIVE</div>
            <div class="hud-stat-value" style="color: #FFEA95;">PFE INTERNSHIP 2027</div>
          </div>
          <div class="hud-stat-box">
            <div class="hud-stat-label">ACADEMIC BASE</div>
            <div class="hud-stat-value">TBS (TUNIS)</div>
          </div>
          <div class="hud-stat-box">
            <div class="hud-stat-label">SPECIALIZATION</div>
            <div class="hud-stat-value">BACKEND + AI</div>
          </div>
        </div>
      </header>

      <!-- Matrix Hero -->
      <section class="matrix-hero" id="matrix-hero">
        <div>
          <div class="matrix-prompt-line">
            <span>[SYS_ID: 0x9AF2]</span>
            <span>IDENTIFIED SUBJECT:</span>
          </div>

          <h1 class="matrix-glitch-title">${escapeHtml(name.toUpperCase())}</h1>
          <h2 style="color: var(--text-heading); font-size: 1.3rem; margin-top: 0.5rem; font-weight: 600;">
            > ${escapeHtml(job_description)}
          </h2>

          <p class="matrix-tagline">
            "${escapeHtml(resume)}"
          </p>

          <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 2rem;">
            <a href="#matrix-projects" class="btn btn-primary">
              ACCESS DEPLOYED PROJECTS
            </a>
            <a href="/apis/get_cv?langauge=english&download=1" target="_blank" class="btn btn-secondary">
              DOWNLOAD DOSSIER (CV EN)
            </a>
            <a href="/apis/get_cv?langauge=french&download=1" target="_blank" class="btn btn-secondary">
              DOSSIER (CV FR)
            </a>
          </div>
        </div>

        <!-- Matrix Cyber Avatar Frame -->
        <div class="matrix-avatar-wrap">
          <div class="matrix-frame-hex">
            <span style="font-size: 4.5rem; font-weight: 900; color: var(--accent-primary); letter-spacing: -0.05em;">
              OZ
            </span>
            <span style="font-size: 0.72rem; color: var(--text-body); letter-spacing: 0.15em; text-transform: uppercase;">
              CORE_OPERATOR
            </span>
            <div class="matrix-pfe-alert">
              LOOKING FOR A PFE INTERNSHIP!
            </div>
          </div>
        </div>
      </section>

      <!-- PROTOCOL 01 // IDENTITY DATA -->
      <section class="cyber-panel" id="matrix-about">
        <span class="cyber-panel-tag">[ PROTOCOL 01 // IDENTITY_DATA ]</span>
        <h3 style="color: var(--text-heading); font-size: 1.3rem; margin-bottom: 1rem;">
          SYSTEM OVERVIEW & STATISTICAL PROFILE
        </h3>
        <p style="color: var(--text-body); line-height: 1.7; font-size: 1rem;">
          ${escapeHtml(resume)}
        </p>
        <p style="color: var(--text-secondary); margin-top: 1rem; line-height: 1.6; font-size: 0.95rem;">
          Fourth-year IT student at Tunis Business School combining backend systems engineering with multivariate business analytics. Specializing in Python, RESTful API architecture, statistical modeling, and data pipelines.
        </p>
      </section>

      <!-- PROTOCOL 02 // NEURAL SKILLS MATRIX -->
      <section class="cyber-panel" id="matrix-skills">
        <span class="cyber-panel-tag">[ PROTOCOL 02 // NEURAL_SKILLS_MATRIX ]</span>
        <h3 style="color: var(--text-heading); font-size: 1.3rem; margin-bottom: 1rem;">
          TECHNICAL NODES & FRAMEWORKS
        </h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
          <div style="background-color: var(--bg-alt); padding: 1.25rem; border: 1px dashed var(--border-card);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary);">LANGUAGES & RUNTIMES</div>
            <div class="matrix-skill-cluster">
              ${(skills.programming_languages || []).map(s => `<span class="matrix-node-tag">λ ${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>

          <div style="background-color: var(--bg-alt); padding: 1.25rem; border: 1px dashed var(--border-card);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary);">FRAMEWORKS & LIBS</div>
            <div class="matrix-skill-cluster">
              ${(skills.frameworks_and_libraries || []).map(s => `<span class="matrix-node-tag">⚡ ${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>

          <div style="background-color: var(--bg-alt); padding: 1.25rem; border: 1px dashed var(--border-card);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary);">DATA & ANALYTICS</div>
            <div class="matrix-skill-cluster">
              ${(skills.data_analysis_and_visualization || []).map(s => `<span class="matrix-node-tag">◈ ${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>

          <div style="background-color: var(--bg-alt); padding: 1.25rem; border: 1px dashed var(--border-card);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary);">DATABASES & DEVOPS</div>
            <div class="matrix-skill-cluster">
              ${(skills.databases || []).concat(skills.tools_and_technologies || []).map(s => `<span class="matrix-node-tag">⬡ ${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>
        </div>

        <div style="margin-top: 1.5rem; border-top: 1px solid var(--border-card); padding-top: 1rem;">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem;">LINGUISTIC PROTOCOLS:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
            ${(skills.languages || []).map(l => `
              <span class="matrix-node-tag">
                ${escapeHtml(l.name)}: <strong>${escapeHtml(l.proficiency)}</strong>
              </span>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- PROTOCOL 03 // DEPLOYED PROJECTS -->
      <section class="cyber-panel" id="matrix-projects">
        <span class="cyber-panel-tag">[ PROTOCOL 03 // DEPLOYED_PROJECTS ]</span>
        <h3 style="color: var(--text-heading); font-size: 1.3rem; margin-bottom: 1.5rem;">
          ACTIVE CODE & DATA BASES
        </h3>

        <div class="matrix-projects-grid">
          ${(projects || []).map((proj, idx) => `
            <div class="matrix-project-box">
              <div>
                <span class="matrix-project-id">[SYS_EXEC_0${idx + 1}]</span>
                <h4 class="matrix-project-title">${escapeHtml(proj.title)}</h4>
                <p class="matrix-project-desc" style="margin-top: 0.75rem;">${escapeHtml(proj.description)}</p>
              </div>

              <div>
                <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 1rem;">
                  ${(proj.technologies || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
                </div>
                ${proj.url ? `
                  <div style="margin-top: 1rem;">
                    <a href="${escapeHtml(proj.url)}" target="_blank" class="btn btn-sm btn-secondary" style="width: 100%;">
                      ACCESS REPO // LINK ↗
                    </a>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- PROTOCOL 04 // TIMELINE LOGS -->
      <section class="cyber-panel" id="matrix-experience">
        <span class="cyber-panel-tag">[ PROTOCOL 04 // CHRONOLOGICAL_LOGS ]</span>
        <h3 style="color: var(--text-heading); font-size: 1.3rem; margin-bottom: 1.5rem;">
          CAREER & INTERNSHIP TIMELINES
        </h3>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${(experiences || []).map(exp => `
            <div style="border-left: 3px solid var(--accent-primary); padding-left: 1.25rem; background-color: var(--bg-alt); padding: 1.25rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                <h4 style="color: var(--accent-primary); font-size: 1.15rem; font-weight: 700;">
                  ${escapeHtml(exp.position)} @ ${escapeHtml(exp.company)}
                </h4>
                <span style="font-size: 0.8rem; color: var(--text-muted);">
                  [ ${escapeHtml(exp.start_date)} // ${escapeHtml(exp.end_date)} ]
                </span>
              </div>

              <div style="display: flex; gap: 0.5rem; margin: 0.5rem 0;">
                <span class="tag">${escapeHtml(exp.employment_type)}</span>
                <span class="tag">${escapeHtml(exp.work_mode)}</span>
              </div>

              <ul style="list-style: none; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.35rem;">
                ${(exp.description || []).map(desc => `
                  <li style="font-size: 0.92rem; color: var(--text-body);">
                    > ${escapeHtml(desc)}
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- PROTOCOL 05 // ACADEMICS -->
      <section class="cyber-panel" id="matrix-education">
        <span class="cyber-panel-tag">[ PROTOCOL 05 // ACADEMIC_CREDENTIALS ]</span>
        <h3 style="color: var(--text-heading); font-size: 1.3rem; margin-bottom: 1rem;">
          INSTITUTIONAL METRICS
        </h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          ${(education || []).map(edu => `
            <div style="background-color: var(--bg-alt); padding: 1.5rem; border: 1px solid var(--border-card);">
              <span class="badge" style="border: 1px solid var(--accent-primary);">${escapeHtml(edu.status || 'ACTIVE')}</span>
              <h4 style="color: var(--text-heading); font-size: 1.15rem; margin-top: 0.5rem;">${escapeHtml(edu.institution)}</h4>
              <p style="color: var(--accent-primary); font-size: 0.95rem;">${escapeHtml(edu.degree)}</p>
              <div style="margin-top: 0.75rem; font-size: 0.88rem; color: var(--text-secondary);">
                <p>Major: ${escapeHtml(edu.major)}</p>
                <p>Minor: ${escapeHtml(edu.minor || 'None')}</p>
                <p>Cycle: ${escapeHtml(edu.start_date)} — ${escapeHtml(edu.end_date)}</p>
              </div>
            </div>
          `).join('')}

          ${volunteer ? `
            <div style="background-color: var(--bg-alt); padding: 1.5rem; border: 1px solid var(--border-card);">
              <span class="badge" style="border: 1px solid var(--accent-primary);">COMMUNITY</span>
              <h4 style="color: var(--text-heading); font-size: 1.15rem; margin-top: 0.5rem;">${escapeHtml(volunteer.club)}</h4>
              <p style="color: var(--text-body); font-size: 0.9rem; margin-top: 0.5rem;">${escapeHtml(volunteer.description)}</p>
              <ul style="list-style: none; margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">
                ${(volunteer.tasks || []).map(t => `<li>> ${escapeHtml(t)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </section>

      <!-- PROTOCOL 06 // COMMS GRID -->
      <section class="cyber-panel" id="matrix-contact">
        <span class="cyber-panel-tag">[ PROTOCOL 06 // COMMS_GRID ]</span>
        <h3 style="color: var(--text-heading); font-size: 1.3rem; margin-bottom: 1rem;">
          ENCRYPTED TRANSMISSION CHANNELS
        </h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
          ${contact.email ? `
            <a href="mailto:${escapeHtml(contact.email)}" class="btn btn-secondary" style="justify-content: flex-start;">
              <span>✉ EMAIL: ${escapeHtml(contact.email)}</span>
            </a>
          ` : ''}
          ${contact.phone ? `
            <a href="tel:${escapeHtml(contact.phone)}" class="btn btn-secondary" style="justify-content: flex-start;">
              <span>☎ TEL: ${escapeHtml(contact.phone)}</span>
            </a>
          ` : ''}
          ${contact.linkedin ? `
            <a href="${escapeHtml(contact.linkedin)}" target="_blank" class="btn btn-secondary" style="justify-content: flex-start;">
              <span>🔗 LINKEDIN // CONNECT ↗</span>
            </a>
          ` : ''}
          ${contact.github ? `
            <a href="${escapeHtml(contact.github)}" target="_blank" class="btn btn-secondary" style="justify-content: flex-start;">
              <span>⬡ GITHUB // SOURCE ↗</span>
            </a>
          ` : ''}
        </div>
      </section>
    </div>
  `;
}

function renderMatrixSideQuests() {
  return `
    <div class="container" style="padding-top: 3rem;">
      <section class="cyber-panel">
        <span class="cyber-panel-tag">[ SECTOR: SIDE_QUESTS // LAB_ENVIRONMENT ]</span>
        <h1 style="color: var(--accent-primary); font-size: 2rem; margin-bottom: 1rem;">
          FIELD EXPERIMENTS & SIDE QUESTS
        </h1>
        <p style="color: var(--text-body); font-size: 1.05rem; line-height: 1.6;">
          Terminal sandbox designated for peripheral research, algorithmic experiments, and off-grid technology ventures.
        </p>

        <div style="margin-top: 2.5rem; background-color: var(--bg-alt); border: 1px dashed var(--border-card); padding: 2.5rem; text-align: center;">
          <div style="font-size: 2rem; color: var(--accent-primary); margin-bottom: 0.5rem;">[ 0 // LOGS_DETECTED ]</div>
          <h2 style="font-size: 1.25rem; color: var(--text-heading);">PIPELINE STANDBY // PFE CANDIDACY ACTIVE</h2>
          <p style="color: var(--text-secondary); max-width: 500px; margin: 0.75rem auto; font-size: 0.95rem;">
            Currently channeling CPU cycles into academic deliverables at TBS and securing 2027 graduation internship. Additional field logs will stream online soon.
          </p>
          <a href="/" data-link class="btn btn-primary" style="margin-top: 1.5rem;">
            ← RE-ROUTE TO MAIN PORTFOLIO
          </a>
        </div>
      </section>
    </div>
  `;
}

function renderMatrixWriting() {
  return `
    <div class="container" style="padding-top: 3rem;">
      <section class="cyber-panel">
        <span class="cyber-panel-tag">[ ARCHIVE: WRITING // PERSPECTIVES ]</span>
        <h1 style="color: var(--accent-primary); font-size: 2rem; margin-bottom: 1rem;">
          DISPATCHES & TECHNICAL ESSAYS
        </h1>
        <p style="color: var(--text-body); font-size: 1.05rem; line-height: 1.6;">
          Theoretical documentation, architectural case studies, and engineering breakdowns.
        </p>

        <div style="margin-top: 2.5rem; background-color: var(--bg-alt); border: 1px dashed var(--border-card); padding: 2.5rem; text-align: center;">
          <div style="font-size: 2rem; color: var(--accent-primary); margin-bottom: 0.5rem;">[ BUFFER_STATUS: EMPTY ]</div>
          <h2 style="font-size: 1.25rem; color: var(--text-heading);">DRAFTS INCUBATING IN BACKGROUND THREADS</h2>
          <p style="color: var(--text-secondary); max-width: 500px; margin: 0.75rem auto; font-size: 0.95rem;">
            Articles analyzing financial ratio forecasting, backend API reliability with Flask, and statistical models will be published here upon peer review.
          </p>
          <a href="/" data-link class="btn btn-primary" style="margin-top: 1.5rem;">
            ← RE-ROUTE TO MAIN PORTFOLIO
          </a>
        </div>
      </section>
    </div>
  `;
}

function setupMatrixInteractions(container, state) {
  const rainBtn = container.querySelector('#matrix-toggle-rain');
  const rainText = container.querySelector('#rain-status-text');
  if (rainBtn && rainText) {
    rainBtn.addEventListener('click', () => {
      const nextVal = !state.matrixRain;
      state.setMatrixRain(nextVal);
      rainText.textContent = nextVal ? 'ONLINE' : 'PAUSED';
    });
  }
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
