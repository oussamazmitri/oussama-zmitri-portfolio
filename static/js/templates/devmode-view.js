/**
 * Dev Mode Template View Renderer
 * Python IDE / Editor Experience with tabs, file tree, line numbers, and syntax highlighting
 * Localized with centralized i18n system
 */

import { t, getLanguage } from '../i18n.js';

let activeFileId = 'profile.py';

export function renderDevModeView(container, data, currentPath) {
  // Sync default file based on route
  if (currentPath === '/side-quests') {
    activeFileId = 'side_quests.py';
  } else if (currentPath === '/writing') {
    activeFileId = 'writing.md';
  } else if (activeFileId === 'side_quests.py' || activeFileId === 'writing.md') {
    activeFileId = 'profile.py';
  }

  container.innerHTML = `
    <div class="container-wide">
      <div class="ide-window">
        <!-- Titlebar -->
        <div class="ide-titlebar">
          <div class="ide-window-controls">
            <span class="window-dot dot-close"></span>
            <span class="window-dot dot-min"></span>
            <span class="window-dot dot-max"></span>
          </div>

          <div class="ide-window-title">
            <span>oussama-portfolio/src/${activeFileId} — Python 3.13.9</span>
          </div>

          <div class="ide-window-actions">
            <button type="button" class="ide-action-btn" id="ide-run-cv">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>${t('devmode.download_cv', 'Download CV')}</span>
            </button>
          </div>
        </div>

        <!-- Body: Sidebar + Editor -->
        <div class="ide-body">
          <!-- Sidebar -->
          <aside class="ide-sidebar">
            <div class="sidebar-header">
              <span>${t('devmode.explorer_title', 'EXPLORER: PORTFOLIO')}</span>
              <span>${t('devmode.explorer_src', 'src/')}</span>
            </div>

            <ul class="file-tree">
              <li class="tree-folder">
                <span>📁 src</span>
              </li>
              ${renderFileTreeItems(currentPath)}
            </ul>
          </aside>

          <!-- Editor Area -->
          <main class="ide-editor">
            <!-- Tabs Bar -->
            <div class="editor-tabs-bar">
              ${renderEditorTabs(currentPath)}
            </div>

            <!-- Breadcrumb -->
            <div class="editor-breadcrumb">
              <span>${t('devmode.breadcrumb_root', 'portfolio')}</span>
              <span>›</span>
              <span>${t('devmode.breadcrumb_src', 'src')}</span>
              <span>›</span>
              <span style="color: var(--text-heading); font-weight: 600;">${activeFileId}</span>
            </div>

            <!-- Workspace: Line Numbers + Code Viewport -->
            <div class="editor-workspace">
              <div class="gutter-line-numbers" id="ide-gutter">
                <!-- Lines injected dynamically -->
              </div>
              <div class="code-viewport" id="ide-code">
                <!-- Code content injected dynamically -->
              </div>
            </div>
          </main>
        </div>

        <!-- IDE Status Bar -->
        <footer class="ide-statusbar">
          <div class="statusbar-left">
            <div class="status-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span>${t('devmode.python_runtime', 'Python 3.13.9 64-bit')}</span>
            </div>
            <div class="status-item">
              <span>${t('devmode.git_branch', '🌿 git:(main*)')}</span>
            </div>
          </div>

          <div class="statusbar-right">
            <div class="status-item">
              <span>${t('devmode.encoding', 'UTF-8')}</span>
            </div>
            <div class="status-item">
              <span>${t('devmode.spaces', 'Spaces: 4')}</span>
            </div>
            <div class="status-item">
              <span class="status-badge-pfe">${t('devmode.pfe_status', 'PFE: Searching Active')}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  `;

  setupDevModeInteractions(container, data, currentPath);
  renderActiveCodeBuffer(container, data);
}

