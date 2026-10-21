/**
 * Normal Template View Renderer
 * Editorial layout, Sora typography, warm palette, hand-drawn hero annotation
 * Localized with centralized i18n system
 */

import { t } from '../i18n.js';

export function renderNormalView(container, data, currentPath) {
  if (currentPath === '/side-quests') {
    container.innerHTML = renderNormalSideQuests();
    return;
  }

  if (currentPath === '/writing') {
    container.innerHTML = renderNormalWriting();
    return;
  }

  // Default: Main Scrolling Portfolio
  container.innerHTML = renderNormalHome(data);
  setupNormalInteractions(container);
}

function renderNormalHome(data) {
  const { name, job_description, resume, skills, projects, experiences, education, volunteer, contact } = data;

  return `
    <div class="normal-view-wrapper">
      <!-- 1. HERO SECTION -->
      <section class="hero-section" id="hero">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-content">
              <div class="hero-badge-wrap">
                <span class="badge">
                  <span class="badge-dot"></span>
                  ${t('site.pfe_candidate', 'PFE 2027 Candidate')}
                </span>
                <span class="tag">${t('site.backend_ai', 'Backend & AI')}</span>
              </div>

              <h1 class="hero-title">${escapeHtml(name)}</h1>
              <h2 class="hero-subtitle">${escapeHtml(job_description)}</h2>

              <p class="hero-bio">${escapeHtml(resume)}</p>

              <div class="hero-actions">
                <a href="#projects" class="btn btn-primary">
                  ${t('hero.explore_work', 'Explore Work')}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                </a>

                <div class="cv-dropdown">
                  <button type="button" class="btn btn-secondary cv-trigger-btn" aria-haspopup="true" aria-expanded="false" id="hero-cv-dropdown">
                    ${t('hero.see_cv', t('hero.download_cv', 'See CV'))}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  <div class="cv-menu" role="menu">
                    <a href="/apis/get_cv?lang=en" class="cv-menu-item" target="_blank" rel="noopener">
                      <span>${t('hero.cv_english', 'English CV')}</span>
                      <small class="tag">${t('hero.pdf_tag', 'PDF')}</small>
                    </a>
                    <a href="/apis/get_cv?lang=fr" class="cv-menu-item" target="_blank" rel="noopener">
                      <span>${t('hero.cv_french', 'French CV')}</span>
                      <small class="tag">${t('hero.pdf_tag', 'PDF')}</small>
                    </a>
                  </div>
                </div>
                <a href="#experience" class="btn btn-secondary">${t('hero.Experiences', 'Experiences')}</a>

                <a href="#contact" class="btn btn-secondary">${t('hero.contact_me', 'Contact Me')}</a>
                

              </div>
            </div>

            <!-- Profile Photo with Hand-Drawn Annotation -->
            <div class="hero-visual">
              <div class="profile-frame-wrap">
                <div class="profile-circle-frame" id="profile-frame">
                  <img src="/static/images/me_in_suit.png" alt="Oussama Zmitri" class="profile-photo" onerror="this.style.display='none'; const fb = document.getElementById('profile-avatar-fallback'); if(fb) fb.style.display='flex';">
                  <div class="profile-avatar-fallback" id="profile-avatar-fallback" style="display: none;">
                    <span class="avatar-initials">OZ</span>
                    <span class="avatar-role-label">${t('site.avatar_role', 'AI & Backend')}</span>
                  </div>
                </div>

                <!-- Hand-drawn SVG marker circle & arrow -->
                <svg class="hand-drawn-annotation" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <!-- Hand-drawn circle encircling the photo -->
                  <path class="marker-stroke marker-circle" d="M 180 33 C 261 33, 327 99, 327 180 C 327 261, 261 327, 180 327 C 99 327, 33 261, 33 180 C 33 99, 99 33, 178 33 C 235 33, 310 58, 322 118" />
                  <!-- Hand-drawn curved arrow pointing from badge to photo -->
                  <path class="marker-stroke marker-arrow" d="M 330 70 C 320 88, 305 102, 285 110" />
                  <path class="marker-stroke marker-arrow" d="M 299 112 L 285 110 L 294 99" />
                </svg>

                <!-- Handwritten Scribbled Annotation Badge -->
                <div class="annotation-text-badge">
                  ${t('hero.annotation', 'Looking for a PFE Internship!')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION QUICK NAVIGATION PILLS -->
      <nav class="section-quick-nav" aria-label="${t('nav.menu_aria', 'Section Navigation')}" id="section-nav">
        <div class="container">
          <div class="section-nav-pills">
            <a href="#about" class="section-nav-pill" data-section="about">
              <span class="pill-num">01</span>
              <span class="pill-label">${t('nav.section_about', 'Background')}</span>
            </a>
            <a href="#skills" class="section-nav-pill" data-section="skills">
              <span class="pill-num">02</span>
              <span class="pill-label">${t('nav.section_skills', 'Skills')}</span>
            </a>
            <a href="#projects" class="section-nav-pill" data-section="projects">
              <span class="pill-num">03</span>
              <span class="pill-label">${t('nav.section_projects', 'Projects')}</span>
            </a>
            <a href="#experience" class="section-nav-pill" data-section="experience">
              <span class="pill-num">04</span>
              <span class="pill-label">${t('nav.section_experience', 'Experience')}</span>
            </a>
            <a href="#education" class="section-nav-pill" data-section="education">
              <span class="pill-num">05</span>
              <span class="pill-label">${t('nav.section_education', 'Education')}</span>
            </a>
            <a href="#contact" class="section-nav-pill" data-section="contact">
              <span class="pill-num">06</span>
              <span class="pill-label">${t('nav.section_contact', 'Contact')}</span>
            </a>
          </div>
        </div>
      </nav>

      <!-- 2. ABOUT / SUMMARY SECTION -->
      <section class="section-block alt-bg summary-section" id="about">
        <div class="container">
          <div class="section-header">
            <span class="section-label">${t('about.label', '01 // Background')}</span>
            <h2 class="section-title">${t('about.title', 'Engineering Solid Systems with Data & AI')}</h2>
            <p class="section-desc">${t('about.desc', 'Bridging IT backend engineering with statistical business analytics at Tunis Business School.')}</p>
          </div>

          <div class="about-content-wrap">
            <div class="about-narrative">
              <p>${t('about.narrative_2', 'With an educational foundation at Tunis Business School combining Information Technology with Business Analytics, I focus on building reliable software platforms, designing clean RESTful APIs, and translating complex data into actionable operational insights.')}</p>
            </div>

            <!-- 01 // Background 3 Feature Boxes -->
            <div class="about-highlights-grid">
              <div class="highlight-card">
                <div class="highlight-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 17l6-6-6-6M12 19h8"/></svg>
                </div>
                <div class="highlight-body">
                  <h4>${t('about.highlight_1_title', 'Backend Architecture')}</h4>
                  <p>${t('about.highlight_1_desc', 'Designing RESTful APIs with Python, Flask, Docker, and SQL databases, focused on clean contracts, maintainability, and reliability.')}</p>
                  <div class="highlight-tags">
                    <span class="tag-pill">Python</span>
                    <span class="tag-pill">Flask</span>
                    <span class="tag-pill">REST APIs</span>
                    <span class="tag-pill">Docker</span>
                  </div>
                </div>
              </div>

              <div class="highlight-card">
                <div class="highlight-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                </div>
                <div class="highlight-body">
                  <h4>${t('about.highlight_2_title', 'Data & Statistical Modeling')}</h4>
                  <p>${t('about.highlight_2_desc', 'Multivariate statistical analysis, PCA, regression modeling, and financial analytics with R, FactoMineR, and Pandas.')}</p>
                  <div class="highlight-tags">
                    <span class="tag-pill">R</span>
                    <span class="tag-pill">PCA</span>
                    <span class="tag-pill">FactoMineR</span>
                    <span class="tag-pill">Pandas</span>
                  </div>
                </div>
              </div>

              <div class="highlight-card">
                <div class="highlight-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div class="highlight-body">
                  <h4>${t('about.highlight_3_title', 'Business Analytics')}</h4>
                  <p>${t('about.highlight_3_desc', 'Integrating analytical thinking, financial statement ratios, and profit optimization into software architecture.')}</p>
                  <div class="highlight-tags">
                    <span class="tag-pill">TBS</span>
                    <span class="tag-pill">Financial Ratios</span>
                    <span class="tag-pill">Optimization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. SKILLS SECTION -->
      <section class="section-block" id="skills">
        <div class="container">
          <div class="section-header">
            <span class="section-label">${t('skills.label', '02 // Technical Capabilities')}</span>
            <h2 class="section-title">${t('skills.title', 'Skills & Technologies')}</h2>
            <p class="section-desc">${t('skills.desc', 'Technologies, analytical methods, and engineering tools applied across development and data projects.')}</p>
          </div>

          <!-- Interactive Filter Tabs -->
          <div class="skills-filter-bar">
            <button type="button" class="skills-filter-btn active" data-filter="all">${t('skills.filters.all', 'All Skills')}</button>
            <button type="button" class="skills-filter-btn" data-filter="languages">${t('skills.filters.languages', 'Programming Languages')}</button>
            <button type="button" class="skills-filter-btn" data-filter="frameworks">${t('skills.filters.frameworks', 'Frameworks & Libraries')}</button>
            <button type="button" class="skills-filter-btn" data-filter="data">${t('skills.filters.data', 'Data & AI')}</button>
            <button type="button" class="skills-filter-btn" data-filter="tools">${t('skills.filters.tools', 'Databases & Tools')}</button>
            <button type="button" class="skills-filter-btn" data-filter="spoken">${t('skills.filters.spoken', 'Spoken Languages')}</button>
          </div>

          <div class="skills-grid">
            <!-- Programming Languages -->
            <div class="skill-group-card" data-category="languages">
              <div class="skill-group-header">
                <span class="skill-group-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  ${t('skills.groups.programming_languages', 'Programming Languages')}
                </span>
                <span class="tag">${skills.programming_languages ? skills.programming_languages.length : 0}</span>
              </div>
              <div class="skill-pills-wrap">
                ${(skills.programming_languages || []).map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('')}
              </div>
            </div>

            <!-- Frameworks and Libraries -->
            <div class="skill-group-card" data-category="frameworks">
              <div class="skill-group-header">
                <span class="skill-group-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  ${t('skills.groups.frameworks_and_libraries', 'Frameworks & Libraries')}
                </span>
                <span class="tag">${skills.frameworks_and_libraries ? skills.frameworks_and_libraries.length : 0}</span>
              </div>
              <div class="skill-pills-wrap">
                ${(skills.frameworks_and_libraries || []).map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('')}
              </div>
            </div>

            <!-- Databases -->
            <div class="skill-group-card" data-category="tools">
              <div class="skill-group-header">
                <span class="skill-group-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                  ${t('skills.groups.databases', 'Databases')}
                </span>
                <span class="tag">${skills.databases ? skills.databases.length : 0}</span>
              </div>
              <div class="skill-pills-wrap">
                ${(skills.databases || []).map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('')}
              </div>
            </div>

            <!-- Data Analysis & Visualization -->
            <div class="skill-group-card" data-category="data">
              <div class="skill-group-header">
                <span class="skill-group-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  ${t('skills.groups.data_analysis_and_visualization', 'Data & Statistical Analysis')}
                </span>
                <span class="tag">${skills.data_analysis_and_visualization ? skills.data_analysis_and_visualization.length : 0}</span>
              </div>
              <div class="skill-pills-wrap">
                ${(skills.data_analysis_and_visualization || []).map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('')}
              </div>
            </div>

            <!-- Tools & Technologies -->
            <div class="skill-group-card" data-category="tools">
              <div class="skill-group-header">
                <span class="skill-group-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  ${t('skills.groups.tools_and_technologies', 'Tools & DevOps')}
                </span>
                <span class="tag">${skills.tools_and_technologies ? skills.tools_and_technologies.length : 0}</span>
              </div>
              <div class="skill-pills-wrap">
                ${(skills.tools_and_technologies || []).map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('')}
              </div>
            </div>

            <!-- Business & Professional Skills -->
            <div class="skill-group-card" data-category="languages">
              <div class="skill-group-header">
                <span class="skill-group-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  ${t('skills.groups.business_and_professional_skills', 'Business & Professional')}
                </span>
                <span class="tag">${skills.business_and_professional_skills ? skills.business_and_professional_skills.length : 0}</span>
              </div>
              <div class="skill-pills-wrap">
                ${(skills.business_and_professional_skills || []).map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('')}
              </div>
            </div>

            <!-- Spoken Languages -->
            <div class="skill-group-card" data-category="spoken">
              <div class="skill-group-header">
                <span class="skill-group-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  ${t('skills.groups.spoken_languages', 'Spoken Languages')}
                </span>
                <span class="tag">${skills.languages ? skills.languages.length : 0}</span>
              </div>
              <div class="skill-pills-wrap" style="flex-direction: column; width: 100%;">
                ${(skills.languages || []).map(l => `
                  <div class="language-item">
                    <span class="lang-name">${escapeHtml(l.name)}</span>
                    <span class="tag">${escapeHtml(l.proficiency)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. PROJECTS SECTION -->
      <section class="section-block alt-bg" id="projects">
        <div class="container">
          <div class="section-header">
            <span class="section-label">${t('projects.label', '03 // Featured Work')}</span>
            <h2 class="section-title">${t('projects.title', 'Projects & Implementations')}</h2>
            <p class="section-desc">${t('projects.desc', 'A showcase of backend API services, multivariate statistical research, and enterprise analytics projects.')}</p>
          </div>

          <div class="projects-grid">
            ${(projects || []).map((proj, idx) => `
              <article class="project-card">
                <div class="project-header">
                  <span class="project-number">${t('projects.project_prefix', 'PROJECT // 0')}${idx + 1}</span>
                  <h3 class="project-title">${escapeHtml(proj.title)}</h3>
                  <p class="project-description">${Array.isArray(proj.description) ? proj.description.map(d => escapeHtml(d)).join(' ') : escapeHtml(proj.description)}</p>
                </div>

                <div>
                  <div class="project-tech-list">
                    ${(proj.technologies || []).map(tName => `<span class="tag">${escapeHtml(tName)}</span>`).join('')}
                  </div>

                  <div class="project-footer">
                    <span class="badge">
                      <span class="badge-dot"></span>
                      ${t('projects.status_completed', 'Completed')}
                    </span>
                    ${proj.url ? `<a href="${escapeHtml(proj.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary">${t('projects.view_project', 'View Project ↗')}</a>` : ''}
                  </div>
                </div>
              </article>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- 5. EXPERIENCE TIMELINE -->
      <section class="section-block" id="experience">
        <div class="container">
          <div class="section-header">
            <span class="section-label">${t('experience.label', '04 // Career Path')}</span>
            <h2 class="section-title">${t('experience.title', 'Professional Experience')}</h2>
            <p class="section-desc">${t('experience.desc', 'Practical software engineering internships, operational systems development, and team contributions.')}</p>
          </div>

          <div class="timeline">
            ${(experiences || []).map(exp => `
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-card">
                  <div class="timeline-top">
                    <h3 class="timeline-role">${escapeHtml(exp.position)}</h3>
                    <span class="timeline-dates">${escapeHtml(exp.start_date)} — ${escapeHtml(exp.end_date)}</span>
                  </div>

                  <div class="timeline-company-row">
                    <span class="timeline-company">${escapeHtml(exp.company)}</span>
                    <span class="tag">${escapeHtml(exp.employment_type)}</span>
                    <span class="tag">${escapeHtml(exp.work_mode)}</span>
                  </div>

                  <ul class="timeline-tasks">
                    ${(exp.description || []).map(task => `<li class="timeline-task">${escapeHtml(task)}</li>`).join('')}
                  </ul>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- 6. EDUCATION & VOLUNTEERING -->
      <section class="section-block alt-bg" id="education">
        <div class="container">
          <div class="section-header">
            <span class="section-label">${t('education.label', '05 // Academic & Community')}</span>
            <h2 class="section-title">${t('education.title', 'Education & Volunteering')}</h2>
          </div>

          <div class="edu-vol-grid">
            <!-- Education Card -->
            ${(education || []).map(edu => `
              <div class="info-card">
                <div>
                  <div class="info-card-header">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                      <img src="/static/images/tbs_logo.png" alt="Tunis Business School Logo" class="edu-card-logo">
                      <div>
                        <h3 class="info-card-title">${escapeHtml(edu.institution)}</h3>
                        <h4 class="info-card-sub">${escapeHtml(edu.degree)}</h4>
                      </div>
                    </div>
                    <span class="badge">${escapeHtml(edu.status || t('education.status_in_progress', 'In Progress'))}</span>
                  </div>

                  <div class="info-card-details" style="margin-top: 1.25rem;">
                    <p><strong>${t('education.major_label', 'Major:')}</strong> ${escapeHtml(edu.major)}</p>
                    ${edu.minor ? `<p><strong>${t('education.minor_label', 'Minor:')}</strong> ${escapeHtml(edu.minor)}</p>` : ''}
                    <p><strong>${t('education.period_label', 'Period:')}</strong> ${escapeHtml(edu.start_date)} — ${escapeHtml(edu.end_date)}</p>
                  </div>
                </div>

                <div style="border-top: 1px solid var(--border-subtle); padding-top: 1rem; display: flex; align-items: center; justify-content: space-between;">
                  <span class="tag">${t('education.institution_tag', 'Tunis Business School')}</span>
                </div>
              </div>
            `).join('')}

            <!-- Volunteering Card -->
            ${volunteer ? `
              <div class="info-card">
                <div>
                  <div class="info-card-header">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                      <img src="/static/images/gdg.png" alt="Google Developer Groups Logo" class="edu-card-logo">
                      <div>
                        <h3 class="info-card-title">${escapeHtml(volunteer.club)}</h3>
                        <h4 class="info-card-sub">${t('education.volunteer_role', 'Active Community Member')}</h4>
                      </div>
                    </div>
                    <span class="badge">${t('education.volunteer_badge', 'Community')}</span>
                  </div>

                  <div class="info-card-details" style="margin-top: 1.25rem;">
                    <p style="margin-bottom: 0.75rem;">${escapeHtml(volunteer.description)}</p>
                    <ul class="timeline-tasks">
                      ${(volunteer.tasks || []).map(taskText => `<li class="timeline-task">${escapeHtml(taskText)}</li>`).join('')}
                    </ul>
                  </div>
                </div>

                <div style="border-top: 1px solid var(--border-subtle); padding-top: 1rem; display: flex; align-items: center; justify-content: space-between;">
                  <span class="tag">${t('education.volunteer_club_tag', 'GDG Bizerte')}</span>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- 7. CONTACT SECTION -->
      <section class="section-block" id="contact">
        <div class="container">
          <div class="section-header">
            <span class="section-label">${t('contact.label', '06 // Get In Touch')}</span>
            <h2 class="section-title">${t('contact.title', 'Let’s Connect')}</h2>
            <p class="section-desc">${t('contact.desc', 'Actively seeking a graduation internship (PFE) starting 2027 in Backend Engineering, AI, or Data Engineering.')}</p>
          </div>

          <div class="contact-grid">
            ${contact.email ? `
              <a href="mailto:${escapeHtml(contact.email)}" class="contact-item-card">
                <div class="contact-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div class="contact-info-wrap">
                  <span class="contact-label">${t('contact.email', 'Email')}</span>
                  <p class="contact-value">${escapeHtml(contact.email)}</p>
                </div>
              </a>
            ` : ''}

            ${contact.university_email ? `
              <a href="mailto:${escapeHtml(contact.university_email)}" class="contact-item-card">
                <div class="contact-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
                <div class="contact-info-wrap">
                  <span class="contact-label">${t('contact.university_email', 'University Email')}</span>
                  <p class="contact-value">${escapeHtml(contact.university_email)}</p>
                </div>
              </a>
            ` : ''}

            ${contact.phone ? `
              <a href="tel:${escapeHtml(contact.phone)}" class="contact-item-card">
                <div class="contact-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div class="contact-info-wrap">
                  <span class="contact-label">${t('contact.phone', 'Phone')}</span>
                  <p class="contact-value">${escapeHtml(contact.phone)}</p>
                </div>
              </a>
            ` : ''}

            ${contact.linkedin ? `
              <a href="${escapeHtml(contact.linkedin)}" target="_blank" rel="noopener noreferrer" class="contact-item-card">
                <div class="contact-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </div>
                <div class="contact-info-wrap">
                  <span class="contact-label">${t('contact.linkedin', 'LinkedIn')}</span>
                  <p class="contact-value">zmitri-oussama ↗</p>
                </div>
              </a>
            ` : ''}

            ${contact.github ? `
              <a href="${escapeHtml(contact.github)}" target="_blank" rel="noopener noreferrer" class="contact-item-card">
                <div class="contact-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                </div>
                <div class="contact-info-wrap">
                  <span class="contact-label">${t('contact.github', 'GitHub')}</span>
                  <p class="contact-value">oussamazmitri ↗</p>
                </div>
              </a>
            ` : ''}
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderNormalSideQuests() {
  return `
    <div class="container editorial-page">
      <div class="section-header">
        <span class="section-label">${t('side_quests.label', 'Field Notes & Explorations')}</span>
        <h1 class="section-title">${t('side_quests.title', 'Side Quests')}</h1>
        <p class="section-desc">${t('side_quests.desc', 'A personal, exploratory laboratory for everyday observations, hardware tests, learning experiments, and side pursuits outside my core portfolio.')}</p>
      </div>

      <div class="empty-state-editorial">
        <div class="empty-state-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <h2 class="empty-state-title">${t('side_quests.empty_title', 'The Quest Log is Currently Quiet')}</h2>
        <p class="empty-state-text">
          ${t('side_quests.empty_text', 'I am currently focused on academic projects at TBS and seeking my 2027 PFE graduation internship. New personal experiments, mini-tools, and technical field notes will be chronicled here soon.')}
        </p>
        <div class="empty-state-meta">
          <span>${t('side_quests.status', '● Status: In Incubation')}</span>
          <span>${t('side_quests.log_count', '● Log Count: 0 Entries')}</span>
        </div>
        <a href="/" data-link class="btn btn-secondary" style="margin-top: 1rem;">
          ${t('side_quests.return_home', '← Return to Main Portfolio')}
        </a>
      </div>
    </div>
  `;
}

function renderNormalWriting() {
  return `
    <div class="container editorial-page">
      <div class="section-header">
        <span class="section-label">${t('writing.label', 'Essays & Perspectives')}</span>
        <h1 class="section-title">${t('writing.title', 'Writing')}</h1>
        <p class="section-desc">${t('writing.desc', 'Technical explanations, engineering breakdowns, statistical case notes, and reflections on building software and AI systems.')}</p>
      </div>

      <div class="empty-state-editorial">
        <div class="empty-state-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
        </div>
        <h2 class="empty-state-title">${t('writing.empty_title', 'Drafts in Incubation')}</h2>
        <p class="empty-state-text">
          ${t('writing.empty_text', 'Upcoming essays covering multivariate analysis for market forecasting, REST API architectures with Flask, and practical data engineering lessons are currently in preparation.')}
        </p>
        <div class="empty-state-meta">
          <span>${t('writing.status', '● Status: Drafting Articles')}</span>
          <span>${t('writing.published_count', '● Published: 0 Items')}</span>
        </div>
        <a href="/" data-link class="btn btn-secondary" style="margin-top: 1rem;">
          ${t('writing.return_home', '← Return to Main Portfolio')}
        </a>
      </div>
    </div>
  `;
}

function setupNormalInteractions(container) {
  // Skill category filtering
  const filterBtns = container.querySelectorAll('.skills-filter-btn');
  const cards = container.querySelectorAll('.skill-group-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // CV Dropdown trigger
  const cvBtn = container.querySelector('#hero-cv-dropdown');
  if (cvBtn) {
    const menu = cvBtn.nextElementSibling;
    cvBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = menu.classList.toggle('show');
      cvBtn.setAttribute('aria-expanded', String(isExpanded));
    });

    document.addEventListener('click', (e) => {
      if (!cvBtn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('show');
        cvBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Section Quick-Nav Pill Smooth Scroll & Active Handling
  const sectionPills = container.querySelectorAll('.section-nav-pill');
  sectionPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = pill.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const navHeight = document.querySelector('.site-nav')?.offsetHeight || 70;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
        sectionPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      }
    });
  });

  // ScrollSpy for Normal Mode Sections
  const normalSections = container.querySelectorAll('section[id]');
  if (normalSections.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          sectionPills.forEach(p => {
            p.classList.toggle('active', p.dataset.section === id);
          });
          document.querySelectorAll('.nav-section-link[data-normal-section]').forEach(link => {
            link.classList.toggle('active', link.dataset.normalSection === id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    normalSections.forEach(s => observer.observe(s));
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