function getFilesList(currentPath) {
  if (currentPath === '/side-quests') {
    return [
      { id: 'side_quests.py', icon: '🐍', name: 'side_quests.py' },
      { id: 'profile.py', icon: '🐍', name: 'profile.py' },
      { id: 'skills.py', icon: '🐍', name: 'skills.py' }
    ];
  }
  if (currentPath === '/writing') {
    return [
      { id: 'writing.md', icon: '📝', name: 'writing.md' },
      { id: 'profile.py', icon: '🐍', name: 'profile.py' },
      { id: 'skills.py', icon: '🐍', name: 'skills.py' }
    ];
  }
  return [
    { id: 'profile.py', icon: '🐍', name: 'profile.py' },
    { id: 'skills.py', icon: '🐍', name: 'skills.py' },
    { id: 'projects.py', icon: '🐍', name: 'projects.py' },
    { id: 'experience.py', icon: '🐍', name: 'experience.py' },
    { id: 'education.py', icon: '🐍', name: 'education.py' },
    { id: 'contact.py', icon: '🐍', name: 'contact.py' }
  ];
}

function renderFileTreeItems(currentPath) {
  const files = getFilesList(currentPath);
  return files.map(f => `
    <li class="file-item ${f.id === activeFileId ? 'active' : ''}" data-file="${f.id}">
      <span class="file-icon">${f.icon}</span>
      <span>${f.name}</span>
    </li>
  `).join('');
}

function renderEditorTabs(currentPath) {
  const files = getFilesList(currentPath);
  return files.map(f => `
    <div class="editor-tab ${f.id === activeFileId ? 'active' : ''}" data-file="${f.id}">
      <span class="file-icon">${f.icon}</span>
      <span>${f.name}</span>
      <span class="tab-close">×</span>
    </div>
  `).join('');
}

function renderActiveCodeBuffer(container, data) {
  const gutter = container.querySelector('#ide-gutter');
  const codeArea = container.querySelector('#ide-code');
  if (!gutter || !codeArea) return;

  const codeHtml = generateCodeForFile(activeFileId, data);
  codeArea.innerHTML = codeHtml;

  const lineCount = (codeHtml.match(/<div class="code-line">/g) || []).length || 20;
  let gutterHtml = '';
  for (let i = 1; i <= lineCount; i++) {
    gutterHtml += `<div>${i}</div>`;
  }
  gutter.innerHTML = gutterHtml;
}

function generateCodeForFile(fileId, data) {
  const { name, job_description, resume, skills, projects, experiences, education, volunteer, contact } = data;

  switch (fileId) {
    case 'profile.py':
      return `
<div class="code-line"><span class="syn-com">"""</span></div>
<div class="code-line"><span class="syn-com">Module: profile.py</span></div>
<div class="code-line"><span class="syn-com">Author: ${escapeHtml(name)}</span></div>
<div class="code-line"><span class="syn-com">Role: ${escapeHtml(job_description)}</span></div>
<div class="code-line"><span class="syn-com">Notice: ${t('devmode.notice_pfe', 'LOOKING FOR A PFE INTERNSHIP (2027)')}</span></div>
<div class="code-line"><span class="syn-com">"""</span></div>
<div class="code-line"></div>
<div class="code-line"><span class="syn-kw">from</span> dataclasses <span class="syn-kw">import</span> dataclass</div>
<div class="code-line"><span class="syn-kw">from</span> typing <span class="syn-kw">import</span> List, Optional</div>
<div class="code-line"></div>
<div class="code-line"><span class="syn-dec">@dataclass</span></div>
<div class="code-line"><span class="syn-kw">class</span> <span class="syn-cls">CandidateProfile</span>:</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;name: <span class="syn-cls">str</span> = <span class="syn-str">"${escapeHtml(name)}"</span></div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;headline: <span class="syn-cls">str</span> = <span class="syn-str">"${escapeHtml(job_description)}"</span></div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;status: <span class="syn-cls">str</span> = <span class="syn-str">"${t('devmode.status_pfe', 'Looking for a PFE Internship!')}"</span></div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;institution: <span class="syn-cls">str</span> = <span class="syn-str">"Tunis Business School (TBS)"</span></div>
<div class="code-line"></div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-kw">def</span> <span class="syn-def">get_bio</span>(self) -> <span class="syn-cls">str</span>:</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-kw">return</span> <span class="syn-str">"""${escapeHtml(resume)}"""</span></div>
<div class="code-line"></div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-kw">def</span> <span class="syn-def">download_curriculum_vitae</span>(self, language: <span class="syn-cls">str</span> = <span class="syn-str">"english"</span>):</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-com"># ${t('devmode.interactive_action', 'Interactive action trigger')}</span></div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-kw">return</span> {</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"en"</span>: <a href="/apis/get_cv?lang=en&download=1" class="code-action-tag" target="_blank">${t('devmode.run_en', "▶ Run: download_cv('english')")}</a>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"fr"</span>: <a href="/apis/get_cv?lang=fr&download=1" class="code-action-tag" target="_blank">${t('devmode.run_fr', "▶ Run: download_cv('french')")}</a></div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</div>
<div class="code-line"></div>
<div class="code-line">profile = <span class="syn-cls">CandidateProfile</span>()</div>
<div class="code-line"><span class="syn-kw">print</span>(f<span class="syn-str">"${t('devmode.init_message', 'Initialized profile for')} {profile.name} - {profile.status}"</span>)</div>
`;

    case 'skills.py':
      return `
<div class="code-line"><span class="syn-com">"""</span></div>
<div class="code-line"><span class="syn-com">Module: skills.py</span></div>
<div class="code-line"><span class="syn-com">${t('devmode.module_skills', 'Technical stack and statistical proficiencies')}</span></div>
<div class="code-line"><span class="syn-com">"""</span></div>
<div class="code-line"></div>
<div class="code-line"><span class="syn-kw">from</span> typing <span class="syn-kw">import</span> Dict, List</div>
<div class="code-line"></div>
<div class="code-line">SKILLS: Dict[<span class="syn-cls">str</span>, List[<span class="syn-cls">str</span>]] = {</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"programming_languages"</span>: ${JSON.stringify(skills.programming_languages || [])},</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"frameworks_and_libraries"</span>: ${JSON.stringify(skills.frameworks_and_libraries || [])},</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"databases"</span>: ${JSON.stringify(skills.databases || [])},</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"data_analysis_and_visualization"</span>: ${JSON.stringify(skills.data_analysis_and_visualization || [])},</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"tools_and_technologies"</span>: ${JSON.stringify(skills.tools_and_technologies || [])},</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"business_and_professional_skills"</span>: ${JSON.stringify(skills.business_and_professional_skills || [])}</div>
<div class="code-line">}</div>
<div class="code-line"></div>
<div class="code-line">SPOKEN_LANGUAGES = ${JSON.stringify(skills.languages || [], null, 4)}</div>
`;

    case 'projects.py':
      return `
<div class="code-line"><span class="syn-com">"""</span></div>
<div class="code-line"><span class="syn-com">Module: projects.py</span></div>
<div class="code-line"><span class="syn-com">${t('devmode.module_projects', 'Backend and analytics production deliverables')}</span></div>
<div class="code-line"><span class="syn-com">"""</span></div>
<div class="code-line"></div>
<div class="code-line">PROJECTS = [</div>
${(projects || []).map((p, i) => `
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;{</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"id"</span>: <span class="syn-num">${i + 1}</span>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"title"</span>: <span class="syn-str">"${escapeHtml(p.title)}"</span>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"technologies"</span>: ${JSON.stringify(p.technologies || [])},</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"description"</span>: <span class="syn-str">"${escapeHtml(Array.isArray(p.description) ? p.description.join(' ') : p.description)}"</span>${p.url ? `,` : ''}</div>
${p.url ? `<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"url"</span>: <a href="${escapeHtml(p.url)}" target="_blank" class="code-action-tag">Open project URL ↗</a></div>` : ''}
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;},</div>
`).join('')}
<div class="code-line">]</div>
`;

    case 'experience.py':
      return `
<div class="code-line"><span class="syn-com">"""</span></div>
<div class="code-line"><span class="syn-com">Module: experience.py</span></div>
<div class="code-line"><span class="syn-com">${t('devmode.module_experience', 'Chronological software development and internship history')}</span></div>
<div class="code-line"><span class="syn-com">"""</span></div>
<div class="code-line"></div>
<div class="code-line">EXPERIENCES = [</div>
${(experiences || []).map(exp => `
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;{</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"position"</span>: <span class="syn-str">"${escapeHtml(exp.position)}"</span>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"company"</span>: <span class="syn-str">"${escapeHtml(exp.company)}"</span>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"employment_type"</span>: <span class="syn-str">"${escapeHtml(exp.employment_type)}"</span>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"work_mode"</span>: <span class="syn-str">"${escapeHtml(exp.work_mode)}"</span>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"dates"</span>: (<span class="syn-str">"${escapeHtml(exp.start_date)}"</span>, <span class="syn-str">"${escapeHtml(exp.end_date)}"</span>),</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"contributions"</span>: ${JSON.stringify(exp.description || [], null, 8)}</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;},</div>
`).join('')}
<div class="code-line">]</div>
`;

    case 'education.py':
      return `
<div class="code-line"><span class="syn-com">"""</span></div>
<div class="code-line"><span class="syn-com">Module: education.py</span></div>
<div class="code-line"><span class="syn-com">${t('devmode.module_education', 'Academic qualifications and community leadership')}</span></div>
<div class="code-line"><span class="syn-com">"""</span></div>
<div class="code-line"></div>
<div class="code-line">EDUCATION = [</div>
${(education || []).map(edu => `
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;{</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"institution"</span>: <span class="syn-str">"${escapeHtml(edu.institution)}"</span>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"degree"</span>: <span class="syn-str">"${escapeHtml(edu.degree)}"</span>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"major"</span>: <span class="syn-str">"${escapeHtml(edu.major)}"</span>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"minor"</span>: <span class="syn-str">"${escapeHtml(edu.minor || 'None')}"</span>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"period"</span>: (<span class="syn-str">"${escapeHtml(edu.start_date)}"</span>, <span class="syn-str">"${escapeHtml(edu.end_date)}"</span>),</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"status"</span>: <span class="syn-str">"${escapeHtml(edu.status || t('education.status_in_progress', 'In Progress'))}"</span></div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;},</div>
`).join('')}
<div class="code-line">]</div>
<div class="code-line"></div>
<div class="code-line">VOLUNTEER = {</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"club"</span>: <span class="syn-str">"${escapeHtml(volunteer ? volunteer.club : '')}"</span>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"tasks"</span>: ${JSON.stringify(volunteer ? volunteer.tasks : [])},</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"description"</span>: <span class="syn-str">"${escapeHtml(volunteer ? volunteer.description : '')}"</span></div>
<div class="code-line">}</div>
`;

    case 'contact.py':
      return `
<div class="code-line"><span class="syn-com">"""</span></div>
<div class="code-line"><span class="syn-com">Module: contact.py</span></div>
<div class="code-line"><span class="syn-com">${t('devmode.module_contact', 'Direct links and channels')}</span></div>
<div class="code-line"><span class="syn-com">"""</span></div>
<div class="code-line"></div>
<div class="code-line">CONTACTS = {</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"email"</span>: <a href="mailto:${escapeHtml(contact.email)}" class="code-action-tag">✉ ${escapeHtml(contact.email)}</a>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"university_email"</span>: <a href="mailto:${escapeHtml(contact.university_email)}" class="code-action-tag">✉ ${escapeHtml(contact.university_email)}</a>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"phone"</span>: <a href="tel:${escapeHtml(contact.phone)}" class="code-action-tag">☎ ${escapeHtml(contact.phone)}</a>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"linkedin"</span>: <a href="${escapeHtml(contact.linkedin)}" target="_blank" class="code-action-tag">🔗 View LinkedIn ↗</a>,</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"github"</span>: <a href="${escapeHtml(contact.github)}" target="_blank" class="code-action-tag">🔗 View GitHub ↗</a></div>
<div class="code-line">}</div>
`;

    case 'side_quests.py':
      return `
<div class="code-line"><span class="syn-com">"""</span></div>
<div class="code-line"><span class="syn-com">Module: side_quests.py</span></div>
<div class="code-line"><span class="syn-com">${t('devmode.module_side_quests', 'Exploratory lab, everyday observations, and side pursuits.')}</span></div>
<div class="code-line"><span class="syn-com">Notice: ${t('side_quests.status', '● Status: In Incubation')}</span></div>
<div class="code-line"><span class="syn-com">"""</span></div>
<div class="code-line"></div>
<div class="code-line"><span class="syn-kw">class</span> <span class="syn-cls">SideQuestRegistry</span>:</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;status: <span class="syn-cls">str</span> = <span class="syn-str">"${t('side_quests.status', 'In Incubation')}"</span></div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;items: <span class="syn-cls">list</span> = []</div>
<div class="code-line"></div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-kw">def</span> <span class="syn-def">describe</span>(self):</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-kw">return</span> (</div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="syn-str">"${t('side_quests.desc', 'A personal, exploratory laboratory for everyday observations, hardware tests, learning experiments, and side pursuits outside my core portfolio.')}"</span></div>
<div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)</div>
<div class="code-line"></div>
<div class="code-line">registry = <span class="syn-cls">SideQuestRegistry</span>()</div>
<div class="code-line"><span class="syn-com"># <a href="/" data-link class="code-action-tag">${t('side_quests.return_home', '← Return to Main Portfolio')}</a></span></div>
`;

    case 'writing.md':
      return `
<div class="code-line"><span class="syn-com"># ${t('writing.title', 'Writing')}</span></div>
<div class="code-line"></div>
<div class="code-line"><span class="syn-com">> ${t('writing.empty_title', 'Drafts in incubation')}</span></div>
<div class="code-line"></div>
<div class="code-line">${t('writing.desc', 'Technical explanations, engineering breakdowns, statistical case notes, and reflections on building software and AI systems.')}</div>
<div class="code-line"></div>
<div class="code-line"><span class="syn-com">---</span></div>
<div class="code-line"><a href="/" data-link class="code-action-tag">${t('writing.return_home', '← Return to Main Portfolio')}</a></div>
`;

    default:
      return `<div class="code-line"><span class="syn-com"># File not found</span></div>`;
  }
}

function setupDevModeInteractions(container, data, currentPath) {
  const tabs = container.querySelectorAll('.editor-tab');
  const treeItems = container.querySelectorAll('.file-item');

  const switchToFile = (fileId) => {
    activeFileId = fileId;
    tabs.forEach(tEl => tEl.classList.toggle('active', tEl.dataset.file === fileId));
    treeItems.forEach(item => item.classList.toggle('active', item.dataset.file === fileId));

    const titleEl = container.querySelector('.ide-window-title span');
    if (titleEl) {
      titleEl.textContent = `oussama-portfolio/src/${fileId} — Python 3.13.9`;
    }
    const breadcrumbEl = container.querySelector('.editor-breadcrumb span:last-child');
    if (breadcrumbEl) {
      breadcrumbEl.textContent = fileId;
    }

    renderActiveCodeBuffer(container, data);
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchToFile(tab.dataset.file));
  });

  treeItems.forEach(item => {
    item.addEventListener('click', () => switchToFile(item.dataset.file));
  });

  // Run CV action button
  const runCvBtn = container.querySelector('#ide-run-cv');
  if (runCvBtn) {
    runCvBtn.addEventListener('click', () => {
      const activeLang = getLanguage();
      window.open(`/apis/get_cv?lang=${activeLang}&download=1`, '_blank');
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
