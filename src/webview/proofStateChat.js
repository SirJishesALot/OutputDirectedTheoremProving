"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all2) => {
    for (var name in all2)
      __defProp(target, name, { get: all2[name], enumerable: true });
  };

  // node_modules/marked/lib/marked.esm.js
  function L() {
    return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
  }
  var T = L();
  function Z(u4) {
    T = u4;
  }
  var C = { exec: () => null };
  function k(u4, e = "") {
    let t = typeof u4 == "string" ? u4 : u4.source, n = { replace: (r4, i2) => {
      let s2 = typeof i2 == "string" ? i2 : i2.source;
      return s2 = s2.replace(m.caret, "$1"), t = t.replace(r4, s2), n;
    }, getRegex: () => new RegExp(t, e) };
    return n;
  }
  var me = (() => {
    try {
      return !!new RegExp("(?<=1)(?<!1)");
    } catch {
      return false;
    }
  })();
  var m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (u4) => new RegExp(`^( {0,3}${u4})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (u4) => new RegExp(`^ {0,${Math.min(3, u4 - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (u4) => new RegExp(`^ {0,${Math.min(3, u4 - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (u4) => new RegExp(`^ {0,${Math.min(3, u4 - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (u4) => new RegExp(`^ {0,${Math.min(3, u4 - 1)}}#`), htmlBeginRegex: (u4) => new RegExp(`^ {0,${Math.min(3, u4 - 1)}}<(?:[a-z].*>|!--)`, "i") };
  var xe = /^(?:[ \t]*(?:\n|$))+/;
  var be = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
  var Re = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
  var I = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
  var Te = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
  var N = /(?:[*+-]|\d{1,9}[.)])/;
  var re = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
  var se = k(re).replace(/bull/g, N).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
  var Oe = k(re).replace(/bull/g, N).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
  var Q = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
  var we = /^[^\n]+/;
  var F = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
  var ye = k(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", F).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
  var Pe = k(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, N).getRegex();
  var v = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
  var j = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
  var Se = k("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", j).replace("tag", v).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  var ie = k(Q).replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
  var $e = k(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ie).getRegex();
  var U = { blockquote: $e, code: be, def: ye, fences: Re, heading: Te, hr: I, html: Se, lheading: se, list: Pe, newline: xe, paragraph: ie, table: C, text: we };
  var te = k("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
  var _e = { ...U, lheading: Oe, table: te, paragraph: k(Q).replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", te).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex() };
  var Le = { ...U, html: k(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", j).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: C, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: k(Q).replace("hr", I).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", se).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
  var Me = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
  var ze = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
  var oe = /^( {2,}|\\)\n(?!\s*$)/;
  var Ae = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
  var D = /[\p{P}\p{S}]/u;
  var K = /[\s\p{P}\p{S}]/u;
  var ae = /[^\s\p{P}\p{S}]/u;
  var Ce = k(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, K).getRegex();
  var le = /(?!~)[\p{P}\p{S}]/u;
  var Ie = /(?!~)[\s\p{P}\p{S}]/u;
  var Ee = /(?:[^\s\p{P}\p{S}]|~)/u;
  var Be = k(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", me ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
  var ue = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
  var qe = k(ue, "u").replace(/punct/g, D).getRegex();
  var ve = k(ue, "u").replace(/punct/g, le).getRegex();
  var pe = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
  var De = k(pe, "gu").replace(/notPunctSpace/g, ae).replace(/punctSpace/g, K).replace(/punct/g, D).getRegex();
  var He = k(pe, "gu").replace(/notPunctSpace/g, Ee).replace(/punctSpace/g, Ie).replace(/punct/g, le).getRegex();
  var Ze = k("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ae).replace(/punctSpace/g, K).replace(/punct/g, D).getRegex();
  var Ge = k(/\\(punct)/, "gu").replace(/punct/g, D).getRegex();
  var Ne = k(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
  var Qe = k(j).replace("(?:-->|$)", "-->").getRegex();
  var Fe = k("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Qe).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
  var q = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/;
  var je = k(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", q).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
  var ce = k(/^!?\[(label)\]\[(ref)\]/).replace("label", q).replace("ref", F).getRegex();
  var he = k(/^!?\[(ref)\](?:\[\])?/).replace("ref", F).getRegex();
  var Ue = k("reflink|nolink(?!\\()", "g").replace("reflink", ce).replace("nolink", he).getRegex();
  var ne = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
  var W = { _backpedal: C, anyPunctuation: Ge, autolink: Ne, blockSkip: Be, br: oe, code: ze, del: C, emStrongLDelim: qe, emStrongRDelimAst: De, emStrongRDelimUnd: Ze, escape: Me, link: je, nolink: he, punctuation: Ce, reflink: ce, reflinkSearch: Ue, tag: Fe, text: Ae, url: C };
  var Ke = { ...W, link: k(/^!?\[(label)\]\((.*?)\)/).replace("label", q).getRegex(), reflink: k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q).getRegex() };
  var G = { ...W, emStrongRDelimAst: He, emStrongLDelim: ve, url: k(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ne).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: k(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ne).getRegex() };
  var We = { ...G, br: k(oe).replace("{2,}", "*").getRegex(), text: k(G.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
  var E = { normal: U, gfm: _e, pedantic: Le };
  var M = { normal: W, gfm: G, breaks: We, pedantic: Ke };
  var Xe = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  var ke = (u4) => Xe[u4];
  function w(u4, e) {
    if (e) {
      if (m.escapeTest.test(u4)) return u4.replace(m.escapeReplace, ke);
    } else if (m.escapeTestNoEncode.test(u4)) return u4.replace(m.escapeReplaceNoEncode, ke);
    return u4;
  }
  function X(u4) {
    try {
      u4 = encodeURI(u4).replace(m.percentDecode, "%");
    } catch {
      return null;
    }
    return u4;
  }
  function J(u4, e) {
    let t = u4.replace(m.findPipe, (i2, s2, a2) => {
      let o3 = false, l3 = s2;
      for (; --l3 >= 0 && a2[l3] === "\\"; ) o3 = !o3;
      return o3 ? "|" : " |";
    }), n = t.split(m.splitPipe), r4 = 0;
    if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
    else for (; n.length < e; ) n.push("");
    for (; r4 < n.length; r4++) n[r4] = n[r4].trim().replace(m.slashPipe, "|");
    return n;
  }
  function z(u4, e, t) {
    let n = u4.length;
    if (n === 0) return "";
    let r4 = 0;
    for (; r4 < n; ) {
      let i2 = u4.charAt(n - r4 - 1);
      if (i2 === e && !t) r4++;
      else if (i2 !== e && t) r4++;
      else break;
    }
    return u4.slice(0, n - r4);
  }
  function de(u4, e) {
    if (u4.indexOf(e[1]) === -1) return -1;
    let t = 0;
    for (let n = 0; n < u4.length; n++) if (u4[n] === "\\") n++;
    else if (u4[n] === e[0]) t++;
    else if (u4[n] === e[1] && (t--, t < 0)) return n;
    return t > 0 ? -2 : -1;
  }
  function ge(u4, e, t, n, r4) {
    let i2 = e.href, s2 = e.title || null, a2 = u4[1].replace(r4.other.outputLinkReplace, "$1");
    n.state.inLink = true;
    let o3 = { type: u4[0].charAt(0) === "!" ? "image" : "link", raw: t, href: i2, title: s2, text: a2, tokens: n.inlineTokens(a2) };
    return n.state.inLink = false, o3;
  }
  function Je(u4, e, t) {
    let n = u4.match(t.other.indentCodeCompensation);
    if (n === null) return e;
    let r4 = n[1];
    return e.split(`
`).map((i2) => {
      let s2 = i2.match(t.other.beginningSpace);
      if (s2 === null) return i2;
      let [a2] = s2;
      return a2.length >= r4.length ? i2.slice(r4.length) : i2;
    }).join(`
`);
  }
  var y = class {
    options;
    rules;
    lexer;
    constructor(e) {
      this.options = e || T;
    }
    space(e) {
      let t = this.rules.block.newline.exec(e);
      if (t && t[0].length > 0) return { type: "space", raw: t[0] };
    }
    code(e) {
      let t = this.rules.block.code.exec(e);
      if (t) {
        let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
        return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : z(n, `
`) };
      }
    }
    fences(e) {
      let t = this.rules.block.fences.exec(e);
      if (t) {
        let n = t[0], r4 = Je(n, t[3] || "", this.rules);
        return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: r4 };
      }
    }
    heading(e) {
      let t = this.rules.block.heading.exec(e);
      if (t) {
        let n = t[2].trim();
        if (this.rules.other.endingHash.test(n)) {
          let r4 = z(n, "#");
          (this.options.pedantic || !r4 || this.rules.other.endingSpaceChar.test(r4)) && (n = r4.trim());
        }
        return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
      }
    }
    hr(e) {
      let t = this.rules.block.hr.exec(e);
      if (t) return { type: "hr", raw: z(t[0], `
`) };
    }
    blockquote(e) {
      let t = this.rules.block.blockquote.exec(e);
      if (t) {
        let n = z(t[0], `
`).split(`
`), r4 = "", i2 = "", s2 = [];
        for (; n.length > 0; ) {
          let a2 = false, o3 = [], l3;
          for (l3 = 0; l3 < n.length; l3++) if (this.rules.other.blockquoteStart.test(n[l3])) o3.push(n[l3]), a2 = true;
          else if (!a2) o3.push(n[l3]);
          else break;
          n = n.slice(l3);
          let p2 = o3.join(`
`), c = p2.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
          r4 = r4 ? `${r4}
${p2}` : p2, i2 = i2 ? `${i2}
${c}` : c;
          let g = this.lexer.state.top;
          if (this.lexer.state.top = true, this.lexer.blockTokens(c, s2, true), this.lexer.state.top = g, n.length === 0) break;
          let h2 = s2.at(-1);
          if (h2?.type === "code") break;
          if (h2?.type === "blockquote") {
            let R3 = h2, f2 = R3.raw + `
` + n.join(`
`), O3 = this.blockquote(f2);
            s2[s2.length - 1] = O3, r4 = r4.substring(0, r4.length - R3.raw.length) + O3.raw, i2 = i2.substring(0, i2.length - R3.text.length) + O3.text;
            break;
          } else if (h2?.type === "list") {
            let R3 = h2, f2 = R3.raw + `
` + n.join(`
`), O3 = this.list(f2);
            s2[s2.length - 1] = O3, r4 = r4.substring(0, r4.length - h2.raw.length) + O3.raw, i2 = i2.substring(0, i2.length - R3.raw.length) + O3.raw, n = f2.substring(s2.at(-1).raw.length).split(`
`);
            continue;
          }
        }
        return { type: "blockquote", raw: r4, tokens: s2, text: i2 };
      }
    }
    list(e) {
      let t = this.rules.block.list.exec(e);
      if (t) {
        let n = t[1].trim(), r4 = n.length > 1, i2 = { type: "list", raw: "", ordered: r4, start: r4 ? +n.slice(0, -1) : "", loose: false, items: [] };
        n = r4 ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r4 ? n : "[*+-]");
        let s2 = this.rules.other.listItemRegex(n), a2 = false;
        for (; e; ) {
          let l3 = false, p2 = "", c = "";
          if (!(t = s2.exec(e)) || this.rules.block.hr.test(e)) break;
          p2 = t[0], e = e.substring(p2.length);
          let g = t[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (O3) => " ".repeat(3 * O3.length)), h2 = e.split(`
`, 1)[0], R3 = !g.trim(), f2 = 0;
          if (this.options.pedantic ? (f2 = 2, c = g.trimStart()) : R3 ? f2 = t[1].length + 1 : (f2 = t[2].search(this.rules.other.nonSpaceChar), f2 = f2 > 4 ? 1 : f2, c = g.slice(f2), f2 += t[1].length), R3 && this.rules.other.blankLine.test(h2) && (p2 += h2 + `
`, e = e.substring(h2.length + 1), l3 = true), !l3) {
            let O3 = this.rules.other.nextBulletRegex(f2), V3 = this.rules.other.hrRegex(f2), Y2 = this.rules.other.fencesBeginRegex(f2), ee3 = this.rules.other.headingBeginRegex(f2), fe = this.rules.other.htmlBeginRegex(f2);
            for (; e; ) {
              let H2 = e.split(`
`, 1)[0], A3;
              if (h2 = H2, this.options.pedantic ? (h2 = h2.replace(this.rules.other.listReplaceNesting, "  "), A3 = h2) : A3 = h2.replace(this.rules.other.tabCharGlobal, "    "), Y2.test(h2) || ee3.test(h2) || fe.test(h2) || O3.test(h2) || V3.test(h2)) break;
              if (A3.search(this.rules.other.nonSpaceChar) >= f2 || !h2.trim()) c += `
` + A3.slice(f2);
              else {
                if (R3 || g.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || Y2.test(g) || ee3.test(g) || V3.test(g)) break;
                c += `
` + h2;
              }
              !R3 && !h2.trim() && (R3 = true), p2 += H2 + `
`, e = e.substring(H2.length + 1), g = A3.slice(f2);
            }
          }
          i2.loose || (a2 ? i2.loose = true : this.rules.other.doubleBlankLine.test(p2) && (a2 = true)), i2.items.push({ type: "list_item", raw: p2, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: false, text: c, tokens: [] }), i2.raw += p2;
        }
        let o3 = i2.items.at(-1);
        if (o3) o3.raw = o3.raw.trimEnd(), o3.text = o3.text.trimEnd();
        else return;
        i2.raw = i2.raw.trimEnd();
        for (let l3 of i2.items) {
          if (this.lexer.state.top = false, l3.tokens = this.lexer.blockTokens(l3.text, []), l3.task) {
            if (l3.text = l3.text.replace(this.rules.other.listReplaceTask, ""), l3.tokens[0]?.type === "text" || l3.tokens[0]?.type === "paragraph") {
              l3.tokens[0].raw = l3.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), l3.tokens[0].text = l3.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
              for (let c = this.lexer.inlineQueue.length - 1; c >= 0; c--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)) {
                this.lexer.inlineQueue[c].src = this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask, "");
                break;
              }
            }
            let p2 = this.rules.other.listTaskCheckbox.exec(l3.raw);
            if (p2) {
              let c = { type: "checkbox", raw: p2[0] + " ", checked: p2[0] !== "[ ]" };
              l3.checked = c.checked, i2.loose ? l3.tokens[0] && ["paragraph", "text"].includes(l3.tokens[0].type) && "tokens" in l3.tokens[0] && l3.tokens[0].tokens ? (l3.tokens[0].raw = c.raw + l3.tokens[0].raw, l3.tokens[0].text = c.raw + l3.tokens[0].text, l3.tokens[0].tokens.unshift(c)) : l3.tokens.unshift({ type: "paragraph", raw: c.raw, text: c.raw, tokens: [c] }) : l3.tokens.unshift(c);
            }
          }
          if (!i2.loose) {
            let p2 = l3.tokens.filter((g) => g.type === "space"), c = p2.length > 0 && p2.some((g) => this.rules.other.anyLine.test(g.raw));
            i2.loose = c;
          }
        }
        if (i2.loose) for (let l3 of i2.items) {
          l3.loose = true;
          for (let p2 of l3.tokens) p2.type === "text" && (p2.type = "paragraph");
        }
        return i2;
      }
    }
    html(e) {
      let t = this.rules.block.html.exec(e);
      if (t) return { type: "html", block: true, raw: t[0], pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: t[0] };
    }
    def(e) {
      let t = this.rules.block.def.exec(e);
      if (t) {
        let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r4 = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i2 = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
        return { type: "def", tag: n, raw: t[0], href: r4, title: i2 };
      }
    }
    table(e) {
      let t = this.rules.block.table.exec(e);
      if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
      let n = J(t[1]), r4 = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i2 = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s2 = { type: "table", raw: t[0], header: [], align: [], rows: [] };
      if (n.length === r4.length) {
        for (let a2 of r4) this.rules.other.tableAlignRight.test(a2) ? s2.align.push("right") : this.rules.other.tableAlignCenter.test(a2) ? s2.align.push("center") : this.rules.other.tableAlignLeft.test(a2) ? s2.align.push("left") : s2.align.push(null);
        for (let a2 = 0; a2 < n.length; a2++) s2.header.push({ text: n[a2], tokens: this.lexer.inline(n[a2]), header: true, align: s2.align[a2] });
        for (let a2 of i2) s2.rows.push(J(a2, s2.header.length).map((o3, l3) => ({ text: o3, tokens: this.lexer.inline(o3), header: false, align: s2.align[l3] })));
        return s2;
      }
    }
    lheading(e) {
      let t = this.rules.block.lheading.exec(e);
      if (t) return { type: "heading", raw: t[0], depth: t[2].charAt(0) === "=" ? 1 : 2, text: t[1], tokens: this.lexer.inline(t[1]) };
    }
    paragraph(e) {
      let t = this.rules.block.paragraph.exec(e);
      if (t) {
        let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
        return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
      }
    }
    text(e) {
      let t = this.rules.block.text.exec(e);
      if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
    }
    escape(e) {
      let t = this.rules.inline.escape.exec(e);
      if (t) return { type: "escape", raw: t[0], text: t[1] };
    }
    tag(e) {
      let t = this.rules.inline.tag.exec(e);
      if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
    }
    link(e) {
      let t = this.rules.inline.link.exec(e);
      if (t) {
        let n = t[2].trim();
        if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
          if (!this.rules.other.endAngleBracket.test(n)) return;
          let s2 = z(n.slice(0, -1), "\\");
          if ((n.length - s2.length) % 2 === 0) return;
        } else {
          let s2 = de(t[2], "()");
          if (s2 === -2) return;
          if (s2 > -1) {
            let o3 = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + s2;
            t[2] = t[2].substring(0, s2), t[0] = t[0].substring(0, o3).trim(), t[3] = "";
          }
        }
        let r4 = t[2], i2 = "";
        if (this.options.pedantic) {
          let s2 = this.rules.other.pedanticHrefTitle.exec(r4);
          s2 && (r4 = s2[1], i2 = s2[3]);
        } else i2 = t[3] ? t[3].slice(1, -1) : "";
        return r4 = r4.trim(), this.rules.other.startAngleBracket.test(r4) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r4 = r4.slice(1) : r4 = r4.slice(1, -1)), ge(t, { href: r4 && r4.replace(this.rules.inline.anyPunctuation, "$1"), title: i2 && i2.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
      }
    }
    reflink(e, t) {
      let n;
      if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
        let r4 = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i2 = t[r4.toLowerCase()];
        if (!i2) {
          let s2 = n[0].charAt(0);
          return { type: "text", raw: s2, text: s2 };
        }
        return ge(n, i2, n[0], this.lexer, this.rules);
      }
    }
    emStrong(e, t, n = "") {
      let r4 = this.rules.inline.emStrongLDelim.exec(e);
      if (!r4 || r4[3] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
      if (!(r4[1] || r4[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
        let s2 = [...r4[0]].length - 1, a2, o3, l3 = s2, p2 = 0, c = r4[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
        for (c.lastIndex = 0, t = t.slice(-1 * e.length + s2); (r4 = c.exec(t)) != null; ) {
          if (a2 = r4[1] || r4[2] || r4[3] || r4[4] || r4[5] || r4[6], !a2) continue;
          if (o3 = [...a2].length, r4[3] || r4[4]) {
            l3 += o3;
            continue;
          } else if ((r4[5] || r4[6]) && s2 % 3 && !((s2 + o3) % 3)) {
            p2 += o3;
            continue;
          }
          if (l3 -= o3, l3 > 0) continue;
          o3 = Math.min(o3, o3 + l3 + p2);
          let g = [...r4[0]][0].length, h2 = e.slice(0, s2 + r4.index + g + o3);
          if (Math.min(s2, o3) % 2) {
            let f2 = h2.slice(1, -1);
            return { type: "em", raw: h2, text: f2, tokens: this.lexer.inlineTokens(f2) };
          }
          let R3 = h2.slice(2, -2);
          return { type: "strong", raw: h2, text: R3, tokens: this.lexer.inlineTokens(R3) };
        }
      }
    }
    codespan(e) {
      let t = this.rules.inline.code.exec(e);
      if (t) {
        let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), r4 = this.rules.other.nonSpaceChar.test(n), i2 = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
        return r4 && i2 && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
      }
    }
    br(e) {
      let t = this.rules.inline.br.exec(e);
      if (t) return { type: "br", raw: t[0] };
    }
    del(e) {
      let t = this.rules.inline.del.exec(e);
      if (t) return { type: "del", raw: t[0], text: t[2], tokens: this.lexer.inlineTokens(t[2]) };
    }
    autolink(e) {
      let t = this.rules.inline.autolink.exec(e);
      if (t) {
        let n, r4;
        return t[2] === "@" ? (n = t[1], r4 = "mailto:" + n) : (n = t[1], r4 = n), { type: "link", raw: t[0], text: n, href: r4, tokens: [{ type: "text", raw: n, text: n }] };
      }
    }
    url(e) {
      let t;
      if (t = this.rules.inline.url.exec(e)) {
        let n, r4;
        if (t[2] === "@") n = t[0], r4 = "mailto:" + n;
        else {
          let i2;
          do
            i2 = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
          while (i2 !== t[0]);
          n = t[0], t[1] === "www." ? r4 = "http://" + t[0] : r4 = t[0];
        }
        return { type: "link", raw: t[0], text: n, href: r4, tokens: [{ type: "text", raw: n, text: n }] };
      }
    }
    inlineText(e) {
      let t = this.rules.inline.text.exec(e);
      if (t) {
        let n = this.lexer.state.inRawBlock;
        return { type: "text", raw: t[0], text: t[0], escaped: n };
      }
    }
  };
  var x = class u {
    tokens;
    options;
    state;
    inlineQueue;
    tokenizer;
    constructor(e) {
      this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || T, this.options.tokenizer = this.options.tokenizer || new y(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
      let t = { other: m, block: E.normal, inline: M.normal };
      this.options.pedantic ? (t.block = E.pedantic, t.inline = M.pedantic) : this.options.gfm && (t.block = E.gfm, this.options.breaks ? t.inline = M.breaks : t.inline = M.gfm), this.tokenizer.rules = t;
    }
    static get rules() {
      return { block: E, inline: M };
    }
    static lex(e, t) {
      return new u(t).lex(e);
    }
    static lexInline(e, t) {
      return new u(t).inlineTokens(e);
    }
    lex(e) {
      e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
      for (let t = 0; t < this.inlineQueue.length; t++) {
        let n = this.inlineQueue[t];
        this.inlineTokens(n.src, n.tokens);
      }
      return this.inlineQueue = [], this.tokens;
    }
    blockTokens(e, t = [], n = false) {
      for (this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, "")); e; ) {
        let r4;
        if (this.options.extensions?.block?.some((s2) => (r4 = s2.call({ lexer: this }, e, t)) ? (e = e.substring(r4.raw.length), t.push(r4), true) : false)) continue;
        if (r4 = this.tokenizer.space(e)) {
          e = e.substring(r4.raw.length);
          let s2 = t.at(-1);
          r4.raw.length === 1 && s2 !== void 0 ? s2.raw += `
` : t.push(r4);
          continue;
        }
        if (r4 = this.tokenizer.code(e)) {
          e = e.substring(r4.raw.length);
          let s2 = t.at(-1);
          s2?.type === "paragraph" || s2?.type === "text" ? (s2.raw += (s2.raw.endsWith(`
`) ? "" : `
`) + r4.raw, s2.text += `
` + r4.text, this.inlineQueue.at(-1).src = s2.text) : t.push(r4);
          continue;
        }
        if (r4 = this.tokenizer.fences(e)) {
          e = e.substring(r4.raw.length), t.push(r4);
          continue;
        }
        if (r4 = this.tokenizer.heading(e)) {
          e = e.substring(r4.raw.length), t.push(r4);
          continue;
        }
        if (r4 = this.tokenizer.hr(e)) {
          e = e.substring(r4.raw.length), t.push(r4);
          continue;
        }
        if (r4 = this.tokenizer.blockquote(e)) {
          e = e.substring(r4.raw.length), t.push(r4);
          continue;
        }
        if (r4 = this.tokenizer.list(e)) {
          e = e.substring(r4.raw.length), t.push(r4);
          continue;
        }
        if (r4 = this.tokenizer.html(e)) {
          e = e.substring(r4.raw.length), t.push(r4);
          continue;
        }
        if (r4 = this.tokenizer.def(e)) {
          e = e.substring(r4.raw.length);
          let s2 = t.at(-1);
          s2?.type === "paragraph" || s2?.type === "text" ? (s2.raw += (s2.raw.endsWith(`
`) ? "" : `
`) + r4.raw, s2.text += `
` + r4.raw, this.inlineQueue.at(-1).src = s2.text) : this.tokens.links[r4.tag] || (this.tokens.links[r4.tag] = { href: r4.href, title: r4.title }, t.push(r4));
          continue;
        }
        if (r4 = this.tokenizer.table(e)) {
          e = e.substring(r4.raw.length), t.push(r4);
          continue;
        }
        if (r4 = this.tokenizer.lheading(e)) {
          e = e.substring(r4.raw.length), t.push(r4);
          continue;
        }
        let i2 = e;
        if (this.options.extensions?.startBlock) {
          let s2 = 1 / 0, a2 = e.slice(1), o3;
          this.options.extensions.startBlock.forEach((l3) => {
            o3 = l3.call({ lexer: this }, a2), typeof o3 == "number" && o3 >= 0 && (s2 = Math.min(s2, o3));
          }), s2 < 1 / 0 && s2 >= 0 && (i2 = e.substring(0, s2 + 1));
        }
        if (this.state.top && (r4 = this.tokenizer.paragraph(i2))) {
          let s2 = t.at(-1);
          n && s2?.type === "paragraph" ? (s2.raw += (s2.raw.endsWith(`
`) ? "" : `
`) + r4.raw, s2.text += `
` + r4.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s2.text) : t.push(r4), n = i2.length !== e.length, e = e.substring(r4.raw.length);
          continue;
        }
        if (r4 = this.tokenizer.text(e)) {
          e = e.substring(r4.raw.length);
          let s2 = t.at(-1);
          s2?.type === "text" ? (s2.raw += (s2.raw.endsWith(`
`) ? "" : `
`) + r4.raw, s2.text += `
` + r4.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s2.text) : t.push(r4);
          continue;
        }
        if (e) {
          let s2 = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(s2);
            break;
          } else throw new Error(s2);
        }
      }
      return this.state.top = true, t;
    }
    inline(e, t = []) {
      return this.inlineQueue.push({ src: e, tokens: t }), t;
    }
    inlineTokens(e, t = []) {
      let n = e, r4 = null;
      if (this.tokens.links) {
        let o3 = Object.keys(this.tokens.links);
        if (o3.length > 0) for (; (r4 = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) o3.includes(r4[0].slice(r4[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r4.index) + "[" + "a".repeat(r4[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
      }
      for (; (r4 = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, r4.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
      let i2;
      for (; (r4 = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) i2 = r4[2] ? r4[2].length : 0, n = n.slice(0, r4.index + i2) + "[" + "a".repeat(r4[0].length - i2 - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
      let s2 = false, a2 = "";
      for (; e; ) {
        s2 || (a2 = ""), s2 = false;
        let o3;
        if (this.options.extensions?.inline?.some((p2) => (o3 = p2.call({ lexer: this }, e, t)) ? (e = e.substring(o3.raw.length), t.push(o3), true) : false)) continue;
        if (o3 = this.tokenizer.escape(e)) {
          e = e.substring(o3.raw.length), t.push(o3);
          continue;
        }
        if (o3 = this.tokenizer.tag(e)) {
          e = e.substring(o3.raw.length), t.push(o3);
          continue;
        }
        if (o3 = this.tokenizer.link(e)) {
          e = e.substring(o3.raw.length), t.push(o3);
          continue;
        }
        if (o3 = this.tokenizer.reflink(e, this.tokens.links)) {
          e = e.substring(o3.raw.length);
          let p2 = t.at(-1);
          o3.type === "text" && p2?.type === "text" ? (p2.raw += o3.raw, p2.text += o3.text) : t.push(o3);
          continue;
        }
        if (o3 = this.tokenizer.emStrong(e, n, a2)) {
          e = e.substring(o3.raw.length), t.push(o3);
          continue;
        }
        if (o3 = this.tokenizer.codespan(e)) {
          e = e.substring(o3.raw.length), t.push(o3);
          continue;
        }
        if (o3 = this.tokenizer.br(e)) {
          e = e.substring(o3.raw.length), t.push(o3);
          continue;
        }
        if (o3 = this.tokenizer.del(e)) {
          e = e.substring(o3.raw.length), t.push(o3);
          continue;
        }
        if (o3 = this.tokenizer.autolink(e)) {
          e = e.substring(o3.raw.length), t.push(o3);
          continue;
        }
        if (!this.state.inLink && (o3 = this.tokenizer.url(e))) {
          e = e.substring(o3.raw.length), t.push(o3);
          continue;
        }
        let l3 = e;
        if (this.options.extensions?.startInline) {
          let p2 = 1 / 0, c = e.slice(1), g;
          this.options.extensions.startInline.forEach((h2) => {
            g = h2.call({ lexer: this }, c), typeof g == "number" && g >= 0 && (p2 = Math.min(p2, g));
          }), p2 < 1 / 0 && p2 >= 0 && (l3 = e.substring(0, p2 + 1));
        }
        if (o3 = this.tokenizer.inlineText(l3)) {
          e = e.substring(o3.raw.length), o3.raw.slice(-1) !== "_" && (a2 = o3.raw.slice(-1)), s2 = true;
          let p2 = t.at(-1);
          p2?.type === "text" ? (p2.raw += o3.raw, p2.text += o3.text) : t.push(o3);
          continue;
        }
        if (e) {
          let p2 = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(p2);
            break;
          } else throw new Error(p2);
        }
      }
      return t;
    }
  };
  var P = class {
    options;
    parser;
    constructor(e) {
      this.options = e || T;
    }
    space(e) {
      return "";
    }
    code({ text: e, lang: t, escaped: n }) {
      let r4 = (t || "").match(m.notSpaceStart)?.[0], i2 = e.replace(m.endingNewline, "") + `
`;
      return r4 ? '<pre><code class="language-' + w(r4) + '">' + (n ? i2 : w(i2, true)) + `</code></pre>
` : "<pre><code>" + (n ? i2 : w(i2, true)) + `</code></pre>
`;
    }
    blockquote({ tokens: e }) {
      return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
    }
    html({ text: e }) {
      return e;
    }
    def(e) {
      return "";
    }
    heading({ tokens: e, depth: t }) {
      return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
    }
    hr(e) {
      return `<hr>
`;
    }
    list(e) {
      let t = e.ordered, n = e.start, r4 = "";
      for (let a2 = 0; a2 < e.items.length; a2++) {
        let o3 = e.items[a2];
        r4 += this.listitem(o3);
      }
      let i2 = t ? "ol" : "ul", s2 = t && n !== 1 ? ' start="' + n + '"' : "";
      return "<" + i2 + s2 + `>
` + r4 + "</" + i2 + `>
`;
    }
    listitem(e) {
      return `<li>${this.parser.parse(e.tokens)}</li>
`;
    }
    checkbox({ checked: e }) {
      return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
    }
    paragraph({ tokens: e }) {
      return `<p>${this.parser.parseInline(e)}</p>
`;
    }
    table(e) {
      let t = "", n = "";
      for (let i2 = 0; i2 < e.header.length; i2++) n += this.tablecell(e.header[i2]);
      t += this.tablerow({ text: n });
      let r4 = "";
      for (let i2 = 0; i2 < e.rows.length; i2++) {
        let s2 = e.rows[i2];
        n = "";
        for (let a2 = 0; a2 < s2.length; a2++) n += this.tablecell(s2[a2]);
        r4 += this.tablerow({ text: n });
      }
      return r4 && (r4 = `<tbody>${r4}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + r4 + `</table>
`;
    }
    tablerow({ text: e }) {
      return `<tr>
${e}</tr>
`;
    }
    tablecell(e) {
      let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
      return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
    }
    strong({ tokens: e }) {
      return `<strong>${this.parser.parseInline(e)}</strong>`;
    }
    em({ tokens: e }) {
      return `<em>${this.parser.parseInline(e)}</em>`;
    }
    codespan({ text: e }) {
      return `<code>${w(e, true)}</code>`;
    }
    br(e) {
      return "<br>";
    }
    del({ tokens: e }) {
      return `<del>${this.parser.parseInline(e)}</del>`;
    }
    link({ href: e, title: t, tokens: n }) {
      let r4 = this.parser.parseInline(n), i2 = X(e);
      if (i2 === null) return r4;
      e = i2;
      let s2 = '<a href="' + e + '"';
      return t && (s2 += ' title="' + w(t) + '"'), s2 += ">" + r4 + "</a>", s2;
    }
    image({ href: e, title: t, text: n, tokens: r4 }) {
      r4 && (n = this.parser.parseInline(r4, this.parser.textRenderer));
      let i2 = X(e);
      if (i2 === null) return w(n);
      e = i2;
      let s2 = `<img src="${e}" alt="${n}"`;
      return t && (s2 += ` title="${w(t)}"`), s2 += ">", s2;
    }
    text(e) {
      return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : w(e.text);
    }
  };
  var $ = class {
    strong({ text: e }) {
      return e;
    }
    em({ text: e }) {
      return e;
    }
    codespan({ text: e }) {
      return e;
    }
    del({ text: e }) {
      return e;
    }
    html({ text: e }) {
      return e;
    }
    text({ text: e }) {
      return e;
    }
    link({ text: e }) {
      return "" + e;
    }
    image({ text: e }) {
      return "" + e;
    }
    br() {
      return "";
    }
    checkbox({ raw: e }) {
      return e;
    }
  };
  var b = class u2 {
    options;
    renderer;
    textRenderer;
    constructor(e) {
      this.options = e || T, this.options.renderer = this.options.renderer || new P(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $();
    }
    static parse(e, t) {
      return new u2(t).parse(e);
    }
    static parseInline(e, t) {
      return new u2(t).parseInline(e);
    }
    parse(e) {
      let t = "";
      for (let n = 0; n < e.length; n++) {
        let r4 = e[n];
        if (this.options.extensions?.renderers?.[r4.type]) {
          let s2 = r4, a2 = this.options.extensions.renderers[s2.type].call({ parser: this }, s2);
          if (a2 !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(s2.type)) {
            t += a2 || "";
            continue;
          }
        }
        let i2 = r4;
        switch (i2.type) {
          case "space": {
            t += this.renderer.space(i2);
            break;
          }
          case "hr": {
            t += this.renderer.hr(i2);
            break;
          }
          case "heading": {
            t += this.renderer.heading(i2);
            break;
          }
          case "code": {
            t += this.renderer.code(i2);
            break;
          }
          case "table": {
            t += this.renderer.table(i2);
            break;
          }
          case "blockquote": {
            t += this.renderer.blockquote(i2);
            break;
          }
          case "list": {
            t += this.renderer.list(i2);
            break;
          }
          case "checkbox": {
            t += this.renderer.checkbox(i2);
            break;
          }
          case "html": {
            t += this.renderer.html(i2);
            break;
          }
          case "def": {
            t += this.renderer.def(i2);
            break;
          }
          case "paragraph": {
            t += this.renderer.paragraph(i2);
            break;
          }
          case "text": {
            t += this.renderer.text(i2);
            break;
          }
          default: {
            let s2 = 'Token with "' + i2.type + '" type was not found.';
            if (this.options.silent) return console.error(s2), "";
            throw new Error(s2);
          }
        }
      }
      return t;
    }
    parseInline(e, t = this.renderer) {
      let n = "";
      for (let r4 = 0; r4 < e.length; r4++) {
        let i2 = e[r4];
        if (this.options.extensions?.renderers?.[i2.type]) {
          let a2 = this.options.extensions.renderers[i2.type].call({ parser: this }, i2);
          if (a2 !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i2.type)) {
            n += a2 || "";
            continue;
          }
        }
        let s2 = i2;
        switch (s2.type) {
          case "escape": {
            n += t.text(s2);
            break;
          }
          case "html": {
            n += t.html(s2);
            break;
          }
          case "link": {
            n += t.link(s2);
            break;
          }
          case "image": {
            n += t.image(s2);
            break;
          }
          case "checkbox": {
            n += t.checkbox(s2);
            break;
          }
          case "strong": {
            n += t.strong(s2);
            break;
          }
          case "em": {
            n += t.em(s2);
            break;
          }
          case "codespan": {
            n += t.codespan(s2);
            break;
          }
          case "br": {
            n += t.br(s2);
            break;
          }
          case "del": {
            n += t.del(s2);
            break;
          }
          case "text": {
            n += t.text(s2);
            break;
          }
          default: {
            let a2 = 'Token with "' + s2.type + '" type was not found.';
            if (this.options.silent) return console.error(a2), "";
            throw new Error(a2);
          }
        }
      }
      return n;
    }
  };
  var S = class {
    options;
    block;
    constructor(e) {
      this.options = e || T;
    }
    static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
    static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
    preprocess(e) {
      return e;
    }
    postprocess(e) {
      return e;
    }
    processAllTokens(e) {
      return e;
    }
    emStrongMask(e) {
      return e;
    }
    provideLexer() {
      return this.block ? x.lex : x.lexInline;
    }
    provideParser() {
      return this.block ? b.parse : b.parseInline;
    }
  };
  var B = class {
    defaults = L();
    options = this.setOptions;
    parse = this.parseMarkdown(true);
    parseInline = this.parseMarkdown(false);
    Parser = b;
    Renderer = P;
    TextRenderer = $;
    Lexer = x;
    Tokenizer = y;
    Hooks = S;
    constructor(...e) {
      this.use(...e);
    }
    walkTokens(e, t) {
      let n = [];
      for (let r4 of e) switch (n = n.concat(t.call(this, r4)), r4.type) {
        case "table": {
          let i2 = r4;
          for (let s2 of i2.header) n = n.concat(this.walkTokens(s2.tokens, t));
          for (let s2 of i2.rows) for (let a2 of s2) n = n.concat(this.walkTokens(a2.tokens, t));
          break;
        }
        case "list": {
          let i2 = r4;
          n = n.concat(this.walkTokens(i2.items, t));
          break;
        }
        default: {
          let i2 = r4;
          this.defaults.extensions?.childTokens?.[i2.type] ? this.defaults.extensions.childTokens[i2.type].forEach((s2) => {
            let a2 = i2[s2].flat(1 / 0);
            n = n.concat(this.walkTokens(a2, t));
          }) : i2.tokens && (n = n.concat(this.walkTokens(i2.tokens, t)));
        }
      }
      return n;
    }
    use(...e) {
      let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
      return e.forEach((n) => {
        let r4 = { ...n };
        if (r4.async = this.defaults.async || r4.async || false, n.extensions && (n.extensions.forEach((i2) => {
          if (!i2.name) throw new Error("extension name required");
          if ("renderer" in i2) {
            let s2 = t.renderers[i2.name];
            s2 ? t.renderers[i2.name] = function(...a2) {
              let o3 = i2.renderer.apply(this, a2);
              return o3 === false && (o3 = s2.apply(this, a2)), o3;
            } : t.renderers[i2.name] = i2.renderer;
          }
          if ("tokenizer" in i2) {
            if (!i2.level || i2.level !== "block" && i2.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
            let s2 = t[i2.level];
            s2 ? s2.unshift(i2.tokenizer) : t[i2.level] = [i2.tokenizer], i2.start && (i2.level === "block" ? t.startBlock ? t.startBlock.push(i2.start) : t.startBlock = [i2.start] : i2.level === "inline" && (t.startInline ? t.startInline.push(i2.start) : t.startInline = [i2.start]));
          }
          "childTokens" in i2 && i2.childTokens && (t.childTokens[i2.name] = i2.childTokens);
        }), r4.extensions = t), n.renderer) {
          let i2 = this.defaults.renderer || new P(this.defaults);
          for (let s2 in n.renderer) {
            if (!(s2 in i2)) throw new Error(`renderer '${s2}' does not exist`);
            if (["options", "parser"].includes(s2)) continue;
            let a2 = s2, o3 = n.renderer[a2], l3 = i2[a2];
            i2[a2] = (...p2) => {
              let c = o3.apply(i2, p2);
              return c === false && (c = l3.apply(i2, p2)), c || "";
            };
          }
          r4.renderer = i2;
        }
        if (n.tokenizer) {
          let i2 = this.defaults.tokenizer || new y(this.defaults);
          for (let s2 in n.tokenizer) {
            if (!(s2 in i2)) throw new Error(`tokenizer '${s2}' does not exist`);
            if (["options", "rules", "lexer"].includes(s2)) continue;
            let a2 = s2, o3 = n.tokenizer[a2], l3 = i2[a2];
            i2[a2] = (...p2) => {
              let c = o3.apply(i2, p2);
              return c === false && (c = l3.apply(i2, p2)), c;
            };
          }
          r4.tokenizer = i2;
        }
        if (n.hooks) {
          let i2 = this.defaults.hooks || new S();
          for (let s2 in n.hooks) {
            if (!(s2 in i2)) throw new Error(`hook '${s2}' does not exist`);
            if (["options", "block"].includes(s2)) continue;
            let a2 = s2, o3 = n.hooks[a2], l3 = i2[a2];
            S.passThroughHooks.has(s2) ? i2[a2] = (p2) => {
              if (this.defaults.async && S.passThroughHooksRespectAsync.has(s2)) return (async () => {
                let g = await o3.call(i2, p2);
                return l3.call(i2, g);
              })();
              let c = o3.call(i2, p2);
              return l3.call(i2, c);
            } : i2[a2] = (...p2) => {
              if (this.defaults.async) return (async () => {
                let g = await o3.apply(i2, p2);
                return g === false && (g = await l3.apply(i2, p2)), g;
              })();
              let c = o3.apply(i2, p2);
              return c === false && (c = l3.apply(i2, p2)), c;
            };
          }
          r4.hooks = i2;
        }
        if (n.walkTokens) {
          let i2 = this.defaults.walkTokens, s2 = n.walkTokens;
          r4.walkTokens = function(a2) {
            let o3 = [];
            return o3.push(s2.call(this, a2)), i2 && (o3 = o3.concat(i2.call(this, a2))), o3;
          };
        }
        this.defaults = { ...this.defaults, ...r4 };
      }), this;
    }
    setOptions(e) {
      return this.defaults = { ...this.defaults, ...e }, this;
    }
    lexer(e, t) {
      return x.lex(e, t ?? this.defaults);
    }
    parser(e, t) {
      return b.parse(e, t ?? this.defaults);
    }
    parseMarkdown(e) {
      return (n, r4) => {
        let i2 = { ...r4 }, s2 = { ...this.defaults, ...i2 }, a2 = this.onError(!!s2.silent, !!s2.async);
        if (this.defaults.async === true && i2.async === false) return a2(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
        if (typeof n > "u" || n === null) return a2(new Error("marked(): input parameter is undefined or null"));
        if (typeof n != "string") return a2(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
        if (s2.hooks && (s2.hooks.options = s2, s2.hooks.block = e), s2.async) return (async () => {
          let o3 = s2.hooks ? await s2.hooks.preprocess(n) : n, p2 = await (s2.hooks ? await s2.hooks.provideLexer() : e ? x.lex : x.lexInline)(o3, s2), c = s2.hooks ? await s2.hooks.processAllTokens(p2) : p2;
          s2.walkTokens && await Promise.all(this.walkTokens(c, s2.walkTokens));
          let h2 = await (s2.hooks ? await s2.hooks.provideParser() : e ? b.parse : b.parseInline)(c, s2);
          return s2.hooks ? await s2.hooks.postprocess(h2) : h2;
        })().catch(a2);
        try {
          s2.hooks && (n = s2.hooks.preprocess(n));
          let l3 = (s2.hooks ? s2.hooks.provideLexer() : e ? x.lex : x.lexInline)(n, s2);
          s2.hooks && (l3 = s2.hooks.processAllTokens(l3)), s2.walkTokens && this.walkTokens(l3, s2.walkTokens);
          let c = (s2.hooks ? s2.hooks.provideParser() : e ? b.parse : b.parseInline)(l3, s2);
          return s2.hooks && (c = s2.hooks.postprocess(c)), c;
        } catch (o3) {
          return a2(o3);
        }
      };
    }
    onError(e, t) {
      return (n) => {
        if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
          let r4 = "<p>An error occurred:</p><pre>" + w(n.message + "", true) + "</pre>";
          return t ? Promise.resolve(r4) : r4;
        }
        if (t) return Promise.reject(n);
        throw n;
      };
    }
  };
  var _ = new B();
  function d(u4, e) {
    return _.parse(u4, e);
  }
  d.options = d.setOptions = function(u4) {
    return _.setOptions(u4), d.defaults = _.defaults, Z(d.defaults), d;
  };
  d.getDefaults = L;
  d.defaults = T;
  d.use = function(...u4) {
    return _.use(...u4), d.defaults = _.defaults, Z(d.defaults), d;
  };
  d.walkTokens = function(u4, e) {
    return _.walkTokens(u4, e);
  };
  d.parseInline = _.parseInline;
  d.Parser = b;
  d.parser = b.parse;
  d.Renderer = P;
  d.TextRenderer = $;
  d.Lexer = x;
  d.lexer = x.lex;
  d.Tokenizer = y;
  d.Hooks = S;
  d.parse = d;
  var Dt = d.options;
  var Ht = d.setOptions;
  var Zt = d.use;
  var Gt = d.walkTokens;
  var Nt = d.parseInline;
  var Ft = b.parse;
  var jt = x.lex;

  // node_modules/katex/dist/katex.mjs
  var SourceLocation = class _SourceLocation {
    // The + prefix indicates that these fields aren't writeable
    // Lexer holding the input string.
    // Start offset, zero-based inclusive.
    // End offset, zero-based exclusive.
    constructor(lexer, start, end) {
      this.lexer = void 0;
      this.start = void 0;
      this.end = void 0;
      this.lexer = lexer;
      this.start = start;
      this.end = end;
    }
    /**
     * Merges two `SourceLocation`s from location providers, given they are
     * provided in order of appearance.
     * - Returns the first one's location if only the first is provided.
     * - Returns a merged range of the first and the last if both are provided
     *   and their lexers match.
     * - Otherwise, returns null.
     */
    static range(first, second) {
      if (!second) {
        return first && first.loc;
      } else if (!first || !first.loc || !second.loc || first.loc.lexer !== second.loc.lexer) {
        return null;
      } else {
        return new _SourceLocation(first.loc.lexer, first.loc.start, second.loc.end);
      }
    }
  };
  var Token = class _Token {
    // don't expand the token
    // used in \noexpand
    constructor(text3, loc) {
      this.text = void 0;
      this.loc = void 0;
      this.noexpand = void 0;
      this.treatAsRelax = void 0;
      this.text = text3;
      this.loc = loc;
    }
    /**
     * Given a pair of tokens (this and endToken), compute a `Token` encompassing
     * the whole input range enclosed by these two.
     */
    range(endToken, text3) {
      return new _Token(text3, SourceLocation.range(this, endToken));
    }
  };
  var ParseError = class _ParseError {
    // Error start position based on passed-in Token or ParseNode.
    // Length of affected text based on passed-in Token or ParseNode.
    // The underlying error message without any context added.
    constructor(message, token2) {
      this.name = void 0;
      this.position = void 0;
      this.length = void 0;
      this.rawMessage = void 0;
      var error = "KaTeX parse error: " + message;
      var start;
      var end;
      var loc = token2 && token2.loc;
      if (loc && loc.start <= loc.end) {
        var input = loc.lexer.input;
        start = loc.start;
        end = loc.end;
        if (start === input.length) {
          error += " at end of input: ";
        } else {
          error += " at position " + (start + 1) + ": ";
        }
        var underlined = input.slice(start, end).replace(/[^]/g, "$&\u0332");
        var left;
        if (start > 15) {
          left = "\u2026" + input.slice(start - 15, start);
        } else {
          left = input.slice(0, start);
        }
        var right;
        if (end + 15 < input.length) {
          right = input.slice(end, end + 15) + "\u2026";
        } else {
          right = input.slice(end);
        }
        error += left + underlined + right;
      }
      var self = new Error(error);
      self.name = "ParseError";
      self.__proto__ = _ParseError.prototype;
      self.position = start;
      if (start != null && end != null) {
        self.length = end - start;
      }
      self.rawMessage = message;
      return self;
    }
  };
  ParseError.prototype.__proto__ = Error.prototype;
  var deflt = function deflt2(setting, defaultIfUndefined) {
    return setting === void 0 ? defaultIfUndefined : setting;
  };
  var uppercase = /([A-Z])/g;
  var hyphenate = function hyphenate2(str) {
    return str.replace(uppercase, "-$1").toLowerCase();
  };
  var ESCAPE_LOOKUP = {
    "&": "&amp;",
    ">": "&gt;",
    "<": "&lt;",
    '"': "&quot;",
    "'": "&#x27;"
  };
  var ESCAPE_REGEX = /[&><"']/g;
  function escape(text3) {
    return String(text3).replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
  }
  var getBaseElem = function getBaseElem2(group) {
    if (group.type === "ordgroup") {
      if (group.body.length === 1) {
        return getBaseElem2(group.body[0]);
      } else {
        return group;
      }
    } else if (group.type === "color") {
      if (group.body.length === 1) {
        return getBaseElem2(group.body[0]);
      } else {
        return group;
      }
    } else if (group.type === "font") {
      return getBaseElem2(group.body);
    } else {
      return group;
    }
  };
  var isCharacterBox = function isCharacterBox2(group) {
    var baseElem = getBaseElem(group);
    return baseElem.type === "mathord" || baseElem.type === "textord" || baseElem.type === "atom";
  };
  var assert = function assert2(value) {
    if (!value) {
      throw new Error("Expected non-null, but got " + String(value));
    }
    return value;
  };
  var protocolFromUrl = function protocolFromUrl2(url) {
    var protocol = /^[\x00-\x20]*([^\\/#?]*?)(:|&#0*58|&#x0*3a|&colon)/i.exec(url);
    if (!protocol) {
      return "_relative";
    }
    if (protocol[2] !== ":") {
      return null;
    }
    if (!/^[a-zA-Z][a-zA-Z0-9+\-.]*$/.test(protocol[1])) {
      return null;
    }
    return protocol[1].toLowerCase();
  };
  var utils = {
    deflt,
    escape,
    hyphenate,
    getBaseElem,
    isCharacterBox,
    protocolFromUrl
  };
  var SETTINGS_SCHEMA = {
    displayMode: {
      type: "boolean",
      description: "Render math in display mode, which puts the math in display style (so \\int and \\sum are large, for example), and centers the math on the page on its own line.",
      cli: "-d, --display-mode"
    },
    output: {
      type: {
        enum: ["htmlAndMathml", "html", "mathml"]
      },
      description: "Determines the markup language of the output.",
      cli: "-F, --format <type>"
    },
    leqno: {
      type: "boolean",
      description: "Render display math in leqno style (left-justified tags)."
    },
    fleqn: {
      type: "boolean",
      description: "Render display math flush left."
    },
    throwOnError: {
      type: "boolean",
      default: true,
      cli: "-t, --no-throw-on-error",
      cliDescription: "Render errors (in the color given by --error-color) instead of throwing a ParseError exception when encountering an error."
    },
    errorColor: {
      type: "string",
      default: "#cc0000",
      cli: "-c, --error-color <color>",
      cliDescription: "A color string given in the format 'rgb' or 'rrggbb' (no #). This option determines the color of errors rendered by the -t option.",
      cliProcessor: (color) => "#" + color
    },
    macros: {
      type: "object",
      cli: "-m, --macro <def>",
      cliDescription: "Define custom macro of the form '\\foo:expansion' (use multiple -m arguments for multiple macros).",
      cliDefault: [],
      cliProcessor: (def, defs) => {
        defs.push(def);
        return defs;
      }
    },
    minRuleThickness: {
      type: "number",
      description: "Specifies a minimum thickness, in ems, for fraction lines, `\\sqrt` top lines, `{array}` vertical lines, `\\hline`, `\\hdashline`, `\\underline`, `\\overline`, and the borders of `\\fbox`, `\\boxed`, and `\\fcolorbox`.",
      processor: (t) => Math.max(0, t),
      cli: "--min-rule-thickness <size>",
      cliProcessor: parseFloat
    },
    colorIsTextColor: {
      type: "boolean",
      description: "Makes \\color behave like LaTeX's 2-argument \\textcolor, instead of LaTeX's one-argument \\color mode change.",
      cli: "-b, --color-is-text-color"
    },
    strict: {
      type: [{
        enum: ["warn", "ignore", "error"]
      }, "boolean", "function"],
      description: "Turn on strict / LaTeX faithfulness mode, which throws an error if the input uses features that are not supported by LaTeX.",
      cli: "-S, --strict",
      cliDefault: false
    },
    trust: {
      type: ["boolean", "function"],
      description: "Trust the input, enabling all HTML features such as \\url.",
      cli: "-T, --trust"
    },
    maxSize: {
      type: "number",
      default: Infinity,
      description: "If non-zero, all user-specified sizes, e.g. in \\rule{500em}{500em}, will be capped to maxSize ems. Otherwise, elements and spaces can be arbitrarily large",
      processor: (s2) => Math.max(0, s2),
      cli: "-s, --max-size <n>",
      cliProcessor: parseInt
    },
    maxExpand: {
      type: "number",
      default: 1e3,
      description: "Limit the number of macro expansions to the specified number, to prevent e.g. infinite macro loops. If set to Infinity, the macro expander will try to fully expand as in LaTeX.",
      processor: (n) => Math.max(0, n),
      cli: "-e, --max-expand <n>",
      cliProcessor: (n) => n === "Infinity" ? Infinity : parseInt(n)
    },
    globalGroup: {
      type: "boolean",
      cli: false
    }
  };
  function getDefaultValue(schema) {
    if (schema.default) {
      return schema.default;
    }
    var type = schema.type;
    var defaultType = Array.isArray(type) ? type[0] : type;
    if (typeof defaultType !== "string") {
      return defaultType.enum[0];
    }
    switch (defaultType) {
      case "boolean":
        return false;
      case "string":
        return "";
      case "number":
        return 0;
      case "object":
        return {};
    }
  }
  var Settings = class {
    constructor(options) {
      this.displayMode = void 0;
      this.output = void 0;
      this.leqno = void 0;
      this.fleqn = void 0;
      this.throwOnError = void 0;
      this.errorColor = void 0;
      this.macros = void 0;
      this.minRuleThickness = void 0;
      this.colorIsTextColor = void 0;
      this.strict = void 0;
      this.trust = void 0;
      this.maxSize = void 0;
      this.maxExpand = void 0;
      this.globalGroup = void 0;
      options = options || {};
      for (var prop in SETTINGS_SCHEMA) {
        if (SETTINGS_SCHEMA.hasOwnProperty(prop)) {
          var schema = SETTINGS_SCHEMA[prop];
          this[prop] = options[prop] !== void 0 ? schema.processor ? schema.processor(options[prop]) : options[prop] : getDefaultValue(schema);
        }
      }
    }
    /**
     * Report nonstrict (non-LaTeX-compatible) input.
     * Can safely not be called if `this.strict` is false in JavaScript.
     */
    reportNonstrict(errorCode, errorMsg, token2) {
      var strict = this.strict;
      if (typeof strict === "function") {
        strict = strict(errorCode, errorMsg, token2);
      }
      if (!strict || strict === "ignore") {
        return;
      } else if (strict === true || strict === "error") {
        throw new ParseError("LaTeX-incompatible input and strict mode is set to 'error': " + (errorMsg + " [" + errorCode + "]"), token2);
      } else if (strict === "warn") {
        typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (errorMsg + " [" + errorCode + "]"));
      } else {
        typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + strict + "': " + errorMsg + " [" + errorCode + "]"));
      }
    }
    /**
     * Check whether to apply strict (LaTeX-adhering) behavior for unusual
     * input (like `\\`).  Unlike `nonstrict`, will not throw an error;
     * instead, "error" translates to a return value of `true`, while "ignore"
     * translates to a return value of `false`.  May still print a warning:
     * "warn" prints a warning and returns `false`.
     * This is for the second category of `errorCode`s listed in the README.
     */
    useStrictBehavior(errorCode, errorMsg, token2) {
      var strict = this.strict;
      if (typeof strict === "function") {
        try {
          strict = strict(errorCode, errorMsg, token2);
        } catch (error) {
          strict = "error";
        }
      }
      if (!strict || strict === "ignore") {
        return false;
      } else if (strict === true || strict === "error") {
        return true;
      } else if (strict === "warn") {
        typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (errorMsg + " [" + errorCode + "]"));
        return false;
      } else {
        typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + strict + "': " + errorMsg + " [" + errorCode + "]"));
        return false;
      }
    }
    /**
     * Check whether to test potentially dangerous input, and return
     * `true` (trusted) or `false` (untrusted).  The sole argument `context`
     * should be an object with `command` field specifying the relevant LaTeX
     * command (as a string starting with `\`), and any other arguments, etc.
     * If `context` has a `url` field, a `protocol` field will automatically
     * get added by this function (changing the specified object).
     */
    isTrusted(context) {
      if (context.url && !context.protocol) {
        var protocol = utils.protocolFromUrl(context.url);
        if (protocol == null) {
          return false;
        }
        context.protocol = protocol;
      }
      var trust = typeof this.trust === "function" ? this.trust(context) : this.trust;
      return Boolean(trust);
    }
  };
  var Style = class {
    constructor(id, size, cramped) {
      this.id = void 0;
      this.size = void 0;
      this.cramped = void 0;
      this.id = id;
      this.size = size;
      this.cramped = cramped;
    }
    /**
     * Get the style of a superscript given a base in the current style.
     */
    sup() {
      return styles[sup[this.id]];
    }
    /**
     * Get the style of a subscript given a base in the current style.
     */
    sub() {
      return styles[sub[this.id]];
    }
    /**
     * Get the style of a fraction numerator given the fraction in the current
     * style.
     */
    fracNum() {
      return styles[fracNum[this.id]];
    }
    /**
     * Get the style of a fraction denominator given the fraction in the current
     * style.
     */
    fracDen() {
      return styles[fracDen[this.id]];
    }
    /**
     * Get the cramped version of a style (in particular, cramping a cramped style
     * doesn't change the style).
     */
    cramp() {
      return styles[cramp[this.id]];
    }
    /**
     * Get a text or display version of this style.
     */
    text() {
      return styles[text$1[this.id]];
    }
    /**
     * Return true if this style is tightly spaced (scriptstyle/scriptscriptstyle)
     */
    isTight() {
      return this.size >= 2;
    }
  };
  var D2 = 0;
  var Dc = 1;
  var T2 = 2;
  var Tc = 3;
  var S2 = 4;
  var Sc = 5;
  var SS = 6;
  var SSc = 7;
  var styles = [new Style(D2, 0, false), new Style(Dc, 0, true), new Style(T2, 1, false), new Style(Tc, 1, true), new Style(S2, 2, false), new Style(Sc, 2, true), new Style(SS, 3, false), new Style(SSc, 3, true)];
  var sup = [S2, Sc, S2, Sc, SS, SSc, SS, SSc];
  var sub = [Sc, Sc, Sc, Sc, SSc, SSc, SSc, SSc];
  var fracNum = [T2, Tc, S2, Sc, SS, SSc, SS, SSc];
  var fracDen = [Tc, Tc, Sc, Sc, SSc, SSc, SSc, SSc];
  var cramp = [Dc, Dc, Tc, Tc, Sc, Sc, SSc, SSc];
  var text$1 = [D2, Dc, T2, Tc, T2, Tc, T2, Tc];
  var Style$1 = {
    DISPLAY: styles[D2],
    TEXT: styles[T2],
    SCRIPT: styles[S2],
    SCRIPTSCRIPT: styles[SS]
  };
  var scriptData = [{
    // Latin characters beyond the Latin-1 characters we have metrics for.
    // Needed for Czech, Hungarian and Turkish text, for example.
    name: "latin",
    blocks: [
      [256, 591],
      // Latin Extended-A and Latin Extended-B
      [768, 879]
      // Combining Diacritical marks
    ]
  }, {
    // The Cyrillic script used by Russian and related languages.
    // A Cyrillic subset used to be supported as explicitly defined
    // symbols in symbols.js
    name: "cyrillic",
    blocks: [[1024, 1279]]
  }, {
    // Armenian
    name: "armenian",
    blocks: [[1328, 1423]]
  }, {
    // The Brahmic scripts of South and Southeast Asia
    // Devanagari (0900–097F)
    // Bengali (0980–09FF)
    // Gurmukhi (0A00–0A7F)
    // Gujarati (0A80–0AFF)
    // Oriya (0B00–0B7F)
    // Tamil (0B80–0BFF)
    // Telugu (0C00–0C7F)
    // Kannada (0C80–0CFF)
    // Malayalam (0D00–0D7F)
    // Sinhala (0D80–0DFF)
    // Thai (0E00–0E7F)
    // Lao (0E80–0EFF)
    // Tibetan (0F00–0FFF)
    // Myanmar (1000–109F)
    name: "brahmic",
    blocks: [[2304, 4255]]
  }, {
    name: "georgian",
    blocks: [[4256, 4351]]
  }, {
    // Chinese and Japanese.
    // The "k" in cjk is for Korean, but we've separated Korean out
    name: "cjk",
    blocks: [
      [12288, 12543],
      // CJK symbols and punctuation, Hiragana, Katakana
      [19968, 40879],
      // CJK ideograms
      [65280, 65376]
      // Fullwidth punctuation
      // TODO: add halfwidth Katakana and Romanji glyphs
    ]
  }, {
    // Korean
    name: "hangul",
    blocks: [[44032, 55215]]
  }];
  function scriptFromCodepoint(codepoint) {
    for (var i2 = 0; i2 < scriptData.length; i2++) {
      var script = scriptData[i2];
      for (var _i = 0; _i < script.blocks.length; _i++) {
        var block = script.blocks[_i];
        if (codepoint >= block[0] && codepoint <= block[1]) {
          return script.name;
        }
      }
    }
    return null;
  }
  var allBlocks = [];
  scriptData.forEach((s2) => s2.blocks.forEach((b4) => allBlocks.push(...b4)));
  function supportedCodepoint(codepoint) {
    for (var i2 = 0; i2 < allBlocks.length; i2 += 2) {
      if (codepoint >= allBlocks[i2] && codepoint <= allBlocks[i2 + 1]) {
        return true;
      }
    }
    return false;
  }
  var hLinePad = 80;
  var sqrtMain = function sqrtMain2(extraVinculum, hLinePad2) {
    return "M95," + (622 + extraVinculum + hLinePad2) + "\nc-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14\nc0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54\nc44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10\ns173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429\nc69,-144,104.5,-217.7,106.5,-221\nl" + extraVinculum / 2.075 + " -" + extraVinculum + "\nc5.3,-9.3,12,-14,20,-14\nH400000v" + (40 + extraVinculum) + "H845.2724\ns-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7\nc-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z\nM" + (834 + extraVinculum) + " " + hLinePad2 + "h400000v" + (40 + extraVinculum) + "h-400000z";
  };
  var sqrtSize1 = function sqrtSize12(extraVinculum, hLinePad2) {
    return "M263," + (601 + extraVinculum + hLinePad2) + "c0.7,0,18,39.7,52,119\nc34,79.3,68.167,158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120\nc340,-704.7,510.7,-1060.3,512,-1067\nl" + extraVinculum / 2.084 + " -" + extraVinculum + "\nc4.7,-7.3,11,-11,19,-11\nH40000v" + (40 + extraVinculum) + "H1012.3\ns-271.3,567,-271.3,567c-38.7,80.7,-84,175,-136,283c-52,108,-89.167,185.3,-111.5,232\nc-22.3,46.7,-33.8,70.3,-34.5,71c-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1\ns-109,-253,-109,-253c-72.7,-168,-109.3,-252,-110,-252c-10.7,8,-22,16.7,-34,26\nc-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26s76,-59,76,-59s76,-60,76,-60z\nM" + (1001 + extraVinculum) + " " + hLinePad2 + "h400000v" + (40 + extraVinculum) + "h-400000z";
  };
  var sqrtSize2 = function sqrtSize22(extraVinculum, hLinePad2) {
    return "M983 " + (10 + extraVinculum + hLinePad2) + "\nl" + extraVinculum / 3.13 + " -" + extraVinculum + "\nc4,-6.7,10,-10,18,-10 H400000v" + (40 + extraVinculum) + "\nH1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7\ns-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744\nc-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30\nc26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722\nc56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5\nc53.7,-170.3,84.5,-266.8,92.5,-289.5z\nM" + (1001 + extraVinculum) + " " + hLinePad2 + "h400000v" + (40 + extraVinculum) + "h-400000z";
  };
  var sqrtSize3 = function sqrtSize32(extraVinculum, hLinePad2) {
    return "M424," + (2398 + extraVinculum + hLinePad2) + "\nc-1.3,-0.7,-38.5,-172,-111.5,-514c-73,-342,-109.8,-513.3,-110.5,-514\nc0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,25c-5.7,9.3,-9.8,16,-12.5,20\ns-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,-13s76,-122,76,-122s77,-121,77,-121\ns209,968,209,968c0,-2,84.7,-361.7,254,-1079c169.3,-717.3,254.7,-1077.7,256,-1081\nl" + extraVinculum / 4.223 + " -" + extraVinculum + "c4,-6.7,10,-10,18,-10 H400000\nv" + (40 + extraVinculum) + "H1014.6\ns-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185\nc-2,6,-10,9,-24,9\nc-8,0,-12,-0.7,-12,-2z M" + (1001 + extraVinculum) + " " + hLinePad2 + "\nh400000v" + (40 + extraVinculum) + "h-400000z";
  };
  var sqrtSize4 = function sqrtSize42(extraVinculum, hLinePad2) {
    return "M473," + (2713 + extraVinculum + hLinePad2) + "\nc339.3,-1799.3,509.3,-2700,510,-2702 l" + extraVinculum / 5.298 + " -" + extraVinculum + "\nc3.3,-7.3,9.3,-11,18,-11 H400000v" + (40 + extraVinculum) + "H1017.7\ns-90.5,478,-276.2,1466c-185.7,988,-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9\nc-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200\nc0,-1.3,-5.3,8.7,-16,30c-10.7,21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26\ns76,-153,76,-153s77,-151,77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,\n606zM" + (1001 + extraVinculum) + " " + hLinePad2 + "h400000v" + (40 + extraVinculum) + "H1017.7z";
  };
  var phasePath = function phasePath2(y4) {
    var x4 = y4 / 2;
    return "M400000 " + y4 + " H0 L" + x4 + " 0 l65 45 L145 " + (y4 - 80) + " H400000z";
  };
  var sqrtTall = function sqrtTall2(extraVinculum, hLinePad2, viewBoxHeight) {
    var vertSegment = viewBoxHeight - 54 - hLinePad2 - extraVinculum;
    return "M702 " + (extraVinculum + hLinePad2) + "H400000" + (40 + extraVinculum) + "\nH742v" + vertSegment + "l-4 4-4 4c-.667.7 -2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1\nh-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170\nc-4-3.333-8.333-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667\n219 661 l218 661zM702 " + hLinePad2 + "H400000v" + (40 + extraVinculum) + "H742z";
  };
  var sqrtPath = function sqrtPath2(size, extraVinculum, viewBoxHeight) {
    extraVinculum = 1e3 * extraVinculum;
    var path2 = "";
    switch (size) {
      case "sqrtMain":
        path2 = sqrtMain(extraVinculum, hLinePad);
        break;
      case "sqrtSize1":
        path2 = sqrtSize1(extraVinculum, hLinePad);
        break;
      case "sqrtSize2":
        path2 = sqrtSize2(extraVinculum, hLinePad);
        break;
      case "sqrtSize3":
        path2 = sqrtSize3(extraVinculum, hLinePad);
        break;
      case "sqrtSize4":
        path2 = sqrtSize4(extraVinculum, hLinePad);
        break;
      case "sqrtTall":
        path2 = sqrtTall(extraVinculum, hLinePad, viewBoxHeight);
    }
    return path2;
  };
  var innerPath = function innerPath2(name, height) {
    switch (name) {
      case "\u239C":
        return "M291 0 H417 V" + height + " H291z M291 0 H417 V" + height + " H291z";
      case "\u2223":
        return "M145 0 H188 V" + height + " H145z M145 0 H188 V" + height + " H145z";
      case "\u2225":
        return "M145 0 H188 V" + height + " H145z M145 0 H188 V" + height + " H145z" + ("M367 0 H410 V" + height + " H367z M367 0 H410 V" + height + " H367z");
      case "\u239F":
        return "M457 0 H583 V" + height + " H457z M457 0 H583 V" + height + " H457z";
      case "\u23A2":
        return "M319 0 H403 V" + height + " H319z M319 0 H403 V" + height + " H319z";
      case "\u23A5":
        return "M263 0 H347 V" + height + " H263z M263 0 H347 V" + height + " H263z";
      case "\u23AA":
        return "M384 0 H504 V" + height + " H384z M384 0 H504 V" + height + " H384z";
      case "\u23D0":
        return "M312 0 H355 V" + height + " H312z M312 0 H355 V" + height + " H312z";
      case "\u2016":
        return "M257 0 H300 V" + height + " H257z M257 0 H300 V" + height + " H257z" + ("M478 0 H521 V" + height + " H478z M478 0 H521 V" + height + " H478z");
      default:
        return "";
    }
  };
  var path = {
    // The doubleleftarrow geometry is from glyph U+21D0 in the font KaTeX Main
    doubleleftarrow: "M262 157\nl10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3\n 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28\n 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5\nc2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5\n 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87\n-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7\n-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z\nm8 0v40h399730v-40zm0 194v40h399730v-40z",
    // doublerightarrow is from glyph U+21D2 in font KaTeX Main
    doublerightarrow: "M399738 392l\n-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5\n 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88\n-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68\n-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18\n-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782\nc-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3\n-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z",
    // leftarrow is from glyph U+2190 in font KaTeX Main
    leftarrow: "M400000 241H110l3-3c68.7-52.7 113.7-120\n 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8\n-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247\nc-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208\n 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3\n 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202\n l-3-3h399890zM100 241v40h399900v-40z",
    // overbrace is from glyphs U+23A9/23A8/23A7 in font KaTeX_Size4-Regular
    leftbrace: "M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117\n-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7\n 5-6 9-10 13-.7 1-7.3 1-20 1H6z",
    leftbraceunder: "M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13\n 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688\n 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7\n-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z",
    // overgroup is from the MnSymbol package (public domain)
    leftgroup: "M400000 80\nH435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0\n 435 0h399565z",
    leftgroupunder: "M400000 262\nH435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219\n 435 219h399565z",
    // Harpoons are from glyph U+21BD in font KaTeX Main
    leftharpoon: "M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3\n-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5\n-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7\n-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z",
    leftharpoonplus: "M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5\n 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3\n-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7\n-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z\nm0 0v40h400000v-40z",
    leftharpoondown: "M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333\n 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5\n 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667\n-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z",
    leftharpoondownplus: "M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12\n 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7\n-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0\nv40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z",
    // hook is from glyph U+21A9 in font KaTeX Main
    lefthook: "M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5\n-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3\n-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21\n 71.5 23h399859zM103 281v-40h399897v40z",
    leftlinesegment: "M40 281 V428 H0 V94 H40 V241 H400000 v40z\nM40 281 V428 H0 V94 H40 V241 H400000 v40z",
    leftmapsto: "M40 281 V448H0V74H40V241H400000v40z\nM40 281 V448H0V74H40V241H400000v40z",
    // tofrom is from glyph U+21C4 in font KaTeX AMS Regular
    leftToFrom: "M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23\n-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8\nc28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3\n 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z",
    longequal: "M0 50 h400000 v40H0z m0 194h40000v40H0z\nM0 50 h400000 v40H0z m0 194h40000v40H0z",
    midbrace: "M200428 334\nc-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14\n-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7\n 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11\n 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z",
    midbraceunder: "M199572 214\nc100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14\n 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3\n 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0\n-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z",
    oiintSize1: "M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6\n-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z\nm368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8\n60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z",
    oiintSize2: "M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8\n-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z\nm502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2\nc0 110 84 276 504 276s502.4-166 502.4-276z",
    oiiintSize1: "M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6\n-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z\nm525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0\n85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z",
    oiiintSize2: "M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8\n-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z\nm770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1\nc0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z",
    rightarrow: "M0 241v40h399891c-47.3 35.3-84 78-110 128\n-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20\n 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7\n 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85\n-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n 151.7 139 205zm0 0v40h399900v-40z",
    rightbrace: "M400000 542l\n-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5\ns-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1\nc124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z",
    rightbraceunder: "M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3\n 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237\n-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z",
    rightgroup: "M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0\n 3-1 3-3v-38c-76-158-257-219-435-219H0z",
    rightgroupunder: "M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18\n 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z",
    rightharpoon: "M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3\n-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2\n-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58\n 69.2 92 94.5zm0 0v40h399900v-40z",
    rightharpoonplus: "M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11\n-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7\n 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z\nm0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z",
    rightharpoondown: "M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8\n 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5\n-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95\n-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z",
    rightharpoondownplus: "M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8\n 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3\n 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3\n-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z\nm0-194v40h400000v-40zm0 0v40h400000v-40z",
    righthook: "M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3\n 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0\n-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21\n 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z",
    rightlinesegment: "M399960 241 V94 h40 V428 h-40 V281 H0 v-40z\nM399960 241 V94 h40 V428 h-40 V281 H0 v-40z",
    rightToFrom: "M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23\n 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32\n-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142\n-167z M100 147v40h399900v-40zM0 341v40h399900v-40z",
    // twoheadleftarrow is from glyph U+219E in font KaTeX AMS Regular
    twoheadleftarrow: "M0 167c68 40\n 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69\n-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3\n-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19\n-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101\n 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z",
    twoheadrightarrow: "M400000 167\nc-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3\n 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42\n 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333\n-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70\n 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z",
    // tilde1 is a modified version of a glyph from the MnSymbol package
    tilde1: "M200 55.538c-77 0-168 73.953-177 73.953-3 0-7\n-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0\n 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0\n 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128\n-68.267.847-113-73.952-191-73.952z",
    // ditto tilde2, tilde3, & tilde4
    tilde2: "M344 55.266c-142 0-300.638 81.316-311.5 86.418\n-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9\n 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114\nc1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751\n 181.476 676 181.476c-149 0-189-126.21-332-126.21z",
    tilde3: "M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457\n-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0\n 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697\n 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696\n -338 0-409-156.573-744-156.573z",
    tilde4: "M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345\n-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409\n 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9\n 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409\n -175.236-744-175.236z",
    // vec is from glyph U+20D7 in font KaTeX Main
    vec: "M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5\n3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11\n10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63\n-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1\n-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59\nH213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359\nc-16-25.333-24-45-24-59z",
    // widehat1 is a modified version of a glyph from the MnSymbol package
    widehat1: "M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22\nc-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z",
    // ditto widehat2, widehat3, & widehat4
    widehat2: "M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
    widehat3: "M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
    widehat4: "M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
    // widecheck paths are all inverted versions of widehat
    widecheck1: "M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,\n-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z",
    widecheck2: "M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
    widecheck3: "M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
    widecheck4: "M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
    // The next ten paths support reaction arrows from the mhchem package.
    // Arrows for \ce{<-->} are offset from xAxis by 0.22ex, per mhchem in LaTeX
    // baraboveleftarrow is mostly from glyph U+2190 in font KaTeX Main
    baraboveleftarrow: "M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202\nc4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5\nc-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130\ns-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47\n121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6\ns2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11\nc0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z\nM100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z",
    // rightarrowabovebar is mostly from glyph U+2192, KaTeX Main
    rightarrowabovebar: "M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32\n-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0\n13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39\n-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5\n-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z",
    // The short left harpoon has 0.5em (i.e. 500 units) kern on the left end.
    // Ref from mhchem.sty: \rlap{\raisebox{-.22ex}{$\kern0.5em
    baraboveshortleftharpoon: "M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17\nc2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21\nc-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40\nc-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z\nM0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z",
    rightharpoonaboveshortbar: "M0,241 l0,40c399126,0,399993,0,399993,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z",
    shortbaraboveleftharpoon: "M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,\n1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,\n-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z\nM93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z",
    shortrightharpoonabovebar: "M53,241l0,40c398570,0,399437,0,399437,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z"
  };
  var tallDelim = function tallDelim2(label, midHeight) {
    switch (label) {
      case "lbrack":
        return "M403 1759 V84 H666 V0 H319 V1759 v" + midHeight + " v1759 h347 v-84\nH403z M403 1759 V0 H319 V1759 v" + midHeight + " v1759 h84z";
      case "rbrack":
        return "M347 1759 V0 H0 V84 H263 V1759 v" + midHeight + " v1759 H0 v84 H347z\nM347 1759 V0 H263 V1759 v" + midHeight + " v1759 h84z";
      case "vert":
        return "M145 15 v585 v" + midHeight + " v585 c2.667,10,9.667,15,21,15\nc10,0,16.667,-5,20,-15 v-585 v" + -midHeight + " v-585 c-2.667,-10,-9.667,-15,-21,-15\nc-10,0,-16.667,5,-20,15z M188 15 H145 v585 v" + midHeight + " v585 h43z";
      case "doublevert":
        return "M145 15 v585 v" + midHeight + " v585 c2.667,10,9.667,15,21,15\nc10,0,16.667,-5,20,-15 v-585 v" + -midHeight + " v-585 c-2.667,-10,-9.667,-15,-21,-15\nc-10,0,-16.667,5,-20,15z M188 15 H145 v585 v" + midHeight + " v585 h43z\nM367 15 v585 v" + midHeight + " v585 c2.667,10,9.667,15,21,15\nc10,0,16.667,-5,20,-15 v-585 v" + -midHeight + " v-585 c-2.667,-10,-9.667,-15,-21,-15\nc-10,0,-16.667,5,-20,15z M410 15 H367 v585 v" + midHeight + " v585 h43z";
      case "lfloor":
        return "M319 602 V0 H403 V602 v" + midHeight + " v1715 h263 v84 H319z\nMM319 602 V0 H403 V602 v" + midHeight + " v1715 H319z";
      case "rfloor":
        return "M319 602 V0 H403 V602 v" + midHeight + " v1799 H0 v-84 H319z\nMM319 602 V0 H403 V602 v" + midHeight + " v1715 H319z";
      case "lceil":
        return "M403 1759 V84 H666 V0 H319 V1759 v" + midHeight + " v602 h84z\nM403 1759 V0 H319 V1759 v" + midHeight + " v602 h84z";
      case "rceil":
        return "M347 1759 V0 H0 V84 H263 V1759 v" + midHeight + " v602 h84z\nM347 1759 V0 h-84 V1759 v" + midHeight + " v602 h84z";
      case "lparen":
        return "M863,9c0,-2,-2,-5,-6,-9c0,0,-17,0,-17,0c-12.7,0,-19.3,0.3,-20,1\nc-5.3,5.3,-10.3,11,-15,17c-242.7,294.7,-395.3,682,-458,1162c-21.3,163.3,-33.3,349,\n-36,557 l0," + (midHeight + 84) + "c0.2,6,0,26,0,60c2,159.3,10,310.7,24,454c53.3,528,210,\n949.7,470,1265c4.7,6,9.7,11.7,15,17c0.7,0.7,7,1,19,1c0,0,18,0,18,0c4,-4,6,-7,6,-9\nc0,-2.7,-3.3,-8.7,-10,-18c-135.3,-192.7,-235.5,-414.3,-300.5,-665c-65,-250.7,-102.5,\n-544.7,-112.5,-882c-2,-104,-3,-167,-3,-189\nl0,-" + (midHeight + 92) + "c0,-162.7,5.7,-314,17,-454c20.7,-272,63.7,-513,129,-723c65.3,\n-210,155.3,-396.3,270,-559c6.7,-9.3,10,-15.3,10,-18z";
      case "rparen":
        return "M76,0c-16.7,0,-25,3,-25,9c0,2,2,6.3,6,13c21.3,28.7,42.3,60.3,\n63,95c96.7,156.7,172.8,332.5,228.5,527.5c55.7,195,92.8,416.5,111.5,664.5\nc11.3,139.3,17,290.7,17,454c0,28,1.7,43,3.3,45l0," + (midHeight + 9) + "\nc-3,4,-3.3,16.7,-3.3,38c0,162,-5.7,313.7,-17,455c-18.7,248,-55.8,469.3,-111.5,664\nc-55.7,194.7,-131.8,370.3,-228.5,527c-20.7,34.7,-41.7,66.3,-63,95c-2,3.3,-4,7,-6,11\nc0,7.3,5.7,11,17,11c0,0,11,0,11,0c9.3,0,14.3,-0.3,15,-1c5.3,-5.3,10.3,-11,15,-17\nc242.7,-294.7,395.3,-681.7,458,-1161c21.3,-164.7,33.3,-350.7,36,-558\nl0,-" + (midHeight + 144) + "c-2,-159.3,-10,-310.7,-24,-454c-53.3,-528,-210,-949.7,\n-470,-1265c-4.7,-6,-9.7,-11.7,-15,-17c-0.7,-0.7,-6.7,-1,-18,-1z";
      default:
        throw new Error("Unknown stretchy delimiter.");
    }
  };
  var DocumentFragment = class {
    // Never used; needed for satisfying interface.
    constructor(children) {
      this.children = void 0;
      this.classes = void 0;
      this.height = void 0;
      this.depth = void 0;
      this.maxFontSize = void 0;
      this.style = void 0;
      this.children = children;
      this.classes = [];
      this.height = 0;
      this.depth = 0;
      this.maxFontSize = 0;
      this.style = {};
    }
    hasClass(className) {
      return this.classes.includes(className);
    }
    /** Convert the fragment into a node. */
    toNode() {
      var frag = document.createDocumentFragment();
      for (var i2 = 0; i2 < this.children.length; i2++) {
        frag.appendChild(this.children[i2].toNode());
      }
      return frag;
    }
    /** Convert the fragment into HTML markup. */
    toMarkup() {
      var markup = "";
      for (var i2 = 0; i2 < this.children.length; i2++) {
        markup += this.children[i2].toMarkup();
      }
      return markup;
    }
    /**
     * Converts the math node into a string, similar to innerText. Applies to
     * MathDomNode's only.
     */
    toText() {
      var toText = (child) => child.toText();
      return this.children.map(toText).join("");
    }
  };
  var fontMetricsData = {
    "AMS-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "65": [0, 0.68889, 0, 0, 0.72222],
      "66": [0, 0.68889, 0, 0, 0.66667],
      "67": [0, 0.68889, 0, 0, 0.72222],
      "68": [0, 0.68889, 0, 0, 0.72222],
      "69": [0, 0.68889, 0, 0, 0.66667],
      "70": [0, 0.68889, 0, 0, 0.61111],
      "71": [0, 0.68889, 0, 0, 0.77778],
      "72": [0, 0.68889, 0, 0, 0.77778],
      "73": [0, 0.68889, 0, 0, 0.38889],
      "74": [0.16667, 0.68889, 0, 0, 0.5],
      "75": [0, 0.68889, 0, 0, 0.77778],
      "76": [0, 0.68889, 0, 0, 0.66667],
      "77": [0, 0.68889, 0, 0, 0.94445],
      "78": [0, 0.68889, 0, 0, 0.72222],
      "79": [0.16667, 0.68889, 0, 0, 0.77778],
      "80": [0, 0.68889, 0, 0, 0.61111],
      "81": [0.16667, 0.68889, 0, 0, 0.77778],
      "82": [0, 0.68889, 0, 0, 0.72222],
      "83": [0, 0.68889, 0, 0, 0.55556],
      "84": [0, 0.68889, 0, 0, 0.66667],
      "85": [0, 0.68889, 0, 0, 0.72222],
      "86": [0, 0.68889, 0, 0, 0.72222],
      "87": [0, 0.68889, 0, 0, 1],
      "88": [0, 0.68889, 0, 0, 0.72222],
      "89": [0, 0.68889, 0, 0, 0.72222],
      "90": [0, 0.68889, 0, 0, 0.66667],
      "107": [0, 0.68889, 0, 0, 0.55556],
      "160": [0, 0, 0, 0, 0.25],
      "165": [0, 0.675, 0.025, 0, 0.75],
      "174": [0.15559, 0.69224, 0, 0, 0.94666],
      "240": [0, 0.68889, 0, 0, 0.55556],
      "295": [0, 0.68889, 0, 0, 0.54028],
      "710": [0, 0.825, 0, 0, 2.33334],
      "732": [0, 0.9, 0, 0, 2.33334],
      "770": [0, 0.825, 0, 0, 2.33334],
      "771": [0, 0.9, 0, 0, 2.33334],
      "989": [0.08167, 0.58167, 0, 0, 0.77778],
      "1008": [0, 0.43056, 0.04028, 0, 0.66667],
      "8245": [0, 0.54986, 0, 0, 0.275],
      "8463": [0, 0.68889, 0, 0, 0.54028],
      "8487": [0, 0.68889, 0, 0, 0.72222],
      "8498": [0, 0.68889, 0, 0, 0.55556],
      "8502": [0, 0.68889, 0, 0, 0.66667],
      "8503": [0, 0.68889, 0, 0, 0.44445],
      "8504": [0, 0.68889, 0, 0, 0.66667],
      "8513": [0, 0.68889, 0, 0, 0.63889],
      "8592": [-0.03598, 0.46402, 0, 0, 0.5],
      "8594": [-0.03598, 0.46402, 0, 0, 0.5],
      "8602": [-0.13313, 0.36687, 0, 0, 1],
      "8603": [-0.13313, 0.36687, 0, 0, 1],
      "8606": [0.01354, 0.52239, 0, 0, 1],
      "8608": [0.01354, 0.52239, 0, 0, 1],
      "8610": [0.01354, 0.52239, 0, 0, 1.11111],
      "8611": [0.01354, 0.52239, 0, 0, 1.11111],
      "8619": [0, 0.54986, 0, 0, 1],
      "8620": [0, 0.54986, 0, 0, 1],
      "8621": [-0.13313, 0.37788, 0, 0, 1.38889],
      "8622": [-0.13313, 0.36687, 0, 0, 1],
      "8624": [0, 0.69224, 0, 0, 0.5],
      "8625": [0, 0.69224, 0, 0, 0.5],
      "8630": [0, 0.43056, 0, 0, 1],
      "8631": [0, 0.43056, 0, 0, 1],
      "8634": [0.08198, 0.58198, 0, 0, 0.77778],
      "8635": [0.08198, 0.58198, 0, 0, 0.77778],
      "8638": [0.19444, 0.69224, 0, 0, 0.41667],
      "8639": [0.19444, 0.69224, 0, 0, 0.41667],
      "8642": [0.19444, 0.69224, 0, 0, 0.41667],
      "8643": [0.19444, 0.69224, 0, 0, 0.41667],
      "8644": [0.1808, 0.675, 0, 0, 1],
      "8646": [0.1808, 0.675, 0, 0, 1],
      "8647": [0.1808, 0.675, 0, 0, 1],
      "8648": [0.19444, 0.69224, 0, 0, 0.83334],
      "8649": [0.1808, 0.675, 0, 0, 1],
      "8650": [0.19444, 0.69224, 0, 0, 0.83334],
      "8651": [0.01354, 0.52239, 0, 0, 1],
      "8652": [0.01354, 0.52239, 0, 0, 1],
      "8653": [-0.13313, 0.36687, 0, 0, 1],
      "8654": [-0.13313, 0.36687, 0, 0, 1],
      "8655": [-0.13313, 0.36687, 0, 0, 1],
      "8666": [0.13667, 0.63667, 0, 0, 1],
      "8667": [0.13667, 0.63667, 0, 0, 1],
      "8669": [-0.13313, 0.37788, 0, 0, 1],
      "8672": [-0.064, 0.437, 0, 0, 1.334],
      "8674": [-0.064, 0.437, 0, 0, 1.334],
      "8705": [0, 0.825, 0, 0, 0.5],
      "8708": [0, 0.68889, 0, 0, 0.55556],
      "8709": [0.08167, 0.58167, 0, 0, 0.77778],
      "8717": [0, 0.43056, 0, 0, 0.42917],
      "8722": [-0.03598, 0.46402, 0, 0, 0.5],
      "8724": [0.08198, 0.69224, 0, 0, 0.77778],
      "8726": [0.08167, 0.58167, 0, 0, 0.77778],
      "8733": [0, 0.69224, 0, 0, 0.77778],
      "8736": [0, 0.69224, 0, 0, 0.72222],
      "8737": [0, 0.69224, 0, 0, 0.72222],
      "8738": [0.03517, 0.52239, 0, 0, 0.72222],
      "8739": [0.08167, 0.58167, 0, 0, 0.22222],
      "8740": [0.25142, 0.74111, 0, 0, 0.27778],
      "8741": [0.08167, 0.58167, 0, 0, 0.38889],
      "8742": [0.25142, 0.74111, 0, 0, 0.5],
      "8756": [0, 0.69224, 0, 0, 0.66667],
      "8757": [0, 0.69224, 0, 0, 0.66667],
      "8764": [-0.13313, 0.36687, 0, 0, 0.77778],
      "8765": [-0.13313, 0.37788, 0, 0, 0.77778],
      "8769": [-0.13313, 0.36687, 0, 0, 0.77778],
      "8770": [-0.03625, 0.46375, 0, 0, 0.77778],
      "8774": [0.30274, 0.79383, 0, 0, 0.77778],
      "8776": [-0.01688, 0.48312, 0, 0, 0.77778],
      "8778": [0.08167, 0.58167, 0, 0, 0.77778],
      "8782": [0.06062, 0.54986, 0, 0, 0.77778],
      "8783": [0.06062, 0.54986, 0, 0, 0.77778],
      "8785": [0.08198, 0.58198, 0, 0, 0.77778],
      "8786": [0.08198, 0.58198, 0, 0, 0.77778],
      "8787": [0.08198, 0.58198, 0, 0, 0.77778],
      "8790": [0, 0.69224, 0, 0, 0.77778],
      "8791": [0.22958, 0.72958, 0, 0, 0.77778],
      "8796": [0.08198, 0.91667, 0, 0, 0.77778],
      "8806": [0.25583, 0.75583, 0, 0, 0.77778],
      "8807": [0.25583, 0.75583, 0, 0, 0.77778],
      "8808": [0.25142, 0.75726, 0, 0, 0.77778],
      "8809": [0.25142, 0.75726, 0, 0, 0.77778],
      "8812": [0.25583, 0.75583, 0, 0, 0.5],
      "8814": [0.20576, 0.70576, 0, 0, 0.77778],
      "8815": [0.20576, 0.70576, 0, 0, 0.77778],
      "8816": [0.30274, 0.79383, 0, 0, 0.77778],
      "8817": [0.30274, 0.79383, 0, 0, 0.77778],
      "8818": [0.22958, 0.72958, 0, 0, 0.77778],
      "8819": [0.22958, 0.72958, 0, 0, 0.77778],
      "8822": [0.1808, 0.675, 0, 0, 0.77778],
      "8823": [0.1808, 0.675, 0, 0, 0.77778],
      "8828": [0.13667, 0.63667, 0, 0, 0.77778],
      "8829": [0.13667, 0.63667, 0, 0, 0.77778],
      "8830": [0.22958, 0.72958, 0, 0, 0.77778],
      "8831": [0.22958, 0.72958, 0, 0, 0.77778],
      "8832": [0.20576, 0.70576, 0, 0, 0.77778],
      "8833": [0.20576, 0.70576, 0, 0, 0.77778],
      "8840": [0.30274, 0.79383, 0, 0, 0.77778],
      "8841": [0.30274, 0.79383, 0, 0, 0.77778],
      "8842": [0.13597, 0.63597, 0, 0, 0.77778],
      "8843": [0.13597, 0.63597, 0, 0, 0.77778],
      "8847": [0.03517, 0.54986, 0, 0, 0.77778],
      "8848": [0.03517, 0.54986, 0, 0, 0.77778],
      "8858": [0.08198, 0.58198, 0, 0, 0.77778],
      "8859": [0.08198, 0.58198, 0, 0, 0.77778],
      "8861": [0.08198, 0.58198, 0, 0, 0.77778],
      "8862": [0, 0.675, 0, 0, 0.77778],
      "8863": [0, 0.675, 0, 0, 0.77778],
      "8864": [0, 0.675, 0, 0, 0.77778],
      "8865": [0, 0.675, 0, 0, 0.77778],
      "8872": [0, 0.69224, 0, 0, 0.61111],
      "8873": [0, 0.69224, 0, 0, 0.72222],
      "8874": [0, 0.69224, 0, 0, 0.88889],
      "8876": [0, 0.68889, 0, 0, 0.61111],
      "8877": [0, 0.68889, 0, 0, 0.61111],
      "8878": [0, 0.68889, 0, 0, 0.72222],
      "8879": [0, 0.68889, 0, 0, 0.72222],
      "8882": [0.03517, 0.54986, 0, 0, 0.77778],
      "8883": [0.03517, 0.54986, 0, 0, 0.77778],
      "8884": [0.13667, 0.63667, 0, 0, 0.77778],
      "8885": [0.13667, 0.63667, 0, 0, 0.77778],
      "8888": [0, 0.54986, 0, 0, 1.11111],
      "8890": [0.19444, 0.43056, 0, 0, 0.55556],
      "8891": [0.19444, 0.69224, 0, 0, 0.61111],
      "8892": [0.19444, 0.69224, 0, 0, 0.61111],
      "8901": [0, 0.54986, 0, 0, 0.27778],
      "8903": [0.08167, 0.58167, 0, 0, 0.77778],
      "8905": [0.08167, 0.58167, 0, 0, 0.77778],
      "8906": [0.08167, 0.58167, 0, 0, 0.77778],
      "8907": [0, 0.69224, 0, 0, 0.77778],
      "8908": [0, 0.69224, 0, 0, 0.77778],
      "8909": [-0.03598, 0.46402, 0, 0, 0.77778],
      "8910": [0, 0.54986, 0, 0, 0.76042],
      "8911": [0, 0.54986, 0, 0, 0.76042],
      "8912": [0.03517, 0.54986, 0, 0, 0.77778],
      "8913": [0.03517, 0.54986, 0, 0, 0.77778],
      "8914": [0, 0.54986, 0, 0, 0.66667],
      "8915": [0, 0.54986, 0, 0, 0.66667],
      "8916": [0, 0.69224, 0, 0, 0.66667],
      "8918": [0.0391, 0.5391, 0, 0, 0.77778],
      "8919": [0.0391, 0.5391, 0, 0, 0.77778],
      "8920": [0.03517, 0.54986, 0, 0, 1.33334],
      "8921": [0.03517, 0.54986, 0, 0, 1.33334],
      "8922": [0.38569, 0.88569, 0, 0, 0.77778],
      "8923": [0.38569, 0.88569, 0, 0, 0.77778],
      "8926": [0.13667, 0.63667, 0, 0, 0.77778],
      "8927": [0.13667, 0.63667, 0, 0, 0.77778],
      "8928": [0.30274, 0.79383, 0, 0, 0.77778],
      "8929": [0.30274, 0.79383, 0, 0, 0.77778],
      "8934": [0.23222, 0.74111, 0, 0, 0.77778],
      "8935": [0.23222, 0.74111, 0, 0, 0.77778],
      "8936": [0.23222, 0.74111, 0, 0, 0.77778],
      "8937": [0.23222, 0.74111, 0, 0, 0.77778],
      "8938": [0.20576, 0.70576, 0, 0, 0.77778],
      "8939": [0.20576, 0.70576, 0, 0, 0.77778],
      "8940": [0.30274, 0.79383, 0, 0, 0.77778],
      "8941": [0.30274, 0.79383, 0, 0, 0.77778],
      "8994": [0.19444, 0.69224, 0, 0, 0.77778],
      "8995": [0.19444, 0.69224, 0, 0, 0.77778],
      "9416": [0.15559, 0.69224, 0, 0, 0.90222],
      "9484": [0, 0.69224, 0, 0, 0.5],
      "9488": [0, 0.69224, 0, 0, 0.5],
      "9492": [0, 0.37788, 0, 0, 0.5],
      "9496": [0, 0.37788, 0, 0, 0.5],
      "9585": [0.19444, 0.68889, 0, 0, 0.88889],
      "9586": [0.19444, 0.74111, 0, 0, 0.88889],
      "9632": [0, 0.675, 0, 0, 0.77778],
      "9633": [0, 0.675, 0, 0, 0.77778],
      "9650": [0, 0.54986, 0, 0, 0.72222],
      "9651": [0, 0.54986, 0, 0, 0.72222],
      "9654": [0.03517, 0.54986, 0, 0, 0.77778],
      "9660": [0, 0.54986, 0, 0, 0.72222],
      "9661": [0, 0.54986, 0, 0, 0.72222],
      "9664": [0.03517, 0.54986, 0, 0, 0.77778],
      "9674": [0.11111, 0.69224, 0, 0, 0.66667],
      "9733": [0.19444, 0.69224, 0, 0, 0.94445],
      "10003": [0, 0.69224, 0, 0, 0.83334],
      "10016": [0, 0.69224, 0, 0, 0.83334],
      "10731": [0.11111, 0.69224, 0, 0, 0.66667],
      "10846": [0.19444, 0.75583, 0, 0, 0.61111],
      "10877": [0.13667, 0.63667, 0, 0, 0.77778],
      "10878": [0.13667, 0.63667, 0, 0, 0.77778],
      "10885": [0.25583, 0.75583, 0, 0, 0.77778],
      "10886": [0.25583, 0.75583, 0, 0, 0.77778],
      "10887": [0.13597, 0.63597, 0, 0, 0.77778],
      "10888": [0.13597, 0.63597, 0, 0, 0.77778],
      "10889": [0.26167, 0.75726, 0, 0, 0.77778],
      "10890": [0.26167, 0.75726, 0, 0, 0.77778],
      "10891": [0.48256, 0.98256, 0, 0, 0.77778],
      "10892": [0.48256, 0.98256, 0, 0, 0.77778],
      "10901": [0.13667, 0.63667, 0, 0, 0.77778],
      "10902": [0.13667, 0.63667, 0, 0, 0.77778],
      "10933": [0.25142, 0.75726, 0, 0, 0.77778],
      "10934": [0.25142, 0.75726, 0, 0, 0.77778],
      "10935": [0.26167, 0.75726, 0, 0, 0.77778],
      "10936": [0.26167, 0.75726, 0, 0, 0.77778],
      "10937": [0.26167, 0.75726, 0, 0, 0.77778],
      "10938": [0.26167, 0.75726, 0, 0, 0.77778],
      "10949": [0.25583, 0.75583, 0, 0, 0.77778],
      "10950": [0.25583, 0.75583, 0, 0, 0.77778],
      "10955": [0.28481, 0.79383, 0, 0, 0.77778],
      "10956": [0.28481, 0.79383, 0, 0, 0.77778],
      "57350": [0.08167, 0.58167, 0, 0, 0.22222],
      "57351": [0.08167, 0.58167, 0, 0, 0.38889],
      "57352": [0.08167, 0.58167, 0, 0, 0.77778],
      "57353": [0, 0.43056, 0.04028, 0, 0.66667],
      "57356": [0.25142, 0.75726, 0, 0, 0.77778],
      "57357": [0.25142, 0.75726, 0, 0, 0.77778],
      "57358": [0.41951, 0.91951, 0, 0, 0.77778],
      "57359": [0.30274, 0.79383, 0, 0, 0.77778],
      "57360": [0.30274, 0.79383, 0, 0, 0.77778],
      "57361": [0.41951, 0.91951, 0, 0, 0.77778],
      "57366": [0.25142, 0.75726, 0, 0, 0.77778],
      "57367": [0.25142, 0.75726, 0, 0, 0.77778],
      "57368": [0.25142, 0.75726, 0, 0, 0.77778],
      "57369": [0.25142, 0.75726, 0, 0, 0.77778],
      "57370": [0.13597, 0.63597, 0, 0, 0.77778],
      "57371": [0.13597, 0.63597, 0, 0, 0.77778]
    },
    "Caligraphic-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "65": [0, 0.68333, 0, 0.19445, 0.79847],
      "66": [0, 0.68333, 0.03041, 0.13889, 0.65681],
      "67": [0, 0.68333, 0.05834, 0.13889, 0.52653],
      "68": [0, 0.68333, 0.02778, 0.08334, 0.77139],
      "69": [0, 0.68333, 0.08944, 0.11111, 0.52778],
      "70": [0, 0.68333, 0.09931, 0.11111, 0.71875],
      "71": [0.09722, 0.68333, 0.0593, 0.11111, 0.59487],
      "72": [0, 0.68333, 965e-5, 0.11111, 0.84452],
      "73": [0, 0.68333, 0.07382, 0, 0.54452],
      "74": [0.09722, 0.68333, 0.18472, 0.16667, 0.67778],
      "75": [0, 0.68333, 0.01445, 0.05556, 0.76195],
      "76": [0, 0.68333, 0, 0.13889, 0.68972],
      "77": [0, 0.68333, 0, 0.13889, 1.2009],
      "78": [0, 0.68333, 0.14736, 0.08334, 0.82049],
      "79": [0, 0.68333, 0.02778, 0.11111, 0.79611],
      "80": [0, 0.68333, 0.08222, 0.08334, 0.69556],
      "81": [0.09722, 0.68333, 0, 0.11111, 0.81667],
      "82": [0, 0.68333, 0, 0.08334, 0.8475],
      "83": [0, 0.68333, 0.075, 0.13889, 0.60556],
      "84": [0, 0.68333, 0.25417, 0, 0.54464],
      "85": [0, 0.68333, 0.09931, 0.08334, 0.62583],
      "86": [0, 0.68333, 0.08222, 0, 0.61278],
      "87": [0, 0.68333, 0.08222, 0.08334, 0.98778],
      "88": [0, 0.68333, 0.14643, 0.13889, 0.7133],
      "89": [0.09722, 0.68333, 0.08222, 0.08334, 0.66834],
      "90": [0, 0.68333, 0.07944, 0.13889, 0.72473],
      "160": [0, 0, 0, 0, 0.25]
    },
    "Fraktur-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69141, 0, 0, 0.29574],
      "34": [0, 0.69141, 0, 0, 0.21471],
      "38": [0, 0.69141, 0, 0, 0.73786],
      "39": [0, 0.69141, 0, 0, 0.21201],
      "40": [0.24982, 0.74947, 0, 0, 0.38865],
      "41": [0.24982, 0.74947, 0, 0, 0.38865],
      "42": [0, 0.62119, 0, 0, 0.27764],
      "43": [0.08319, 0.58283, 0, 0, 0.75623],
      "44": [0, 0.10803, 0, 0, 0.27764],
      "45": [0.08319, 0.58283, 0, 0, 0.75623],
      "46": [0, 0.10803, 0, 0, 0.27764],
      "47": [0.24982, 0.74947, 0, 0, 0.50181],
      "48": [0, 0.47534, 0, 0, 0.50181],
      "49": [0, 0.47534, 0, 0, 0.50181],
      "50": [0, 0.47534, 0, 0, 0.50181],
      "51": [0.18906, 0.47534, 0, 0, 0.50181],
      "52": [0.18906, 0.47534, 0, 0, 0.50181],
      "53": [0.18906, 0.47534, 0, 0, 0.50181],
      "54": [0, 0.69141, 0, 0, 0.50181],
      "55": [0.18906, 0.47534, 0, 0, 0.50181],
      "56": [0, 0.69141, 0, 0, 0.50181],
      "57": [0.18906, 0.47534, 0, 0, 0.50181],
      "58": [0, 0.47534, 0, 0, 0.21606],
      "59": [0.12604, 0.47534, 0, 0, 0.21606],
      "61": [-0.13099, 0.36866, 0, 0, 0.75623],
      "63": [0, 0.69141, 0, 0, 0.36245],
      "65": [0, 0.69141, 0, 0, 0.7176],
      "66": [0, 0.69141, 0, 0, 0.88397],
      "67": [0, 0.69141, 0, 0, 0.61254],
      "68": [0, 0.69141, 0, 0, 0.83158],
      "69": [0, 0.69141, 0, 0, 0.66278],
      "70": [0.12604, 0.69141, 0, 0, 0.61119],
      "71": [0, 0.69141, 0, 0, 0.78539],
      "72": [0.06302, 0.69141, 0, 0, 0.7203],
      "73": [0, 0.69141, 0, 0, 0.55448],
      "74": [0.12604, 0.69141, 0, 0, 0.55231],
      "75": [0, 0.69141, 0, 0, 0.66845],
      "76": [0, 0.69141, 0, 0, 0.66602],
      "77": [0, 0.69141, 0, 0, 1.04953],
      "78": [0, 0.69141, 0, 0, 0.83212],
      "79": [0, 0.69141, 0, 0, 0.82699],
      "80": [0.18906, 0.69141, 0, 0, 0.82753],
      "81": [0.03781, 0.69141, 0, 0, 0.82699],
      "82": [0, 0.69141, 0, 0, 0.82807],
      "83": [0, 0.69141, 0, 0, 0.82861],
      "84": [0, 0.69141, 0, 0, 0.66899],
      "85": [0, 0.69141, 0, 0, 0.64576],
      "86": [0, 0.69141, 0, 0, 0.83131],
      "87": [0, 0.69141, 0, 0, 1.04602],
      "88": [0, 0.69141, 0, 0, 0.71922],
      "89": [0.18906, 0.69141, 0, 0, 0.83293],
      "90": [0.12604, 0.69141, 0, 0, 0.60201],
      "91": [0.24982, 0.74947, 0, 0, 0.27764],
      "93": [0.24982, 0.74947, 0, 0, 0.27764],
      "94": [0, 0.69141, 0, 0, 0.49965],
      "97": [0, 0.47534, 0, 0, 0.50046],
      "98": [0, 0.69141, 0, 0, 0.51315],
      "99": [0, 0.47534, 0, 0, 0.38946],
      "100": [0, 0.62119, 0, 0, 0.49857],
      "101": [0, 0.47534, 0, 0, 0.40053],
      "102": [0.18906, 0.69141, 0, 0, 0.32626],
      "103": [0.18906, 0.47534, 0, 0, 0.5037],
      "104": [0.18906, 0.69141, 0, 0, 0.52126],
      "105": [0, 0.69141, 0, 0, 0.27899],
      "106": [0, 0.69141, 0, 0, 0.28088],
      "107": [0, 0.69141, 0, 0, 0.38946],
      "108": [0, 0.69141, 0, 0, 0.27953],
      "109": [0, 0.47534, 0, 0, 0.76676],
      "110": [0, 0.47534, 0, 0, 0.52666],
      "111": [0, 0.47534, 0, 0, 0.48885],
      "112": [0.18906, 0.52396, 0, 0, 0.50046],
      "113": [0.18906, 0.47534, 0, 0, 0.48912],
      "114": [0, 0.47534, 0, 0, 0.38919],
      "115": [0, 0.47534, 0, 0, 0.44266],
      "116": [0, 0.62119, 0, 0, 0.33301],
      "117": [0, 0.47534, 0, 0, 0.5172],
      "118": [0, 0.52396, 0, 0, 0.5118],
      "119": [0, 0.52396, 0, 0, 0.77351],
      "120": [0.18906, 0.47534, 0, 0, 0.38865],
      "121": [0.18906, 0.47534, 0, 0, 0.49884],
      "122": [0.18906, 0.47534, 0, 0, 0.39054],
      "160": [0, 0, 0, 0, 0.25],
      "8216": [0, 0.69141, 0, 0, 0.21471],
      "8217": [0, 0.69141, 0, 0, 0.21471],
      "58112": [0, 0.62119, 0, 0, 0.49749],
      "58113": [0, 0.62119, 0, 0, 0.4983],
      "58114": [0.18906, 0.69141, 0, 0, 0.33328],
      "58115": [0.18906, 0.69141, 0, 0, 0.32923],
      "58116": [0.18906, 0.47534, 0, 0, 0.50343],
      "58117": [0, 0.69141, 0, 0, 0.33301],
      "58118": [0, 0.62119, 0, 0, 0.33409],
      "58119": [0, 0.47534, 0, 0, 0.50073]
    },
    "Main-Bold": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69444, 0, 0, 0.35],
      "34": [0, 0.69444, 0, 0, 0.60278],
      "35": [0.19444, 0.69444, 0, 0, 0.95833],
      "36": [0.05556, 0.75, 0, 0, 0.575],
      "37": [0.05556, 0.75, 0, 0, 0.95833],
      "38": [0, 0.69444, 0, 0, 0.89444],
      "39": [0, 0.69444, 0, 0, 0.31944],
      "40": [0.25, 0.75, 0, 0, 0.44722],
      "41": [0.25, 0.75, 0, 0, 0.44722],
      "42": [0, 0.75, 0, 0, 0.575],
      "43": [0.13333, 0.63333, 0, 0, 0.89444],
      "44": [0.19444, 0.15556, 0, 0, 0.31944],
      "45": [0, 0.44444, 0, 0, 0.38333],
      "46": [0, 0.15556, 0, 0, 0.31944],
      "47": [0.25, 0.75, 0, 0, 0.575],
      "48": [0, 0.64444, 0, 0, 0.575],
      "49": [0, 0.64444, 0, 0, 0.575],
      "50": [0, 0.64444, 0, 0, 0.575],
      "51": [0, 0.64444, 0, 0, 0.575],
      "52": [0, 0.64444, 0, 0, 0.575],
      "53": [0, 0.64444, 0, 0, 0.575],
      "54": [0, 0.64444, 0, 0, 0.575],
      "55": [0, 0.64444, 0, 0, 0.575],
      "56": [0, 0.64444, 0, 0, 0.575],
      "57": [0, 0.64444, 0, 0, 0.575],
      "58": [0, 0.44444, 0, 0, 0.31944],
      "59": [0.19444, 0.44444, 0, 0, 0.31944],
      "60": [0.08556, 0.58556, 0, 0, 0.89444],
      "61": [-0.10889, 0.39111, 0, 0, 0.89444],
      "62": [0.08556, 0.58556, 0, 0, 0.89444],
      "63": [0, 0.69444, 0, 0, 0.54305],
      "64": [0, 0.69444, 0, 0, 0.89444],
      "65": [0, 0.68611, 0, 0, 0.86944],
      "66": [0, 0.68611, 0, 0, 0.81805],
      "67": [0, 0.68611, 0, 0, 0.83055],
      "68": [0, 0.68611, 0, 0, 0.88194],
      "69": [0, 0.68611, 0, 0, 0.75555],
      "70": [0, 0.68611, 0, 0, 0.72361],
      "71": [0, 0.68611, 0, 0, 0.90416],
      "72": [0, 0.68611, 0, 0, 0.9],
      "73": [0, 0.68611, 0, 0, 0.43611],
      "74": [0, 0.68611, 0, 0, 0.59444],
      "75": [0, 0.68611, 0, 0, 0.90138],
      "76": [0, 0.68611, 0, 0, 0.69166],
      "77": [0, 0.68611, 0, 0, 1.09166],
      "78": [0, 0.68611, 0, 0, 0.9],
      "79": [0, 0.68611, 0, 0, 0.86388],
      "80": [0, 0.68611, 0, 0, 0.78611],
      "81": [0.19444, 0.68611, 0, 0, 0.86388],
      "82": [0, 0.68611, 0, 0, 0.8625],
      "83": [0, 0.68611, 0, 0, 0.63889],
      "84": [0, 0.68611, 0, 0, 0.8],
      "85": [0, 0.68611, 0, 0, 0.88472],
      "86": [0, 0.68611, 0.01597, 0, 0.86944],
      "87": [0, 0.68611, 0.01597, 0, 1.18888],
      "88": [0, 0.68611, 0, 0, 0.86944],
      "89": [0, 0.68611, 0.02875, 0, 0.86944],
      "90": [0, 0.68611, 0, 0, 0.70277],
      "91": [0.25, 0.75, 0, 0, 0.31944],
      "92": [0.25, 0.75, 0, 0, 0.575],
      "93": [0.25, 0.75, 0, 0, 0.31944],
      "94": [0, 0.69444, 0, 0, 0.575],
      "95": [0.31, 0.13444, 0.03194, 0, 0.575],
      "97": [0, 0.44444, 0, 0, 0.55902],
      "98": [0, 0.69444, 0, 0, 0.63889],
      "99": [0, 0.44444, 0, 0, 0.51111],
      "100": [0, 0.69444, 0, 0, 0.63889],
      "101": [0, 0.44444, 0, 0, 0.52708],
      "102": [0, 0.69444, 0.10903, 0, 0.35139],
      "103": [0.19444, 0.44444, 0.01597, 0, 0.575],
      "104": [0, 0.69444, 0, 0, 0.63889],
      "105": [0, 0.69444, 0, 0, 0.31944],
      "106": [0.19444, 0.69444, 0, 0, 0.35139],
      "107": [0, 0.69444, 0, 0, 0.60694],
      "108": [0, 0.69444, 0, 0, 0.31944],
      "109": [0, 0.44444, 0, 0, 0.95833],
      "110": [0, 0.44444, 0, 0, 0.63889],
      "111": [0, 0.44444, 0, 0, 0.575],
      "112": [0.19444, 0.44444, 0, 0, 0.63889],
      "113": [0.19444, 0.44444, 0, 0, 0.60694],
      "114": [0, 0.44444, 0, 0, 0.47361],
      "115": [0, 0.44444, 0, 0, 0.45361],
      "116": [0, 0.63492, 0, 0, 0.44722],
      "117": [0, 0.44444, 0, 0, 0.63889],
      "118": [0, 0.44444, 0.01597, 0, 0.60694],
      "119": [0, 0.44444, 0.01597, 0, 0.83055],
      "120": [0, 0.44444, 0, 0, 0.60694],
      "121": [0.19444, 0.44444, 0.01597, 0, 0.60694],
      "122": [0, 0.44444, 0, 0, 0.51111],
      "123": [0.25, 0.75, 0, 0, 0.575],
      "124": [0.25, 0.75, 0, 0, 0.31944],
      "125": [0.25, 0.75, 0, 0, 0.575],
      "126": [0.35, 0.34444, 0, 0, 0.575],
      "160": [0, 0, 0, 0, 0.25],
      "163": [0, 0.69444, 0, 0, 0.86853],
      "168": [0, 0.69444, 0, 0, 0.575],
      "172": [0, 0.44444, 0, 0, 0.76666],
      "176": [0, 0.69444, 0, 0, 0.86944],
      "177": [0.13333, 0.63333, 0, 0, 0.89444],
      "184": [0.17014, 0, 0, 0, 0.51111],
      "198": [0, 0.68611, 0, 0, 1.04166],
      "215": [0.13333, 0.63333, 0, 0, 0.89444],
      "216": [0.04861, 0.73472, 0, 0, 0.89444],
      "223": [0, 0.69444, 0, 0, 0.59722],
      "230": [0, 0.44444, 0, 0, 0.83055],
      "247": [0.13333, 0.63333, 0, 0, 0.89444],
      "248": [0.09722, 0.54167, 0, 0, 0.575],
      "305": [0, 0.44444, 0, 0, 0.31944],
      "338": [0, 0.68611, 0, 0, 1.16944],
      "339": [0, 0.44444, 0, 0, 0.89444],
      "567": [0.19444, 0.44444, 0, 0, 0.35139],
      "710": [0, 0.69444, 0, 0, 0.575],
      "711": [0, 0.63194, 0, 0, 0.575],
      "713": [0, 0.59611, 0, 0, 0.575],
      "714": [0, 0.69444, 0, 0, 0.575],
      "715": [0, 0.69444, 0, 0, 0.575],
      "728": [0, 0.69444, 0, 0, 0.575],
      "729": [0, 0.69444, 0, 0, 0.31944],
      "730": [0, 0.69444, 0, 0, 0.86944],
      "732": [0, 0.69444, 0, 0, 0.575],
      "733": [0, 0.69444, 0, 0, 0.575],
      "915": [0, 0.68611, 0, 0, 0.69166],
      "916": [0, 0.68611, 0, 0, 0.95833],
      "920": [0, 0.68611, 0, 0, 0.89444],
      "923": [0, 0.68611, 0, 0, 0.80555],
      "926": [0, 0.68611, 0, 0, 0.76666],
      "928": [0, 0.68611, 0, 0, 0.9],
      "931": [0, 0.68611, 0, 0, 0.83055],
      "933": [0, 0.68611, 0, 0, 0.89444],
      "934": [0, 0.68611, 0, 0, 0.83055],
      "936": [0, 0.68611, 0, 0, 0.89444],
      "937": [0, 0.68611, 0, 0, 0.83055],
      "8211": [0, 0.44444, 0.03194, 0, 0.575],
      "8212": [0, 0.44444, 0.03194, 0, 1.14999],
      "8216": [0, 0.69444, 0, 0, 0.31944],
      "8217": [0, 0.69444, 0, 0, 0.31944],
      "8220": [0, 0.69444, 0, 0, 0.60278],
      "8221": [0, 0.69444, 0, 0, 0.60278],
      "8224": [0.19444, 0.69444, 0, 0, 0.51111],
      "8225": [0.19444, 0.69444, 0, 0, 0.51111],
      "8242": [0, 0.55556, 0, 0, 0.34444],
      "8407": [0, 0.72444, 0.15486, 0, 0.575],
      "8463": [0, 0.69444, 0, 0, 0.66759],
      "8465": [0, 0.69444, 0, 0, 0.83055],
      "8467": [0, 0.69444, 0, 0, 0.47361],
      "8472": [0.19444, 0.44444, 0, 0, 0.74027],
      "8476": [0, 0.69444, 0, 0, 0.83055],
      "8501": [0, 0.69444, 0, 0, 0.70277],
      "8592": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8593": [0.19444, 0.69444, 0, 0, 0.575],
      "8594": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8595": [0.19444, 0.69444, 0, 0, 0.575],
      "8596": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8597": [0.25, 0.75, 0, 0, 0.575],
      "8598": [0.19444, 0.69444, 0, 0, 1.14999],
      "8599": [0.19444, 0.69444, 0, 0, 1.14999],
      "8600": [0.19444, 0.69444, 0, 0, 1.14999],
      "8601": [0.19444, 0.69444, 0, 0, 1.14999],
      "8636": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8637": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8640": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8641": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8656": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8657": [0.19444, 0.69444, 0, 0, 0.70277],
      "8658": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8659": [0.19444, 0.69444, 0, 0, 0.70277],
      "8660": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8661": [0.25, 0.75, 0, 0, 0.70277],
      "8704": [0, 0.69444, 0, 0, 0.63889],
      "8706": [0, 0.69444, 0.06389, 0, 0.62847],
      "8707": [0, 0.69444, 0, 0, 0.63889],
      "8709": [0.05556, 0.75, 0, 0, 0.575],
      "8711": [0, 0.68611, 0, 0, 0.95833],
      "8712": [0.08556, 0.58556, 0, 0, 0.76666],
      "8715": [0.08556, 0.58556, 0, 0, 0.76666],
      "8722": [0.13333, 0.63333, 0, 0, 0.89444],
      "8723": [0.13333, 0.63333, 0, 0, 0.89444],
      "8725": [0.25, 0.75, 0, 0, 0.575],
      "8726": [0.25, 0.75, 0, 0, 0.575],
      "8727": [-0.02778, 0.47222, 0, 0, 0.575],
      "8728": [-0.02639, 0.47361, 0, 0, 0.575],
      "8729": [-0.02639, 0.47361, 0, 0, 0.575],
      "8730": [0.18, 0.82, 0, 0, 0.95833],
      "8733": [0, 0.44444, 0, 0, 0.89444],
      "8734": [0, 0.44444, 0, 0, 1.14999],
      "8736": [0, 0.69224, 0, 0, 0.72222],
      "8739": [0.25, 0.75, 0, 0, 0.31944],
      "8741": [0.25, 0.75, 0, 0, 0.575],
      "8743": [0, 0.55556, 0, 0, 0.76666],
      "8744": [0, 0.55556, 0, 0, 0.76666],
      "8745": [0, 0.55556, 0, 0, 0.76666],
      "8746": [0, 0.55556, 0, 0, 0.76666],
      "8747": [0.19444, 0.69444, 0.12778, 0, 0.56875],
      "8764": [-0.10889, 0.39111, 0, 0, 0.89444],
      "8768": [0.19444, 0.69444, 0, 0, 0.31944],
      "8771": [222e-5, 0.50222, 0, 0, 0.89444],
      "8773": [0.027, 0.638, 0, 0, 0.894],
      "8776": [0.02444, 0.52444, 0, 0, 0.89444],
      "8781": [222e-5, 0.50222, 0, 0, 0.89444],
      "8801": [222e-5, 0.50222, 0, 0, 0.89444],
      "8804": [0.19667, 0.69667, 0, 0, 0.89444],
      "8805": [0.19667, 0.69667, 0, 0, 0.89444],
      "8810": [0.08556, 0.58556, 0, 0, 1.14999],
      "8811": [0.08556, 0.58556, 0, 0, 1.14999],
      "8826": [0.08556, 0.58556, 0, 0, 0.89444],
      "8827": [0.08556, 0.58556, 0, 0, 0.89444],
      "8834": [0.08556, 0.58556, 0, 0, 0.89444],
      "8835": [0.08556, 0.58556, 0, 0, 0.89444],
      "8838": [0.19667, 0.69667, 0, 0, 0.89444],
      "8839": [0.19667, 0.69667, 0, 0, 0.89444],
      "8846": [0, 0.55556, 0, 0, 0.76666],
      "8849": [0.19667, 0.69667, 0, 0, 0.89444],
      "8850": [0.19667, 0.69667, 0, 0, 0.89444],
      "8851": [0, 0.55556, 0, 0, 0.76666],
      "8852": [0, 0.55556, 0, 0, 0.76666],
      "8853": [0.13333, 0.63333, 0, 0, 0.89444],
      "8854": [0.13333, 0.63333, 0, 0, 0.89444],
      "8855": [0.13333, 0.63333, 0, 0, 0.89444],
      "8856": [0.13333, 0.63333, 0, 0, 0.89444],
      "8857": [0.13333, 0.63333, 0, 0, 0.89444],
      "8866": [0, 0.69444, 0, 0, 0.70277],
      "8867": [0, 0.69444, 0, 0, 0.70277],
      "8868": [0, 0.69444, 0, 0, 0.89444],
      "8869": [0, 0.69444, 0, 0, 0.89444],
      "8900": [-0.02639, 0.47361, 0, 0, 0.575],
      "8901": [-0.02639, 0.47361, 0, 0, 0.31944],
      "8902": [-0.02778, 0.47222, 0, 0, 0.575],
      "8968": [0.25, 0.75, 0, 0, 0.51111],
      "8969": [0.25, 0.75, 0, 0, 0.51111],
      "8970": [0.25, 0.75, 0, 0, 0.51111],
      "8971": [0.25, 0.75, 0, 0, 0.51111],
      "8994": [-0.13889, 0.36111, 0, 0, 1.14999],
      "8995": [-0.13889, 0.36111, 0, 0, 1.14999],
      "9651": [0.19444, 0.69444, 0, 0, 1.02222],
      "9657": [-0.02778, 0.47222, 0, 0, 0.575],
      "9661": [0.19444, 0.69444, 0, 0, 1.02222],
      "9667": [-0.02778, 0.47222, 0, 0, 0.575],
      "9711": [0.19444, 0.69444, 0, 0, 1.14999],
      "9824": [0.12963, 0.69444, 0, 0, 0.89444],
      "9825": [0.12963, 0.69444, 0, 0, 0.89444],
      "9826": [0.12963, 0.69444, 0, 0, 0.89444],
      "9827": [0.12963, 0.69444, 0, 0, 0.89444],
      "9837": [0, 0.75, 0, 0, 0.44722],
      "9838": [0.19444, 0.69444, 0, 0, 0.44722],
      "9839": [0.19444, 0.69444, 0, 0, 0.44722],
      "10216": [0.25, 0.75, 0, 0, 0.44722],
      "10217": [0.25, 0.75, 0, 0, 0.44722],
      "10815": [0, 0.68611, 0, 0, 0.9],
      "10927": [0.19667, 0.69667, 0, 0, 0.89444],
      "10928": [0.19667, 0.69667, 0, 0, 0.89444],
      "57376": [0.19444, 0.69444, 0, 0, 0]
    },
    "Main-BoldItalic": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69444, 0.11417, 0, 0.38611],
      "34": [0, 0.69444, 0.07939, 0, 0.62055],
      "35": [0.19444, 0.69444, 0.06833, 0, 0.94444],
      "37": [0.05556, 0.75, 0.12861, 0, 0.94444],
      "38": [0, 0.69444, 0.08528, 0, 0.88555],
      "39": [0, 0.69444, 0.12945, 0, 0.35555],
      "40": [0.25, 0.75, 0.15806, 0, 0.47333],
      "41": [0.25, 0.75, 0.03306, 0, 0.47333],
      "42": [0, 0.75, 0.14333, 0, 0.59111],
      "43": [0.10333, 0.60333, 0.03306, 0, 0.88555],
      "44": [0.19444, 0.14722, 0, 0, 0.35555],
      "45": [0, 0.44444, 0.02611, 0, 0.41444],
      "46": [0, 0.14722, 0, 0, 0.35555],
      "47": [0.25, 0.75, 0.15806, 0, 0.59111],
      "48": [0, 0.64444, 0.13167, 0, 0.59111],
      "49": [0, 0.64444, 0.13167, 0, 0.59111],
      "50": [0, 0.64444, 0.13167, 0, 0.59111],
      "51": [0, 0.64444, 0.13167, 0, 0.59111],
      "52": [0.19444, 0.64444, 0.13167, 0, 0.59111],
      "53": [0, 0.64444, 0.13167, 0, 0.59111],
      "54": [0, 0.64444, 0.13167, 0, 0.59111],
      "55": [0.19444, 0.64444, 0.13167, 0, 0.59111],
      "56": [0, 0.64444, 0.13167, 0, 0.59111],
      "57": [0, 0.64444, 0.13167, 0, 0.59111],
      "58": [0, 0.44444, 0.06695, 0, 0.35555],
      "59": [0.19444, 0.44444, 0.06695, 0, 0.35555],
      "61": [-0.10889, 0.39111, 0.06833, 0, 0.88555],
      "63": [0, 0.69444, 0.11472, 0, 0.59111],
      "64": [0, 0.69444, 0.09208, 0, 0.88555],
      "65": [0, 0.68611, 0, 0, 0.86555],
      "66": [0, 0.68611, 0.0992, 0, 0.81666],
      "67": [0, 0.68611, 0.14208, 0, 0.82666],
      "68": [0, 0.68611, 0.09062, 0, 0.87555],
      "69": [0, 0.68611, 0.11431, 0, 0.75666],
      "70": [0, 0.68611, 0.12903, 0, 0.72722],
      "71": [0, 0.68611, 0.07347, 0, 0.89527],
      "72": [0, 0.68611, 0.17208, 0, 0.8961],
      "73": [0, 0.68611, 0.15681, 0, 0.47166],
      "74": [0, 0.68611, 0.145, 0, 0.61055],
      "75": [0, 0.68611, 0.14208, 0, 0.89499],
      "76": [0, 0.68611, 0, 0, 0.69777],
      "77": [0, 0.68611, 0.17208, 0, 1.07277],
      "78": [0, 0.68611, 0.17208, 0, 0.8961],
      "79": [0, 0.68611, 0.09062, 0, 0.85499],
      "80": [0, 0.68611, 0.0992, 0, 0.78721],
      "81": [0.19444, 0.68611, 0.09062, 0, 0.85499],
      "82": [0, 0.68611, 0.02559, 0, 0.85944],
      "83": [0, 0.68611, 0.11264, 0, 0.64999],
      "84": [0, 0.68611, 0.12903, 0, 0.7961],
      "85": [0, 0.68611, 0.17208, 0, 0.88083],
      "86": [0, 0.68611, 0.18625, 0, 0.86555],
      "87": [0, 0.68611, 0.18625, 0, 1.15999],
      "88": [0, 0.68611, 0.15681, 0, 0.86555],
      "89": [0, 0.68611, 0.19803, 0, 0.86555],
      "90": [0, 0.68611, 0.14208, 0, 0.70888],
      "91": [0.25, 0.75, 0.1875, 0, 0.35611],
      "93": [0.25, 0.75, 0.09972, 0, 0.35611],
      "94": [0, 0.69444, 0.06709, 0, 0.59111],
      "95": [0.31, 0.13444, 0.09811, 0, 0.59111],
      "97": [0, 0.44444, 0.09426, 0, 0.59111],
      "98": [0, 0.69444, 0.07861, 0, 0.53222],
      "99": [0, 0.44444, 0.05222, 0, 0.53222],
      "100": [0, 0.69444, 0.10861, 0, 0.59111],
      "101": [0, 0.44444, 0.085, 0, 0.53222],
      "102": [0.19444, 0.69444, 0.21778, 0, 0.4],
      "103": [0.19444, 0.44444, 0.105, 0, 0.53222],
      "104": [0, 0.69444, 0.09426, 0, 0.59111],
      "105": [0, 0.69326, 0.11387, 0, 0.35555],
      "106": [0.19444, 0.69326, 0.1672, 0, 0.35555],
      "107": [0, 0.69444, 0.11111, 0, 0.53222],
      "108": [0, 0.69444, 0.10861, 0, 0.29666],
      "109": [0, 0.44444, 0.09426, 0, 0.94444],
      "110": [0, 0.44444, 0.09426, 0, 0.64999],
      "111": [0, 0.44444, 0.07861, 0, 0.59111],
      "112": [0.19444, 0.44444, 0.07861, 0, 0.59111],
      "113": [0.19444, 0.44444, 0.105, 0, 0.53222],
      "114": [0, 0.44444, 0.11111, 0, 0.50167],
      "115": [0, 0.44444, 0.08167, 0, 0.48694],
      "116": [0, 0.63492, 0.09639, 0, 0.385],
      "117": [0, 0.44444, 0.09426, 0, 0.62055],
      "118": [0, 0.44444, 0.11111, 0, 0.53222],
      "119": [0, 0.44444, 0.11111, 0, 0.76777],
      "120": [0, 0.44444, 0.12583, 0, 0.56055],
      "121": [0.19444, 0.44444, 0.105, 0, 0.56166],
      "122": [0, 0.44444, 0.13889, 0, 0.49055],
      "126": [0.35, 0.34444, 0.11472, 0, 0.59111],
      "160": [0, 0, 0, 0, 0.25],
      "168": [0, 0.69444, 0.11473, 0, 0.59111],
      "176": [0, 0.69444, 0, 0, 0.94888],
      "184": [0.17014, 0, 0, 0, 0.53222],
      "198": [0, 0.68611, 0.11431, 0, 1.02277],
      "216": [0.04861, 0.73472, 0.09062, 0, 0.88555],
      "223": [0.19444, 0.69444, 0.09736, 0, 0.665],
      "230": [0, 0.44444, 0.085, 0, 0.82666],
      "248": [0.09722, 0.54167, 0.09458, 0, 0.59111],
      "305": [0, 0.44444, 0.09426, 0, 0.35555],
      "338": [0, 0.68611, 0.11431, 0, 1.14054],
      "339": [0, 0.44444, 0.085, 0, 0.82666],
      "567": [0.19444, 0.44444, 0.04611, 0, 0.385],
      "710": [0, 0.69444, 0.06709, 0, 0.59111],
      "711": [0, 0.63194, 0.08271, 0, 0.59111],
      "713": [0, 0.59444, 0.10444, 0, 0.59111],
      "714": [0, 0.69444, 0.08528, 0, 0.59111],
      "715": [0, 0.69444, 0, 0, 0.59111],
      "728": [0, 0.69444, 0.10333, 0, 0.59111],
      "729": [0, 0.69444, 0.12945, 0, 0.35555],
      "730": [0, 0.69444, 0, 0, 0.94888],
      "732": [0, 0.69444, 0.11472, 0, 0.59111],
      "733": [0, 0.69444, 0.11472, 0, 0.59111],
      "915": [0, 0.68611, 0.12903, 0, 0.69777],
      "916": [0, 0.68611, 0, 0, 0.94444],
      "920": [0, 0.68611, 0.09062, 0, 0.88555],
      "923": [0, 0.68611, 0, 0, 0.80666],
      "926": [0, 0.68611, 0.15092, 0, 0.76777],
      "928": [0, 0.68611, 0.17208, 0, 0.8961],
      "931": [0, 0.68611, 0.11431, 0, 0.82666],
      "933": [0, 0.68611, 0.10778, 0, 0.88555],
      "934": [0, 0.68611, 0.05632, 0, 0.82666],
      "936": [0, 0.68611, 0.10778, 0, 0.88555],
      "937": [0, 0.68611, 0.0992, 0, 0.82666],
      "8211": [0, 0.44444, 0.09811, 0, 0.59111],
      "8212": [0, 0.44444, 0.09811, 0, 1.18221],
      "8216": [0, 0.69444, 0.12945, 0, 0.35555],
      "8217": [0, 0.69444, 0.12945, 0, 0.35555],
      "8220": [0, 0.69444, 0.16772, 0, 0.62055],
      "8221": [0, 0.69444, 0.07939, 0, 0.62055]
    },
    "Main-Italic": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69444, 0.12417, 0, 0.30667],
      "34": [0, 0.69444, 0.06961, 0, 0.51444],
      "35": [0.19444, 0.69444, 0.06616, 0, 0.81777],
      "37": [0.05556, 0.75, 0.13639, 0, 0.81777],
      "38": [0, 0.69444, 0.09694, 0, 0.76666],
      "39": [0, 0.69444, 0.12417, 0, 0.30667],
      "40": [0.25, 0.75, 0.16194, 0, 0.40889],
      "41": [0.25, 0.75, 0.03694, 0, 0.40889],
      "42": [0, 0.75, 0.14917, 0, 0.51111],
      "43": [0.05667, 0.56167, 0.03694, 0, 0.76666],
      "44": [0.19444, 0.10556, 0, 0, 0.30667],
      "45": [0, 0.43056, 0.02826, 0, 0.35778],
      "46": [0, 0.10556, 0, 0, 0.30667],
      "47": [0.25, 0.75, 0.16194, 0, 0.51111],
      "48": [0, 0.64444, 0.13556, 0, 0.51111],
      "49": [0, 0.64444, 0.13556, 0, 0.51111],
      "50": [0, 0.64444, 0.13556, 0, 0.51111],
      "51": [0, 0.64444, 0.13556, 0, 0.51111],
      "52": [0.19444, 0.64444, 0.13556, 0, 0.51111],
      "53": [0, 0.64444, 0.13556, 0, 0.51111],
      "54": [0, 0.64444, 0.13556, 0, 0.51111],
      "55": [0.19444, 0.64444, 0.13556, 0, 0.51111],
      "56": [0, 0.64444, 0.13556, 0, 0.51111],
      "57": [0, 0.64444, 0.13556, 0, 0.51111],
      "58": [0, 0.43056, 0.0582, 0, 0.30667],
      "59": [0.19444, 0.43056, 0.0582, 0, 0.30667],
      "61": [-0.13313, 0.36687, 0.06616, 0, 0.76666],
      "63": [0, 0.69444, 0.1225, 0, 0.51111],
      "64": [0, 0.69444, 0.09597, 0, 0.76666],
      "65": [0, 0.68333, 0, 0, 0.74333],
      "66": [0, 0.68333, 0.10257, 0, 0.70389],
      "67": [0, 0.68333, 0.14528, 0, 0.71555],
      "68": [0, 0.68333, 0.09403, 0, 0.755],
      "69": [0, 0.68333, 0.12028, 0, 0.67833],
      "70": [0, 0.68333, 0.13305, 0, 0.65277],
      "71": [0, 0.68333, 0.08722, 0, 0.77361],
      "72": [0, 0.68333, 0.16389, 0, 0.74333],
      "73": [0, 0.68333, 0.15806, 0, 0.38555],
      "74": [0, 0.68333, 0.14028, 0, 0.525],
      "75": [0, 0.68333, 0.14528, 0, 0.76888],
      "76": [0, 0.68333, 0, 0, 0.62722],
      "77": [0, 0.68333, 0.16389, 0, 0.89666],
      "78": [0, 0.68333, 0.16389, 0, 0.74333],
      "79": [0, 0.68333, 0.09403, 0, 0.76666],
      "80": [0, 0.68333, 0.10257, 0, 0.67833],
      "81": [0.19444, 0.68333, 0.09403, 0, 0.76666],
      "82": [0, 0.68333, 0.03868, 0, 0.72944],
      "83": [0, 0.68333, 0.11972, 0, 0.56222],
      "84": [0, 0.68333, 0.13305, 0, 0.71555],
      "85": [0, 0.68333, 0.16389, 0, 0.74333],
      "86": [0, 0.68333, 0.18361, 0, 0.74333],
      "87": [0, 0.68333, 0.18361, 0, 0.99888],
      "88": [0, 0.68333, 0.15806, 0, 0.74333],
      "89": [0, 0.68333, 0.19383, 0, 0.74333],
      "90": [0, 0.68333, 0.14528, 0, 0.61333],
      "91": [0.25, 0.75, 0.1875, 0, 0.30667],
      "93": [0.25, 0.75, 0.10528, 0, 0.30667],
      "94": [0, 0.69444, 0.06646, 0, 0.51111],
      "95": [0.31, 0.12056, 0.09208, 0, 0.51111],
      "97": [0, 0.43056, 0.07671, 0, 0.51111],
      "98": [0, 0.69444, 0.06312, 0, 0.46],
      "99": [0, 0.43056, 0.05653, 0, 0.46],
      "100": [0, 0.69444, 0.10333, 0, 0.51111],
      "101": [0, 0.43056, 0.07514, 0, 0.46],
      "102": [0.19444, 0.69444, 0.21194, 0, 0.30667],
      "103": [0.19444, 0.43056, 0.08847, 0, 0.46],
      "104": [0, 0.69444, 0.07671, 0, 0.51111],
      "105": [0, 0.65536, 0.1019, 0, 0.30667],
      "106": [0.19444, 0.65536, 0.14467, 0, 0.30667],
      "107": [0, 0.69444, 0.10764, 0, 0.46],
      "108": [0, 0.69444, 0.10333, 0, 0.25555],
      "109": [0, 0.43056, 0.07671, 0, 0.81777],
      "110": [0, 0.43056, 0.07671, 0, 0.56222],
      "111": [0, 0.43056, 0.06312, 0, 0.51111],
      "112": [0.19444, 0.43056, 0.06312, 0, 0.51111],
      "113": [0.19444, 0.43056, 0.08847, 0, 0.46],
      "114": [0, 0.43056, 0.10764, 0, 0.42166],
      "115": [0, 0.43056, 0.08208, 0, 0.40889],
      "116": [0, 0.61508, 0.09486, 0, 0.33222],
      "117": [0, 0.43056, 0.07671, 0, 0.53666],
      "118": [0, 0.43056, 0.10764, 0, 0.46],
      "119": [0, 0.43056, 0.10764, 0, 0.66444],
      "120": [0, 0.43056, 0.12042, 0, 0.46389],
      "121": [0.19444, 0.43056, 0.08847, 0, 0.48555],
      "122": [0, 0.43056, 0.12292, 0, 0.40889],
      "126": [0.35, 0.31786, 0.11585, 0, 0.51111],
      "160": [0, 0, 0, 0, 0.25],
      "168": [0, 0.66786, 0.10474, 0, 0.51111],
      "176": [0, 0.69444, 0, 0, 0.83129],
      "184": [0.17014, 0, 0, 0, 0.46],
      "198": [0, 0.68333, 0.12028, 0, 0.88277],
      "216": [0.04861, 0.73194, 0.09403, 0, 0.76666],
      "223": [0.19444, 0.69444, 0.10514, 0, 0.53666],
      "230": [0, 0.43056, 0.07514, 0, 0.71555],
      "248": [0.09722, 0.52778, 0.09194, 0, 0.51111],
      "338": [0, 0.68333, 0.12028, 0, 0.98499],
      "339": [0, 0.43056, 0.07514, 0, 0.71555],
      "710": [0, 0.69444, 0.06646, 0, 0.51111],
      "711": [0, 0.62847, 0.08295, 0, 0.51111],
      "713": [0, 0.56167, 0.10333, 0, 0.51111],
      "714": [0, 0.69444, 0.09694, 0, 0.51111],
      "715": [0, 0.69444, 0, 0, 0.51111],
      "728": [0, 0.69444, 0.10806, 0, 0.51111],
      "729": [0, 0.66786, 0.11752, 0, 0.30667],
      "730": [0, 0.69444, 0, 0, 0.83129],
      "732": [0, 0.66786, 0.11585, 0, 0.51111],
      "733": [0, 0.69444, 0.1225, 0, 0.51111],
      "915": [0, 0.68333, 0.13305, 0, 0.62722],
      "916": [0, 0.68333, 0, 0, 0.81777],
      "920": [0, 0.68333, 0.09403, 0, 0.76666],
      "923": [0, 0.68333, 0, 0, 0.69222],
      "926": [0, 0.68333, 0.15294, 0, 0.66444],
      "928": [0, 0.68333, 0.16389, 0, 0.74333],
      "931": [0, 0.68333, 0.12028, 0, 0.71555],
      "933": [0, 0.68333, 0.11111, 0, 0.76666],
      "934": [0, 0.68333, 0.05986, 0, 0.71555],
      "936": [0, 0.68333, 0.11111, 0, 0.76666],
      "937": [0, 0.68333, 0.10257, 0, 0.71555],
      "8211": [0, 0.43056, 0.09208, 0, 0.51111],
      "8212": [0, 0.43056, 0.09208, 0, 1.02222],
      "8216": [0, 0.69444, 0.12417, 0, 0.30667],
      "8217": [0, 0.69444, 0.12417, 0, 0.30667],
      "8220": [0, 0.69444, 0.1685, 0, 0.51444],
      "8221": [0, 0.69444, 0.06961, 0, 0.51444],
      "8463": [0, 0.68889, 0, 0, 0.54028]
    },
    "Main-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69444, 0, 0, 0.27778],
      "34": [0, 0.69444, 0, 0, 0.5],
      "35": [0.19444, 0.69444, 0, 0, 0.83334],
      "36": [0.05556, 0.75, 0, 0, 0.5],
      "37": [0.05556, 0.75, 0, 0, 0.83334],
      "38": [0, 0.69444, 0, 0, 0.77778],
      "39": [0, 0.69444, 0, 0, 0.27778],
      "40": [0.25, 0.75, 0, 0, 0.38889],
      "41": [0.25, 0.75, 0, 0, 0.38889],
      "42": [0, 0.75, 0, 0, 0.5],
      "43": [0.08333, 0.58333, 0, 0, 0.77778],
      "44": [0.19444, 0.10556, 0, 0, 0.27778],
      "45": [0, 0.43056, 0, 0, 0.33333],
      "46": [0, 0.10556, 0, 0, 0.27778],
      "47": [0.25, 0.75, 0, 0, 0.5],
      "48": [0, 0.64444, 0, 0, 0.5],
      "49": [0, 0.64444, 0, 0, 0.5],
      "50": [0, 0.64444, 0, 0, 0.5],
      "51": [0, 0.64444, 0, 0, 0.5],
      "52": [0, 0.64444, 0, 0, 0.5],
      "53": [0, 0.64444, 0, 0, 0.5],
      "54": [0, 0.64444, 0, 0, 0.5],
      "55": [0, 0.64444, 0, 0, 0.5],
      "56": [0, 0.64444, 0, 0, 0.5],
      "57": [0, 0.64444, 0, 0, 0.5],
      "58": [0, 0.43056, 0, 0, 0.27778],
      "59": [0.19444, 0.43056, 0, 0, 0.27778],
      "60": [0.0391, 0.5391, 0, 0, 0.77778],
      "61": [-0.13313, 0.36687, 0, 0, 0.77778],
      "62": [0.0391, 0.5391, 0, 0, 0.77778],
      "63": [0, 0.69444, 0, 0, 0.47222],
      "64": [0, 0.69444, 0, 0, 0.77778],
      "65": [0, 0.68333, 0, 0, 0.75],
      "66": [0, 0.68333, 0, 0, 0.70834],
      "67": [0, 0.68333, 0, 0, 0.72222],
      "68": [0, 0.68333, 0, 0, 0.76389],
      "69": [0, 0.68333, 0, 0, 0.68056],
      "70": [0, 0.68333, 0, 0, 0.65278],
      "71": [0, 0.68333, 0, 0, 0.78472],
      "72": [0, 0.68333, 0, 0, 0.75],
      "73": [0, 0.68333, 0, 0, 0.36111],
      "74": [0, 0.68333, 0, 0, 0.51389],
      "75": [0, 0.68333, 0, 0, 0.77778],
      "76": [0, 0.68333, 0, 0, 0.625],
      "77": [0, 0.68333, 0, 0, 0.91667],
      "78": [0, 0.68333, 0, 0, 0.75],
      "79": [0, 0.68333, 0, 0, 0.77778],
      "80": [0, 0.68333, 0, 0, 0.68056],
      "81": [0.19444, 0.68333, 0, 0, 0.77778],
      "82": [0, 0.68333, 0, 0, 0.73611],
      "83": [0, 0.68333, 0, 0, 0.55556],
      "84": [0, 0.68333, 0, 0, 0.72222],
      "85": [0, 0.68333, 0, 0, 0.75],
      "86": [0, 0.68333, 0.01389, 0, 0.75],
      "87": [0, 0.68333, 0.01389, 0, 1.02778],
      "88": [0, 0.68333, 0, 0, 0.75],
      "89": [0, 0.68333, 0.025, 0, 0.75],
      "90": [0, 0.68333, 0, 0, 0.61111],
      "91": [0.25, 0.75, 0, 0, 0.27778],
      "92": [0.25, 0.75, 0, 0, 0.5],
      "93": [0.25, 0.75, 0, 0, 0.27778],
      "94": [0, 0.69444, 0, 0, 0.5],
      "95": [0.31, 0.12056, 0.02778, 0, 0.5],
      "97": [0, 0.43056, 0, 0, 0.5],
      "98": [0, 0.69444, 0, 0, 0.55556],
      "99": [0, 0.43056, 0, 0, 0.44445],
      "100": [0, 0.69444, 0, 0, 0.55556],
      "101": [0, 0.43056, 0, 0, 0.44445],
      "102": [0, 0.69444, 0.07778, 0, 0.30556],
      "103": [0.19444, 0.43056, 0.01389, 0, 0.5],
      "104": [0, 0.69444, 0, 0, 0.55556],
      "105": [0, 0.66786, 0, 0, 0.27778],
      "106": [0.19444, 0.66786, 0, 0, 0.30556],
      "107": [0, 0.69444, 0, 0, 0.52778],
      "108": [0, 0.69444, 0, 0, 0.27778],
      "109": [0, 0.43056, 0, 0, 0.83334],
      "110": [0, 0.43056, 0, 0, 0.55556],
      "111": [0, 0.43056, 0, 0, 0.5],
      "112": [0.19444, 0.43056, 0, 0, 0.55556],
      "113": [0.19444, 0.43056, 0, 0, 0.52778],
      "114": [0, 0.43056, 0, 0, 0.39167],
      "115": [0, 0.43056, 0, 0, 0.39445],
      "116": [0, 0.61508, 0, 0, 0.38889],
      "117": [0, 0.43056, 0, 0, 0.55556],
      "118": [0, 0.43056, 0.01389, 0, 0.52778],
      "119": [0, 0.43056, 0.01389, 0, 0.72222],
      "120": [0, 0.43056, 0, 0, 0.52778],
      "121": [0.19444, 0.43056, 0.01389, 0, 0.52778],
      "122": [0, 0.43056, 0, 0, 0.44445],
      "123": [0.25, 0.75, 0, 0, 0.5],
      "124": [0.25, 0.75, 0, 0, 0.27778],
      "125": [0.25, 0.75, 0, 0, 0.5],
      "126": [0.35, 0.31786, 0, 0, 0.5],
      "160": [0, 0, 0, 0, 0.25],
      "163": [0, 0.69444, 0, 0, 0.76909],
      "167": [0.19444, 0.69444, 0, 0, 0.44445],
      "168": [0, 0.66786, 0, 0, 0.5],
      "172": [0, 0.43056, 0, 0, 0.66667],
      "176": [0, 0.69444, 0, 0, 0.75],
      "177": [0.08333, 0.58333, 0, 0, 0.77778],
      "182": [0.19444, 0.69444, 0, 0, 0.61111],
      "184": [0.17014, 0, 0, 0, 0.44445],
      "198": [0, 0.68333, 0, 0, 0.90278],
      "215": [0.08333, 0.58333, 0, 0, 0.77778],
      "216": [0.04861, 0.73194, 0, 0, 0.77778],
      "223": [0, 0.69444, 0, 0, 0.5],
      "230": [0, 0.43056, 0, 0, 0.72222],
      "247": [0.08333, 0.58333, 0, 0, 0.77778],
      "248": [0.09722, 0.52778, 0, 0, 0.5],
      "305": [0, 0.43056, 0, 0, 0.27778],
      "338": [0, 0.68333, 0, 0, 1.01389],
      "339": [0, 0.43056, 0, 0, 0.77778],
      "567": [0.19444, 0.43056, 0, 0, 0.30556],
      "710": [0, 0.69444, 0, 0, 0.5],
      "711": [0, 0.62847, 0, 0, 0.5],
      "713": [0, 0.56778, 0, 0, 0.5],
      "714": [0, 0.69444, 0, 0, 0.5],
      "715": [0, 0.69444, 0, 0, 0.5],
      "728": [0, 0.69444, 0, 0, 0.5],
      "729": [0, 0.66786, 0, 0, 0.27778],
      "730": [0, 0.69444, 0, 0, 0.75],
      "732": [0, 0.66786, 0, 0, 0.5],
      "733": [0, 0.69444, 0, 0, 0.5],
      "915": [0, 0.68333, 0, 0, 0.625],
      "916": [0, 0.68333, 0, 0, 0.83334],
      "920": [0, 0.68333, 0, 0, 0.77778],
      "923": [0, 0.68333, 0, 0, 0.69445],
      "926": [0, 0.68333, 0, 0, 0.66667],
      "928": [0, 0.68333, 0, 0, 0.75],
      "931": [0, 0.68333, 0, 0, 0.72222],
      "933": [0, 0.68333, 0, 0, 0.77778],
      "934": [0, 0.68333, 0, 0, 0.72222],
      "936": [0, 0.68333, 0, 0, 0.77778],
      "937": [0, 0.68333, 0, 0, 0.72222],
      "8211": [0, 0.43056, 0.02778, 0, 0.5],
      "8212": [0, 0.43056, 0.02778, 0, 1],
      "8216": [0, 0.69444, 0, 0, 0.27778],
      "8217": [0, 0.69444, 0, 0, 0.27778],
      "8220": [0, 0.69444, 0, 0, 0.5],
      "8221": [0, 0.69444, 0, 0, 0.5],
      "8224": [0.19444, 0.69444, 0, 0, 0.44445],
      "8225": [0.19444, 0.69444, 0, 0, 0.44445],
      "8230": [0, 0.123, 0, 0, 1.172],
      "8242": [0, 0.55556, 0, 0, 0.275],
      "8407": [0, 0.71444, 0.15382, 0, 0.5],
      "8463": [0, 0.68889, 0, 0, 0.54028],
      "8465": [0, 0.69444, 0, 0, 0.72222],
      "8467": [0, 0.69444, 0, 0.11111, 0.41667],
      "8472": [0.19444, 0.43056, 0, 0.11111, 0.63646],
      "8476": [0, 0.69444, 0, 0, 0.72222],
      "8501": [0, 0.69444, 0, 0, 0.61111],
      "8592": [-0.13313, 0.36687, 0, 0, 1],
      "8593": [0.19444, 0.69444, 0, 0, 0.5],
      "8594": [-0.13313, 0.36687, 0, 0, 1],
      "8595": [0.19444, 0.69444, 0, 0, 0.5],
      "8596": [-0.13313, 0.36687, 0, 0, 1],
      "8597": [0.25, 0.75, 0, 0, 0.5],
      "8598": [0.19444, 0.69444, 0, 0, 1],
      "8599": [0.19444, 0.69444, 0, 0, 1],
      "8600": [0.19444, 0.69444, 0, 0, 1],
      "8601": [0.19444, 0.69444, 0, 0, 1],
      "8614": [0.011, 0.511, 0, 0, 1],
      "8617": [0.011, 0.511, 0, 0, 1.126],
      "8618": [0.011, 0.511, 0, 0, 1.126],
      "8636": [-0.13313, 0.36687, 0, 0, 1],
      "8637": [-0.13313, 0.36687, 0, 0, 1],
      "8640": [-0.13313, 0.36687, 0, 0, 1],
      "8641": [-0.13313, 0.36687, 0, 0, 1],
      "8652": [0.011, 0.671, 0, 0, 1],
      "8656": [-0.13313, 0.36687, 0, 0, 1],
      "8657": [0.19444, 0.69444, 0, 0, 0.61111],
      "8658": [-0.13313, 0.36687, 0, 0, 1],
      "8659": [0.19444, 0.69444, 0, 0, 0.61111],
      "8660": [-0.13313, 0.36687, 0, 0, 1],
      "8661": [0.25, 0.75, 0, 0, 0.61111],
      "8704": [0, 0.69444, 0, 0, 0.55556],
      "8706": [0, 0.69444, 0.05556, 0.08334, 0.5309],
      "8707": [0, 0.69444, 0, 0, 0.55556],
      "8709": [0.05556, 0.75, 0, 0, 0.5],
      "8711": [0, 0.68333, 0, 0, 0.83334],
      "8712": [0.0391, 0.5391, 0, 0, 0.66667],
      "8715": [0.0391, 0.5391, 0, 0, 0.66667],
      "8722": [0.08333, 0.58333, 0, 0, 0.77778],
      "8723": [0.08333, 0.58333, 0, 0, 0.77778],
      "8725": [0.25, 0.75, 0, 0, 0.5],
      "8726": [0.25, 0.75, 0, 0, 0.5],
      "8727": [-0.03472, 0.46528, 0, 0, 0.5],
      "8728": [-0.05555, 0.44445, 0, 0, 0.5],
      "8729": [-0.05555, 0.44445, 0, 0, 0.5],
      "8730": [0.2, 0.8, 0, 0, 0.83334],
      "8733": [0, 0.43056, 0, 0, 0.77778],
      "8734": [0, 0.43056, 0, 0, 1],
      "8736": [0, 0.69224, 0, 0, 0.72222],
      "8739": [0.25, 0.75, 0, 0, 0.27778],
      "8741": [0.25, 0.75, 0, 0, 0.5],
      "8743": [0, 0.55556, 0, 0, 0.66667],
      "8744": [0, 0.55556, 0, 0, 0.66667],
      "8745": [0, 0.55556, 0, 0, 0.66667],
      "8746": [0, 0.55556, 0, 0, 0.66667],
      "8747": [0.19444, 0.69444, 0.11111, 0, 0.41667],
      "8764": [-0.13313, 0.36687, 0, 0, 0.77778],
      "8768": [0.19444, 0.69444, 0, 0, 0.27778],
      "8771": [-0.03625, 0.46375, 0, 0, 0.77778],
      "8773": [-0.022, 0.589, 0, 0, 0.778],
      "8776": [-0.01688, 0.48312, 0, 0, 0.77778],
      "8781": [-0.03625, 0.46375, 0, 0, 0.77778],
      "8784": [-0.133, 0.673, 0, 0, 0.778],
      "8801": [-0.03625, 0.46375, 0, 0, 0.77778],
      "8804": [0.13597, 0.63597, 0, 0, 0.77778],
      "8805": [0.13597, 0.63597, 0, 0, 0.77778],
      "8810": [0.0391, 0.5391, 0, 0, 1],
      "8811": [0.0391, 0.5391, 0, 0, 1],
      "8826": [0.0391, 0.5391, 0, 0, 0.77778],
      "8827": [0.0391, 0.5391, 0, 0, 0.77778],
      "8834": [0.0391, 0.5391, 0, 0, 0.77778],
      "8835": [0.0391, 0.5391, 0, 0, 0.77778],
      "8838": [0.13597, 0.63597, 0, 0, 0.77778],
      "8839": [0.13597, 0.63597, 0, 0, 0.77778],
      "8846": [0, 0.55556, 0, 0, 0.66667],
      "8849": [0.13597, 0.63597, 0, 0, 0.77778],
      "8850": [0.13597, 0.63597, 0, 0, 0.77778],
      "8851": [0, 0.55556, 0, 0, 0.66667],
      "8852": [0, 0.55556, 0, 0, 0.66667],
      "8853": [0.08333, 0.58333, 0, 0, 0.77778],
      "8854": [0.08333, 0.58333, 0, 0, 0.77778],
      "8855": [0.08333, 0.58333, 0, 0, 0.77778],
      "8856": [0.08333, 0.58333, 0, 0, 0.77778],
      "8857": [0.08333, 0.58333, 0, 0, 0.77778],
      "8866": [0, 0.69444, 0, 0, 0.61111],
      "8867": [0, 0.69444, 0, 0, 0.61111],
      "8868": [0, 0.69444, 0, 0, 0.77778],
      "8869": [0, 0.69444, 0, 0, 0.77778],
      "8872": [0.249, 0.75, 0, 0, 0.867],
      "8900": [-0.05555, 0.44445, 0, 0, 0.5],
      "8901": [-0.05555, 0.44445, 0, 0, 0.27778],
      "8902": [-0.03472, 0.46528, 0, 0, 0.5],
      "8904": [5e-3, 0.505, 0, 0, 0.9],
      "8942": [0.03, 0.903, 0, 0, 0.278],
      "8943": [-0.19, 0.313, 0, 0, 1.172],
      "8945": [-0.1, 0.823, 0, 0, 1.282],
      "8968": [0.25, 0.75, 0, 0, 0.44445],
      "8969": [0.25, 0.75, 0, 0, 0.44445],
      "8970": [0.25, 0.75, 0, 0, 0.44445],
      "8971": [0.25, 0.75, 0, 0, 0.44445],
      "8994": [-0.14236, 0.35764, 0, 0, 1],
      "8995": [-0.14236, 0.35764, 0, 0, 1],
      "9136": [0.244, 0.744, 0, 0, 0.412],
      "9137": [0.244, 0.745, 0, 0, 0.412],
      "9651": [0.19444, 0.69444, 0, 0, 0.88889],
      "9657": [-0.03472, 0.46528, 0, 0, 0.5],
      "9661": [0.19444, 0.69444, 0, 0, 0.88889],
      "9667": [-0.03472, 0.46528, 0, 0, 0.5],
      "9711": [0.19444, 0.69444, 0, 0, 1],
      "9824": [0.12963, 0.69444, 0, 0, 0.77778],
      "9825": [0.12963, 0.69444, 0, 0, 0.77778],
      "9826": [0.12963, 0.69444, 0, 0, 0.77778],
      "9827": [0.12963, 0.69444, 0, 0, 0.77778],
      "9837": [0, 0.75, 0, 0, 0.38889],
      "9838": [0.19444, 0.69444, 0, 0, 0.38889],
      "9839": [0.19444, 0.69444, 0, 0, 0.38889],
      "10216": [0.25, 0.75, 0, 0, 0.38889],
      "10217": [0.25, 0.75, 0, 0, 0.38889],
      "10222": [0.244, 0.744, 0, 0, 0.412],
      "10223": [0.244, 0.745, 0, 0, 0.412],
      "10229": [0.011, 0.511, 0, 0, 1.609],
      "10230": [0.011, 0.511, 0, 0, 1.638],
      "10231": [0.011, 0.511, 0, 0, 1.859],
      "10232": [0.024, 0.525, 0, 0, 1.609],
      "10233": [0.024, 0.525, 0, 0, 1.638],
      "10234": [0.024, 0.525, 0, 0, 1.858],
      "10236": [0.011, 0.511, 0, 0, 1.638],
      "10815": [0, 0.68333, 0, 0, 0.75],
      "10927": [0.13597, 0.63597, 0, 0, 0.77778],
      "10928": [0.13597, 0.63597, 0, 0, 0.77778],
      "57376": [0.19444, 0.69444, 0, 0, 0]
    },
    "Math-BoldItalic": {
      "32": [0, 0, 0, 0, 0.25],
      "48": [0, 0.44444, 0, 0, 0.575],
      "49": [0, 0.44444, 0, 0, 0.575],
      "50": [0, 0.44444, 0, 0, 0.575],
      "51": [0.19444, 0.44444, 0, 0, 0.575],
      "52": [0.19444, 0.44444, 0, 0, 0.575],
      "53": [0.19444, 0.44444, 0, 0, 0.575],
      "54": [0, 0.64444, 0, 0, 0.575],
      "55": [0.19444, 0.44444, 0, 0, 0.575],
      "56": [0, 0.64444, 0, 0, 0.575],
      "57": [0.19444, 0.44444, 0, 0, 0.575],
      "65": [0, 0.68611, 0, 0, 0.86944],
      "66": [0, 0.68611, 0.04835, 0, 0.8664],
      "67": [0, 0.68611, 0.06979, 0, 0.81694],
      "68": [0, 0.68611, 0.03194, 0, 0.93812],
      "69": [0, 0.68611, 0.05451, 0, 0.81007],
      "70": [0, 0.68611, 0.15972, 0, 0.68889],
      "71": [0, 0.68611, 0, 0, 0.88673],
      "72": [0, 0.68611, 0.08229, 0, 0.98229],
      "73": [0, 0.68611, 0.07778, 0, 0.51111],
      "74": [0, 0.68611, 0.10069, 0, 0.63125],
      "75": [0, 0.68611, 0.06979, 0, 0.97118],
      "76": [0, 0.68611, 0, 0, 0.75555],
      "77": [0, 0.68611, 0.11424, 0, 1.14201],
      "78": [0, 0.68611, 0.11424, 0, 0.95034],
      "79": [0, 0.68611, 0.03194, 0, 0.83666],
      "80": [0, 0.68611, 0.15972, 0, 0.72309],
      "81": [0.19444, 0.68611, 0, 0, 0.86861],
      "82": [0, 0.68611, 421e-5, 0, 0.87235],
      "83": [0, 0.68611, 0.05382, 0, 0.69271],
      "84": [0, 0.68611, 0.15972, 0, 0.63663],
      "85": [0, 0.68611, 0.11424, 0, 0.80027],
      "86": [0, 0.68611, 0.25555, 0, 0.67778],
      "87": [0, 0.68611, 0.15972, 0, 1.09305],
      "88": [0, 0.68611, 0.07778, 0, 0.94722],
      "89": [0, 0.68611, 0.25555, 0, 0.67458],
      "90": [0, 0.68611, 0.06979, 0, 0.77257],
      "97": [0, 0.44444, 0, 0, 0.63287],
      "98": [0, 0.69444, 0, 0, 0.52083],
      "99": [0, 0.44444, 0, 0, 0.51342],
      "100": [0, 0.69444, 0, 0, 0.60972],
      "101": [0, 0.44444, 0, 0, 0.55361],
      "102": [0.19444, 0.69444, 0.11042, 0, 0.56806],
      "103": [0.19444, 0.44444, 0.03704, 0, 0.5449],
      "104": [0, 0.69444, 0, 0, 0.66759],
      "105": [0, 0.69326, 0, 0, 0.4048],
      "106": [0.19444, 0.69326, 0.0622, 0, 0.47083],
      "107": [0, 0.69444, 0.01852, 0, 0.6037],
      "108": [0, 0.69444, 88e-4, 0, 0.34815],
      "109": [0, 0.44444, 0, 0, 1.0324],
      "110": [0, 0.44444, 0, 0, 0.71296],
      "111": [0, 0.44444, 0, 0, 0.58472],
      "112": [0.19444, 0.44444, 0, 0, 0.60092],
      "113": [0.19444, 0.44444, 0.03704, 0, 0.54213],
      "114": [0, 0.44444, 0.03194, 0, 0.5287],
      "115": [0, 0.44444, 0, 0, 0.53125],
      "116": [0, 0.63492, 0, 0, 0.41528],
      "117": [0, 0.44444, 0, 0, 0.68102],
      "118": [0, 0.44444, 0.03704, 0, 0.56666],
      "119": [0, 0.44444, 0.02778, 0, 0.83148],
      "120": [0, 0.44444, 0, 0, 0.65903],
      "121": [0.19444, 0.44444, 0.03704, 0, 0.59028],
      "122": [0, 0.44444, 0.04213, 0, 0.55509],
      "160": [0, 0, 0, 0, 0.25],
      "915": [0, 0.68611, 0.15972, 0, 0.65694],
      "916": [0, 0.68611, 0, 0, 0.95833],
      "920": [0, 0.68611, 0.03194, 0, 0.86722],
      "923": [0, 0.68611, 0, 0, 0.80555],
      "926": [0, 0.68611, 0.07458, 0, 0.84125],
      "928": [0, 0.68611, 0.08229, 0, 0.98229],
      "931": [0, 0.68611, 0.05451, 0, 0.88507],
      "933": [0, 0.68611, 0.15972, 0, 0.67083],
      "934": [0, 0.68611, 0, 0, 0.76666],
      "936": [0, 0.68611, 0.11653, 0, 0.71402],
      "937": [0, 0.68611, 0.04835, 0, 0.8789],
      "945": [0, 0.44444, 0, 0, 0.76064],
      "946": [0.19444, 0.69444, 0.03403, 0, 0.65972],
      "947": [0.19444, 0.44444, 0.06389, 0, 0.59003],
      "948": [0, 0.69444, 0.03819, 0, 0.52222],
      "949": [0, 0.44444, 0, 0, 0.52882],
      "950": [0.19444, 0.69444, 0.06215, 0, 0.50833],
      "951": [0.19444, 0.44444, 0.03704, 0, 0.6],
      "952": [0, 0.69444, 0.03194, 0, 0.5618],
      "953": [0, 0.44444, 0, 0, 0.41204],
      "954": [0, 0.44444, 0, 0, 0.66759],
      "955": [0, 0.69444, 0, 0, 0.67083],
      "956": [0.19444, 0.44444, 0, 0, 0.70787],
      "957": [0, 0.44444, 0.06898, 0, 0.57685],
      "958": [0.19444, 0.69444, 0.03021, 0, 0.50833],
      "959": [0, 0.44444, 0, 0, 0.58472],
      "960": [0, 0.44444, 0.03704, 0, 0.68241],
      "961": [0.19444, 0.44444, 0, 0, 0.6118],
      "962": [0.09722, 0.44444, 0.07917, 0, 0.42361],
      "963": [0, 0.44444, 0.03704, 0, 0.68588],
      "964": [0, 0.44444, 0.13472, 0, 0.52083],
      "965": [0, 0.44444, 0.03704, 0, 0.63055],
      "966": [0.19444, 0.44444, 0, 0, 0.74722],
      "967": [0.19444, 0.44444, 0, 0, 0.71805],
      "968": [0.19444, 0.69444, 0.03704, 0, 0.75833],
      "969": [0, 0.44444, 0.03704, 0, 0.71782],
      "977": [0, 0.69444, 0, 0, 0.69155],
      "981": [0.19444, 0.69444, 0, 0, 0.7125],
      "982": [0, 0.44444, 0.03194, 0, 0.975],
      "1009": [0.19444, 0.44444, 0, 0, 0.6118],
      "1013": [0, 0.44444, 0, 0, 0.48333],
      "57649": [0, 0.44444, 0, 0, 0.39352],
      "57911": [0.19444, 0.44444, 0, 0, 0.43889]
    },
    "Math-Italic": {
      "32": [0, 0, 0, 0, 0.25],
      "48": [0, 0.43056, 0, 0, 0.5],
      "49": [0, 0.43056, 0, 0, 0.5],
      "50": [0, 0.43056, 0, 0, 0.5],
      "51": [0.19444, 0.43056, 0, 0, 0.5],
      "52": [0.19444, 0.43056, 0, 0, 0.5],
      "53": [0.19444, 0.43056, 0, 0, 0.5],
      "54": [0, 0.64444, 0, 0, 0.5],
      "55": [0.19444, 0.43056, 0, 0, 0.5],
      "56": [0, 0.64444, 0, 0, 0.5],
      "57": [0.19444, 0.43056, 0, 0, 0.5],
      "65": [0, 0.68333, 0, 0.13889, 0.75],
      "66": [0, 0.68333, 0.05017, 0.08334, 0.75851],
      "67": [0, 0.68333, 0.07153, 0.08334, 0.71472],
      "68": [0, 0.68333, 0.02778, 0.05556, 0.82792],
      "69": [0, 0.68333, 0.05764, 0.08334, 0.7382],
      "70": [0, 0.68333, 0.13889, 0.08334, 0.64306],
      "71": [0, 0.68333, 0, 0.08334, 0.78625],
      "72": [0, 0.68333, 0.08125, 0.05556, 0.83125],
      "73": [0, 0.68333, 0.07847, 0.11111, 0.43958],
      "74": [0, 0.68333, 0.09618, 0.16667, 0.55451],
      "75": [0, 0.68333, 0.07153, 0.05556, 0.84931],
      "76": [0, 0.68333, 0, 0.02778, 0.68056],
      "77": [0, 0.68333, 0.10903, 0.08334, 0.97014],
      "78": [0, 0.68333, 0.10903, 0.08334, 0.80347],
      "79": [0, 0.68333, 0.02778, 0.08334, 0.76278],
      "80": [0, 0.68333, 0.13889, 0.08334, 0.64201],
      "81": [0.19444, 0.68333, 0, 0.08334, 0.79056],
      "82": [0, 0.68333, 773e-5, 0.08334, 0.75929],
      "83": [0, 0.68333, 0.05764, 0.08334, 0.6132],
      "84": [0, 0.68333, 0.13889, 0.08334, 0.58438],
      "85": [0, 0.68333, 0.10903, 0.02778, 0.68278],
      "86": [0, 0.68333, 0.22222, 0, 0.58333],
      "87": [0, 0.68333, 0.13889, 0, 0.94445],
      "88": [0, 0.68333, 0.07847, 0.08334, 0.82847],
      "89": [0, 0.68333, 0.22222, 0, 0.58056],
      "90": [0, 0.68333, 0.07153, 0.08334, 0.68264],
      "97": [0, 0.43056, 0, 0, 0.52859],
      "98": [0, 0.69444, 0, 0, 0.42917],
      "99": [0, 0.43056, 0, 0.05556, 0.43276],
      "100": [0, 0.69444, 0, 0.16667, 0.52049],
      "101": [0, 0.43056, 0, 0.05556, 0.46563],
      "102": [0.19444, 0.69444, 0.10764, 0.16667, 0.48959],
      "103": [0.19444, 0.43056, 0.03588, 0.02778, 0.47697],
      "104": [0, 0.69444, 0, 0, 0.57616],
      "105": [0, 0.65952, 0, 0, 0.34451],
      "106": [0.19444, 0.65952, 0.05724, 0, 0.41181],
      "107": [0, 0.69444, 0.03148, 0, 0.5206],
      "108": [0, 0.69444, 0.01968, 0.08334, 0.29838],
      "109": [0, 0.43056, 0, 0, 0.87801],
      "110": [0, 0.43056, 0, 0, 0.60023],
      "111": [0, 0.43056, 0, 0.05556, 0.48472],
      "112": [0.19444, 0.43056, 0, 0.08334, 0.50313],
      "113": [0.19444, 0.43056, 0.03588, 0.08334, 0.44641],
      "114": [0, 0.43056, 0.02778, 0.05556, 0.45116],
      "115": [0, 0.43056, 0, 0.05556, 0.46875],
      "116": [0, 0.61508, 0, 0.08334, 0.36111],
      "117": [0, 0.43056, 0, 0.02778, 0.57246],
      "118": [0, 0.43056, 0.03588, 0.02778, 0.48472],
      "119": [0, 0.43056, 0.02691, 0.08334, 0.71592],
      "120": [0, 0.43056, 0, 0.02778, 0.57153],
      "121": [0.19444, 0.43056, 0.03588, 0.05556, 0.49028],
      "122": [0, 0.43056, 0.04398, 0.05556, 0.46505],
      "160": [0, 0, 0, 0, 0.25],
      "915": [0, 0.68333, 0.13889, 0.08334, 0.61528],
      "916": [0, 0.68333, 0, 0.16667, 0.83334],
      "920": [0, 0.68333, 0.02778, 0.08334, 0.76278],
      "923": [0, 0.68333, 0, 0.16667, 0.69445],
      "926": [0, 0.68333, 0.07569, 0.08334, 0.74236],
      "928": [0, 0.68333, 0.08125, 0.05556, 0.83125],
      "931": [0, 0.68333, 0.05764, 0.08334, 0.77986],
      "933": [0, 0.68333, 0.13889, 0.05556, 0.58333],
      "934": [0, 0.68333, 0, 0.08334, 0.66667],
      "936": [0, 0.68333, 0.11, 0.05556, 0.61222],
      "937": [0, 0.68333, 0.05017, 0.08334, 0.7724],
      "945": [0, 0.43056, 37e-4, 0.02778, 0.6397],
      "946": [0.19444, 0.69444, 0.05278, 0.08334, 0.56563],
      "947": [0.19444, 0.43056, 0.05556, 0, 0.51773],
      "948": [0, 0.69444, 0.03785, 0.05556, 0.44444],
      "949": [0, 0.43056, 0, 0.08334, 0.46632],
      "950": [0.19444, 0.69444, 0.07378, 0.08334, 0.4375],
      "951": [0.19444, 0.43056, 0.03588, 0.05556, 0.49653],
      "952": [0, 0.69444, 0.02778, 0.08334, 0.46944],
      "953": [0, 0.43056, 0, 0.05556, 0.35394],
      "954": [0, 0.43056, 0, 0, 0.57616],
      "955": [0, 0.69444, 0, 0, 0.58334],
      "956": [0.19444, 0.43056, 0, 0.02778, 0.60255],
      "957": [0, 0.43056, 0.06366, 0.02778, 0.49398],
      "958": [0.19444, 0.69444, 0.04601, 0.11111, 0.4375],
      "959": [0, 0.43056, 0, 0.05556, 0.48472],
      "960": [0, 0.43056, 0.03588, 0, 0.57003],
      "961": [0.19444, 0.43056, 0, 0.08334, 0.51702],
      "962": [0.09722, 0.43056, 0.07986, 0.08334, 0.36285],
      "963": [0, 0.43056, 0.03588, 0, 0.57141],
      "964": [0, 0.43056, 0.1132, 0.02778, 0.43715],
      "965": [0, 0.43056, 0.03588, 0.02778, 0.54028],
      "966": [0.19444, 0.43056, 0, 0.08334, 0.65417],
      "967": [0.19444, 0.43056, 0, 0.05556, 0.62569],
      "968": [0.19444, 0.69444, 0.03588, 0.11111, 0.65139],
      "969": [0, 0.43056, 0.03588, 0, 0.62245],
      "977": [0, 0.69444, 0, 0.08334, 0.59144],
      "981": [0.19444, 0.69444, 0, 0.08334, 0.59583],
      "982": [0, 0.43056, 0.02778, 0, 0.82813],
      "1009": [0.19444, 0.43056, 0, 0.08334, 0.51702],
      "1013": [0, 0.43056, 0, 0.05556, 0.4059],
      "57649": [0, 0.43056, 0, 0.02778, 0.32246],
      "57911": [0.19444, 0.43056, 0, 0.08334, 0.38403]
    },
    "SansSerif-Bold": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69444, 0, 0, 0.36667],
      "34": [0, 0.69444, 0, 0, 0.55834],
      "35": [0.19444, 0.69444, 0, 0, 0.91667],
      "36": [0.05556, 0.75, 0, 0, 0.55],
      "37": [0.05556, 0.75, 0, 0, 1.02912],
      "38": [0, 0.69444, 0, 0, 0.83056],
      "39": [0, 0.69444, 0, 0, 0.30556],
      "40": [0.25, 0.75, 0, 0, 0.42778],
      "41": [0.25, 0.75, 0, 0, 0.42778],
      "42": [0, 0.75, 0, 0, 0.55],
      "43": [0.11667, 0.61667, 0, 0, 0.85556],
      "44": [0.10556, 0.13056, 0, 0, 0.30556],
      "45": [0, 0.45833, 0, 0, 0.36667],
      "46": [0, 0.13056, 0, 0, 0.30556],
      "47": [0.25, 0.75, 0, 0, 0.55],
      "48": [0, 0.69444, 0, 0, 0.55],
      "49": [0, 0.69444, 0, 0, 0.55],
      "50": [0, 0.69444, 0, 0, 0.55],
      "51": [0, 0.69444, 0, 0, 0.55],
      "52": [0, 0.69444, 0, 0, 0.55],
      "53": [0, 0.69444, 0, 0, 0.55],
      "54": [0, 0.69444, 0, 0, 0.55],
      "55": [0, 0.69444, 0, 0, 0.55],
      "56": [0, 0.69444, 0, 0, 0.55],
      "57": [0, 0.69444, 0, 0, 0.55],
      "58": [0, 0.45833, 0, 0, 0.30556],
      "59": [0.10556, 0.45833, 0, 0, 0.30556],
      "61": [-0.09375, 0.40625, 0, 0, 0.85556],
      "63": [0, 0.69444, 0, 0, 0.51945],
      "64": [0, 0.69444, 0, 0, 0.73334],
      "65": [0, 0.69444, 0, 0, 0.73334],
      "66": [0, 0.69444, 0, 0, 0.73334],
      "67": [0, 0.69444, 0, 0, 0.70278],
      "68": [0, 0.69444, 0, 0, 0.79445],
      "69": [0, 0.69444, 0, 0, 0.64167],
      "70": [0, 0.69444, 0, 0, 0.61111],
      "71": [0, 0.69444, 0, 0, 0.73334],
      "72": [0, 0.69444, 0, 0, 0.79445],
      "73": [0, 0.69444, 0, 0, 0.33056],
      "74": [0, 0.69444, 0, 0, 0.51945],
      "75": [0, 0.69444, 0, 0, 0.76389],
      "76": [0, 0.69444, 0, 0, 0.58056],
      "77": [0, 0.69444, 0, 0, 0.97778],
      "78": [0, 0.69444, 0, 0, 0.79445],
      "79": [0, 0.69444, 0, 0, 0.79445],
      "80": [0, 0.69444, 0, 0, 0.70278],
      "81": [0.10556, 0.69444, 0, 0, 0.79445],
      "82": [0, 0.69444, 0, 0, 0.70278],
      "83": [0, 0.69444, 0, 0, 0.61111],
      "84": [0, 0.69444, 0, 0, 0.73334],
      "85": [0, 0.69444, 0, 0, 0.76389],
      "86": [0, 0.69444, 0.01528, 0, 0.73334],
      "87": [0, 0.69444, 0.01528, 0, 1.03889],
      "88": [0, 0.69444, 0, 0, 0.73334],
      "89": [0, 0.69444, 0.0275, 0, 0.73334],
      "90": [0, 0.69444, 0, 0, 0.67223],
      "91": [0.25, 0.75, 0, 0, 0.34306],
      "93": [0.25, 0.75, 0, 0, 0.34306],
      "94": [0, 0.69444, 0, 0, 0.55],
      "95": [0.35, 0.10833, 0.03056, 0, 0.55],
      "97": [0, 0.45833, 0, 0, 0.525],
      "98": [0, 0.69444, 0, 0, 0.56111],
      "99": [0, 0.45833, 0, 0, 0.48889],
      "100": [0, 0.69444, 0, 0, 0.56111],
      "101": [0, 0.45833, 0, 0, 0.51111],
      "102": [0, 0.69444, 0.07639, 0, 0.33611],
      "103": [0.19444, 0.45833, 0.01528, 0, 0.55],
      "104": [0, 0.69444, 0, 0, 0.56111],
      "105": [0, 0.69444, 0, 0, 0.25556],
      "106": [0.19444, 0.69444, 0, 0, 0.28611],
      "107": [0, 0.69444, 0, 0, 0.53056],
      "108": [0, 0.69444, 0, 0, 0.25556],
      "109": [0, 0.45833, 0, 0, 0.86667],
      "110": [0, 0.45833, 0, 0, 0.56111],
      "111": [0, 0.45833, 0, 0, 0.55],
      "112": [0.19444, 0.45833, 0, 0, 0.56111],
      "113": [0.19444, 0.45833, 0, 0, 0.56111],
      "114": [0, 0.45833, 0.01528, 0, 0.37222],
      "115": [0, 0.45833, 0, 0, 0.42167],
      "116": [0, 0.58929, 0, 0, 0.40417],
      "117": [0, 0.45833, 0, 0, 0.56111],
      "118": [0, 0.45833, 0.01528, 0, 0.5],
      "119": [0, 0.45833, 0.01528, 0, 0.74445],
      "120": [0, 0.45833, 0, 0, 0.5],
      "121": [0.19444, 0.45833, 0.01528, 0, 0.5],
      "122": [0, 0.45833, 0, 0, 0.47639],
      "126": [0.35, 0.34444, 0, 0, 0.55],
      "160": [0, 0, 0, 0, 0.25],
      "168": [0, 0.69444, 0, 0, 0.55],
      "176": [0, 0.69444, 0, 0, 0.73334],
      "180": [0, 0.69444, 0, 0, 0.55],
      "184": [0.17014, 0, 0, 0, 0.48889],
      "305": [0, 0.45833, 0, 0, 0.25556],
      "567": [0.19444, 0.45833, 0, 0, 0.28611],
      "710": [0, 0.69444, 0, 0, 0.55],
      "711": [0, 0.63542, 0, 0, 0.55],
      "713": [0, 0.63778, 0, 0, 0.55],
      "728": [0, 0.69444, 0, 0, 0.55],
      "729": [0, 0.69444, 0, 0, 0.30556],
      "730": [0, 0.69444, 0, 0, 0.73334],
      "732": [0, 0.69444, 0, 0, 0.55],
      "733": [0, 0.69444, 0, 0, 0.55],
      "915": [0, 0.69444, 0, 0, 0.58056],
      "916": [0, 0.69444, 0, 0, 0.91667],
      "920": [0, 0.69444, 0, 0, 0.85556],
      "923": [0, 0.69444, 0, 0, 0.67223],
      "926": [0, 0.69444, 0, 0, 0.73334],
      "928": [0, 0.69444, 0, 0, 0.79445],
      "931": [0, 0.69444, 0, 0, 0.79445],
      "933": [0, 0.69444, 0, 0, 0.85556],
      "934": [0, 0.69444, 0, 0, 0.79445],
      "936": [0, 0.69444, 0, 0, 0.85556],
      "937": [0, 0.69444, 0, 0, 0.79445],
      "8211": [0, 0.45833, 0.03056, 0, 0.55],
      "8212": [0, 0.45833, 0.03056, 0, 1.10001],
      "8216": [0, 0.69444, 0, 0, 0.30556],
      "8217": [0, 0.69444, 0, 0, 0.30556],
      "8220": [0, 0.69444, 0, 0, 0.55834],
      "8221": [0, 0.69444, 0, 0, 0.55834]
    },
    "SansSerif-Italic": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69444, 0.05733, 0, 0.31945],
      "34": [0, 0.69444, 316e-5, 0, 0.5],
      "35": [0.19444, 0.69444, 0.05087, 0, 0.83334],
      "36": [0.05556, 0.75, 0.11156, 0, 0.5],
      "37": [0.05556, 0.75, 0.03126, 0, 0.83334],
      "38": [0, 0.69444, 0.03058, 0, 0.75834],
      "39": [0, 0.69444, 0.07816, 0, 0.27778],
      "40": [0.25, 0.75, 0.13164, 0, 0.38889],
      "41": [0.25, 0.75, 0.02536, 0, 0.38889],
      "42": [0, 0.75, 0.11775, 0, 0.5],
      "43": [0.08333, 0.58333, 0.02536, 0, 0.77778],
      "44": [0.125, 0.08333, 0, 0, 0.27778],
      "45": [0, 0.44444, 0.01946, 0, 0.33333],
      "46": [0, 0.08333, 0, 0, 0.27778],
      "47": [0.25, 0.75, 0.13164, 0, 0.5],
      "48": [0, 0.65556, 0.11156, 0, 0.5],
      "49": [0, 0.65556, 0.11156, 0, 0.5],
      "50": [0, 0.65556, 0.11156, 0, 0.5],
      "51": [0, 0.65556, 0.11156, 0, 0.5],
      "52": [0, 0.65556, 0.11156, 0, 0.5],
      "53": [0, 0.65556, 0.11156, 0, 0.5],
      "54": [0, 0.65556, 0.11156, 0, 0.5],
      "55": [0, 0.65556, 0.11156, 0, 0.5],
      "56": [0, 0.65556, 0.11156, 0, 0.5],
      "57": [0, 0.65556, 0.11156, 0, 0.5],
      "58": [0, 0.44444, 0.02502, 0, 0.27778],
      "59": [0.125, 0.44444, 0.02502, 0, 0.27778],
      "61": [-0.13, 0.37, 0.05087, 0, 0.77778],
      "63": [0, 0.69444, 0.11809, 0, 0.47222],
      "64": [0, 0.69444, 0.07555, 0, 0.66667],
      "65": [0, 0.69444, 0, 0, 0.66667],
      "66": [0, 0.69444, 0.08293, 0, 0.66667],
      "67": [0, 0.69444, 0.11983, 0, 0.63889],
      "68": [0, 0.69444, 0.07555, 0, 0.72223],
      "69": [0, 0.69444, 0.11983, 0, 0.59722],
      "70": [0, 0.69444, 0.13372, 0, 0.56945],
      "71": [0, 0.69444, 0.11983, 0, 0.66667],
      "72": [0, 0.69444, 0.08094, 0, 0.70834],
      "73": [0, 0.69444, 0.13372, 0, 0.27778],
      "74": [0, 0.69444, 0.08094, 0, 0.47222],
      "75": [0, 0.69444, 0.11983, 0, 0.69445],
      "76": [0, 0.69444, 0, 0, 0.54167],
      "77": [0, 0.69444, 0.08094, 0, 0.875],
      "78": [0, 0.69444, 0.08094, 0, 0.70834],
      "79": [0, 0.69444, 0.07555, 0, 0.73611],
      "80": [0, 0.69444, 0.08293, 0, 0.63889],
      "81": [0.125, 0.69444, 0.07555, 0, 0.73611],
      "82": [0, 0.69444, 0.08293, 0, 0.64584],
      "83": [0, 0.69444, 0.09205, 0, 0.55556],
      "84": [0, 0.69444, 0.13372, 0, 0.68056],
      "85": [0, 0.69444, 0.08094, 0, 0.6875],
      "86": [0, 0.69444, 0.1615, 0, 0.66667],
      "87": [0, 0.69444, 0.1615, 0, 0.94445],
      "88": [0, 0.69444, 0.13372, 0, 0.66667],
      "89": [0, 0.69444, 0.17261, 0, 0.66667],
      "90": [0, 0.69444, 0.11983, 0, 0.61111],
      "91": [0.25, 0.75, 0.15942, 0, 0.28889],
      "93": [0.25, 0.75, 0.08719, 0, 0.28889],
      "94": [0, 0.69444, 0.0799, 0, 0.5],
      "95": [0.35, 0.09444, 0.08616, 0, 0.5],
      "97": [0, 0.44444, 981e-5, 0, 0.48056],
      "98": [0, 0.69444, 0.03057, 0, 0.51667],
      "99": [0, 0.44444, 0.08336, 0, 0.44445],
      "100": [0, 0.69444, 0.09483, 0, 0.51667],
      "101": [0, 0.44444, 0.06778, 0, 0.44445],
      "102": [0, 0.69444, 0.21705, 0, 0.30556],
      "103": [0.19444, 0.44444, 0.10836, 0, 0.5],
      "104": [0, 0.69444, 0.01778, 0, 0.51667],
      "105": [0, 0.67937, 0.09718, 0, 0.23889],
      "106": [0.19444, 0.67937, 0.09162, 0, 0.26667],
      "107": [0, 0.69444, 0.08336, 0, 0.48889],
      "108": [0, 0.69444, 0.09483, 0, 0.23889],
      "109": [0, 0.44444, 0.01778, 0, 0.79445],
      "110": [0, 0.44444, 0.01778, 0, 0.51667],
      "111": [0, 0.44444, 0.06613, 0, 0.5],
      "112": [0.19444, 0.44444, 0.0389, 0, 0.51667],
      "113": [0.19444, 0.44444, 0.04169, 0, 0.51667],
      "114": [0, 0.44444, 0.10836, 0, 0.34167],
      "115": [0, 0.44444, 0.0778, 0, 0.38333],
      "116": [0, 0.57143, 0.07225, 0, 0.36111],
      "117": [0, 0.44444, 0.04169, 0, 0.51667],
      "118": [0, 0.44444, 0.10836, 0, 0.46111],
      "119": [0, 0.44444, 0.10836, 0, 0.68334],
      "120": [0, 0.44444, 0.09169, 0, 0.46111],
      "121": [0.19444, 0.44444, 0.10836, 0, 0.46111],
      "122": [0, 0.44444, 0.08752, 0, 0.43472],
      "126": [0.35, 0.32659, 0.08826, 0, 0.5],
      "160": [0, 0, 0, 0, 0.25],
      "168": [0, 0.67937, 0.06385, 0, 0.5],
      "176": [0, 0.69444, 0, 0, 0.73752],
      "184": [0.17014, 0, 0, 0, 0.44445],
      "305": [0, 0.44444, 0.04169, 0, 0.23889],
      "567": [0.19444, 0.44444, 0.04169, 0, 0.26667],
      "710": [0, 0.69444, 0.0799, 0, 0.5],
      "711": [0, 0.63194, 0.08432, 0, 0.5],
      "713": [0, 0.60889, 0.08776, 0, 0.5],
      "714": [0, 0.69444, 0.09205, 0, 0.5],
      "715": [0, 0.69444, 0, 0, 0.5],
      "728": [0, 0.69444, 0.09483, 0, 0.5],
      "729": [0, 0.67937, 0.07774, 0, 0.27778],
      "730": [0, 0.69444, 0, 0, 0.73752],
      "732": [0, 0.67659, 0.08826, 0, 0.5],
      "733": [0, 0.69444, 0.09205, 0, 0.5],
      "915": [0, 0.69444, 0.13372, 0, 0.54167],
      "916": [0, 0.69444, 0, 0, 0.83334],
      "920": [0, 0.69444, 0.07555, 0, 0.77778],
      "923": [0, 0.69444, 0, 0, 0.61111],
      "926": [0, 0.69444, 0.12816, 0, 0.66667],
      "928": [0, 0.69444, 0.08094, 0, 0.70834],
      "931": [0, 0.69444, 0.11983, 0, 0.72222],
      "933": [0, 0.69444, 0.09031, 0, 0.77778],
      "934": [0, 0.69444, 0.04603, 0, 0.72222],
      "936": [0, 0.69444, 0.09031, 0, 0.77778],
      "937": [0, 0.69444, 0.08293, 0, 0.72222],
      "8211": [0, 0.44444, 0.08616, 0, 0.5],
      "8212": [0, 0.44444, 0.08616, 0, 1],
      "8216": [0, 0.69444, 0.07816, 0, 0.27778],
      "8217": [0, 0.69444, 0.07816, 0, 0.27778],
      "8220": [0, 0.69444, 0.14205, 0, 0.5],
      "8221": [0, 0.69444, 316e-5, 0, 0.5]
    },
    "SansSerif-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69444, 0, 0, 0.31945],
      "34": [0, 0.69444, 0, 0, 0.5],
      "35": [0.19444, 0.69444, 0, 0, 0.83334],
      "36": [0.05556, 0.75, 0, 0, 0.5],
      "37": [0.05556, 0.75, 0, 0, 0.83334],
      "38": [0, 0.69444, 0, 0, 0.75834],
      "39": [0, 0.69444, 0, 0, 0.27778],
      "40": [0.25, 0.75, 0, 0, 0.38889],
      "41": [0.25, 0.75, 0, 0, 0.38889],
      "42": [0, 0.75, 0, 0, 0.5],
      "43": [0.08333, 0.58333, 0, 0, 0.77778],
      "44": [0.125, 0.08333, 0, 0, 0.27778],
      "45": [0, 0.44444, 0, 0, 0.33333],
      "46": [0, 0.08333, 0, 0, 0.27778],
      "47": [0.25, 0.75, 0, 0, 0.5],
      "48": [0, 0.65556, 0, 0, 0.5],
      "49": [0, 0.65556, 0, 0, 0.5],
      "50": [0, 0.65556, 0, 0, 0.5],
      "51": [0, 0.65556, 0, 0, 0.5],
      "52": [0, 0.65556, 0, 0, 0.5],
      "53": [0, 0.65556, 0, 0, 0.5],
      "54": [0, 0.65556, 0, 0, 0.5],
      "55": [0, 0.65556, 0, 0, 0.5],
      "56": [0, 0.65556, 0, 0, 0.5],
      "57": [0, 0.65556, 0, 0, 0.5],
      "58": [0, 0.44444, 0, 0, 0.27778],
      "59": [0.125, 0.44444, 0, 0, 0.27778],
      "61": [-0.13, 0.37, 0, 0, 0.77778],
      "63": [0, 0.69444, 0, 0, 0.47222],
      "64": [0, 0.69444, 0, 0, 0.66667],
      "65": [0, 0.69444, 0, 0, 0.66667],
      "66": [0, 0.69444, 0, 0, 0.66667],
      "67": [0, 0.69444, 0, 0, 0.63889],
      "68": [0, 0.69444, 0, 0, 0.72223],
      "69": [0, 0.69444, 0, 0, 0.59722],
      "70": [0, 0.69444, 0, 0, 0.56945],
      "71": [0, 0.69444, 0, 0, 0.66667],
      "72": [0, 0.69444, 0, 0, 0.70834],
      "73": [0, 0.69444, 0, 0, 0.27778],
      "74": [0, 0.69444, 0, 0, 0.47222],
      "75": [0, 0.69444, 0, 0, 0.69445],
      "76": [0, 0.69444, 0, 0, 0.54167],
      "77": [0, 0.69444, 0, 0, 0.875],
      "78": [0, 0.69444, 0, 0, 0.70834],
      "79": [0, 0.69444, 0, 0, 0.73611],
      "80": [0, 0.69444, 0, 0, 0.63889],
      "81": [0.125, 0.69444, 0, 0, 0.73611],
      "82": [0, 0.69444, 0, 0, 0.64584],
      "83": [0, 0.69444, 0, 0, 0.55556],
      "84": [0, 0.69444, 0, 0, 0.68056],
      "85": [0, 0.69444, 0, 0, 0.6875],
      "86": [0, 0.69444, 0.01389, 0, 0.66667],
      "87": [0, 0.69444, 0.01389, 0, 0.94445],
      "88": [0, 0.69444, 0, 0, 0.66667],
      "89": [0, 0.69444, 0.025, 0, 0.66667],
      "90": [0, 0.69444, 0, 0, 0.61111],
      "91": [0.25, 0.75, 0, 0, 0.28889],
      "93": [0.25, 0.75, 0, 0, 0.28889],
      "94": [0, 0.69444, 0, 0, 0.5],
      "95": [0.35, 0.09444, 0.02778, 0, 0.5],
      "97": [0, 0.44444, 0, 0, 0.48056],
      "98": [0, 0.69444, 0, 0, 0.51667],
      "99": [0, 0.44444, 0, 0, 0.44445],
      "100": [0, 0.69444, 0, 0, 0.51667],
      "101": [0, 0.44444, 0, 0, 0.44445],
      "102": [0, 0.69444, 0.06944, 0, 0.30556],
      "103": [0.19444, 0.44444, 0.01389, 0, 0.5],
      "104": [0, 0.69444, 0, 0, 0.51667],
      "105": [0, 0.67937, 0, 0, 0.23889],
      "106": [0.19444, 0.67937, 0, 0, 0.26667],
      "107": [0, 0.69444, 0, 0, 0.48889],
      "108": [0, 0.69444, 0, 0, 0.23889],
      "109": [0, 0.44444, 0, 0, 0.79445],
      "110": [0, 0.44444, 0, 0, 0.51667],
      "111": [0, 0.44444, 0, 0, 0.5],
      "112": [0.19444, 0.44444, 0, 0, 0.51667],
      "113": [0.19444, 0.44444, 0, 0, 0.51667],
      "114": [0, 0.44444, 0.01389, 0, 0.34167],
      "115": [0, 0.44444, 0, 0, 0.38333],
      "116": [0, 0.57143, 0, 0, 0.36111],
      "117": [0, 0.44444, 0, 0, 0.51667],
      "118": [0, 0.44444, 0.01389, 0, 0.46111],
      "119": [0, 0.44444, 0.01389, 0, 0.68334],
      "120": [0, 0.44444, 0, 0, 0.46111],
      "121": [0.19444, 0.44444, 0.01389, 0, 0.46111],
      "122": [0, 0.44444, 0, 0, 0.43472],
      "126": [0.35, 0.32659, 0, 0, 0.5],
      "160": [0, 0, 0, 0, 0.25],
      "168": [0, 0.67937, 0, 0, 0.5],
      "176": [0, 0.69444, 0, 0, 0.66667],
      "184": [0.17014, 0, 0, 0, 0.44445],
      "305": [0, 0.44444, 0, 0, 0.23889],
      "567": [0.19444, 0.44444, 0, 0, 0.26667],
      "710": [0, 0.69444, 0, 0, 0.5],
      "711": [0, 0.63194, 0, 0, 0.5],
      "713": [0, 0.60889, 0, 0, 0.5],
      "714": [0, 0.69444, 0, 0, 0.5],
      "715": [0, 0.69444, 0, 0, 0.5],
      "728": [0, 0.69444, 0, 0, 0.5],
      "729": [0, 0.67937, 0, 0, 0.27778],
      "730": [0, 0.69444, 0, 0, 0.66667],
      "732": [0, 0.67659, 0, 0, 0.5],
      "733": [0, 0.69444, 0, 0, 0.5],
      "915": [0, 0.69444, 0, 0, 0.54167],
      "916": [0, 0.69444, 0, 0, 0.83334],
      "920": [0, 0.69444, 0, 0, 0.77778],
      "923": [0, 0.69444, 0, 0, 0.61111],
      "926": [0, 0.69444, 0, 0, 0.66667],
      "928": [0, 0.69444, 0, 0, 0.70834],
      "931": [0, 0.69444, 0, 0, 0.72222],
      "933": [0, 0.69444, 0, 0, 0.77778],
      "934": [0, 0.69444, 0, 0, 0.72222],
      "936": [0, 0.69444, 0, 0, 0.77778],
      "937": [0, 0.69444, 0, 0, 0.72222],
      "8211": [0, 0.44444, 0.02778, 0, 0.5],
      "8212": [0, 0.44444, 0.02778, 0, 1],
      "8216": [0, 0.69444, 0, 0, 0.27778],
      "8217": [0, 0.69444, 0, 0, 0.27778],
      "8220": [0, 0.69444, 0, 0, 0.5],
      "8221": [0, 0.69444, 0, 0, 0.5]
    },
    "Script-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "65": [0, 0.7, 0.22925, 0, 0.80253],
      "66": [0, 0.7, 0.04087, 0, 0.90757],
      "67": [0, 0.7, 0.1689, 0, 0.66619],
      "68": [0, 0.7, 0.09371, 0, 0.77443],
      "69": [0, 0.7, 0.18583, 0, 0.56162],
      "70": [0, 0.7, 0.13634, 0, 0.89544],
      "71": [0, 0.7, 0.17322, 0, 0.60961],
      "72": [0, 0.7, 0.29694, 0, 0.96919],
      "73": [0, 0.7, 0.19189, 0, 0.80907],
      "74": [0.27778, 0.7, 0.19189, 0, 1.05159],
      "75": [0, 0.7, 0.31259, 0, 0.91364],
      "76": [0, 0.7, 0.19189, 0, 0.87373],
      "77": [0, 0.7, 0.15981, 0, 1.08031],
      "78": [0, 0.7, 0.3525, 0, 0.9015],
      "79": [0, 0.7, 0.08078, 0, 0.73787],
      "80": [0, 0.7, 0.08078, 0, 1.01262],
      "81": [0, 0.7, 0.03305, 0, 0.88282],
      "82": [0, 0.7, 0.06259, 0, 0.85],
      "83": [0, 0.7, 0.19189, 0, 0.86767],
      "84": [0, 0.7, 0.29087, 0, 0.74697],
      "85": [0, 0.7, 0.25815, 0, 0.79996],
      "86": [0, 0.7, 0.27523, 0, 0.62204],
      "87": [0, 0.7, 0.27523, 0, 0.80532],
      "88": [0, 0.7, 0.26006, 0, 0.94445],
      "89": [0, 0.7, 0.2939, 0, 0.70961],
      "90": [0, 0.7, 0.24037, 0, 0.8212],
      "160": [0, 0, 0, 0, 0.25]
    },
    "Size1-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "40": [0.35001, 0.85, 0, 0, 0.45834],
      "41": [0.35001, 0.85, 0, 0, 0.45834],
      "47": [0.35001, 0.85, 0, 0, 0.57778],
      "91": [0.35001, 0.85, 0, 0, 0.41667],
      "92": [0.35001, 0.85, 0, 0, 0.57778],
      "93": [0.35001, 0.85, 0, 0, 0.41667],
      "123": [0.35001, 0.85, 0, 0, 0.58334],
      "125": [0.35001, 0.85, 0, 0, 0.58334],
      "160": [0, 0, 0, 0, 0.25],
      "710": [0, 0.72222, 0, 0, 0.55556],
      "732": [0, 0.72222, 0, 0, 0.55556],
      "770": [0, 0.72222, 0, 0, 0.55556],
      "771": [0, 0.72222, 0, 0, 0.55556],
      "8214": [-99e-5, 0.601, 0, 0, 0.77778],
      "8593": [1e-5, 0.6, 0, 0, 0.66667],
      "8595": [1e-5, 0.6, 0, 0, 0.66667],
      "8657": [1e-5, 0.6, 0, 0, 0.77778],
      "8659": [1e-5, 0.6, 0, 0, 0.77778],
      "8719": [0.25001, 0.75, 0, 0, 0.94445],
      "8720": [0.25001, 0.75, 0, 0, 0.94445],
      "8721": [0.25001, 0.75, 0, 0, 1.05556],
      "8730": [0.35001, 0.85, 0, 0, 1],
      "8739": [-599e-5, 0.606, 0, 0, 0.33333],
      "8741": [-599e-5, 0.606, 0, 0, 0.55556],
      "8747": [0.30612, 0.805, 0.19445, 0, 0.47222],
      "8748": [0.306, 0.805, 0.19445, 0, 0.47222],
      "8749": [0.306, 0.805, 0.19445, 0, 0.47222],
      "8750": [0.30612, 0.805, 0.19445, 0, 0.47222],
      "8896": [0.25001, 0.75, 0, 0, 0.83334],
      "8897": [0.25001, 0.75, 0, 0, 0.83334],
      "8898": [0.25001, 0.75, 0, 0, 0.83334],
      "8899": [0.25001, 0.75, 0, 0, 0.83334],
      "8968": [0.35001, 0.85, 0, 0, 0.47222],
      "8969": [0.35001, 0.85, 0, 0, 0.47222],
      "8970": [0.35001, 0.85, 0, 0, 0.47222],
      "8971": [0.35001, 0.85, 0, 0, 0.47222],
      "9168": [-99e-5, 0.601, 0, 0, 0.66667],
      "10216": [0.35001, 0.85, 0, 0, 0.47222],
      "10217": [0.35001, 0.85, 0, 0, 0.47222],
      "10752": [0.25001, 0.75, 0, 0, 1.11111],
      "10753": [0.25001, 0.75, 0, 0, 1.11111],
      "10754": [0.25001, 0.75, 0, 0, 1.11111],
      "10756": [0.25001, 0.75, 0, 0, 0.83334],
      "10758": [0.25001, 0.75, 0, 0, 0.83334]
    },
    "Size2-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "40": [0.65002, 1.15, 0, 0, 0.59722],
      "41": [0.65002, 1.15, 0, 0, 0.59722],
      "47": [0.65002, 1.15, 0, 0, 0.81111],
      "91": [0.65002, 1.15, 0, 0, 0.47222],
      "92": [0.65002, 1.15, 0, 0, 0.81111],
      "93": [0.65002, 1.15, 0, 0, 0.47222],
      "123": [0.65002, 1.15, 0, 0, 0.66667],
      "125": [0.65002, 1.15, 0, 0, 0.66667],
      "160": [0, 0, 0, 0, 0.25],
      "710": [0, 0.75, 0, 0, 1],
      "732": [0, 0.75, 0, 0, 1],
      "770": [0, 0.75, 0, 0, 1],
      "771": [0, 0.75, 0, 0, 1],
      "8719": [0.55001, 1.05, 0, 0, 1.27778],
      "8720": [0.55001, 1.05, 0, 0, 1.27778],
      "8721": [0.55001, 1.05, 0, 0, 1.44445],
      "8730": [0.65002, 1.15, 0, 0, 1],
      "8747": [0.86225, 1.36, 0.44445, 0, 0.55556],
      "8748": [0.862, 1.36, 0.44445, 0, 0.55556],
      "8749": [0.862, 1.36, 0.44445, 0, 0.55556],
      "8750": [0.86225, 1.36, 0.44445, 0, 0.55556],
      "8896": [0.55001, 1.05, 0, 0, 1.11111],
      "8897": [0.55001, 1.05, 0, 0, 1.11111],
      "8898": [0.55001, 1.05, 0, 0, 1.11111],
      "8899": [0.55001, 1.05, 0, 0, 1.11111],
      "8968": [0.65002, 1.15, 0, 0, 0.52778],
      "8969": [0.65002, 1.15, 0, 0, 0.52778],
      "8970": [0.65002, 1.15, 0, 0, 0.52778],
      "8971": [0.65002, 1.15, 0, 0, 0.52778],
      "10216": [0.65002, 1.15, 0, 0, 0.61111],
      "10217": [0.65002, 1.15, 0, 0, 0.61111],
      "10752": [0.55001, 1.05, 0, 0, 1.51112],
      "10753": [0.55001, 1.05, 0, 0, 1.51112],
      "10754": [0.55001, 1.05, 0, 0, 1.51112],
      "10756": [0.55001, 1.05, 0, 0, 1.11111],
      "10758": [0.55001, 1.05, 0, 0, 1.11111]
    },
    "Size3-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "40": [0.95003, 1.45, 0, 0, 0.73611],
      "41": [0.95003, 1.45, 0, 0, 0.73611],
      "47": [0.95003, 1.45, 0, 0, 1.04445],
      "91": [0.95003, 1.45, 0, 0, 0.52778],
      "92": [0.95003, 1.45, 0, 0, 1.04445],
      "93": [0.95003, 1.45, 0, 0, 0.52778],
      "123": [0.95003, 1.45, 0, 0, 0.75],
      "125": [0.95003, 1.45, 0, 0, 0.75],
      "160": [0, 0, 0, 0, 0.25],
      "710": [0, 0.75, 0, 0, 1.44445],
      "732": [0, 0.75, 0, 0, 1.44445],
      "770": [0, 0.75, 0, 0, 1.44445],
      "771": [0, 0.75, 0, 0, 1.44445],
      "8730": [0.95003, 1.45, 0, 0, 1],
      "8968": [0.95003, 1.45, 0, 0, 0.58334],
      "8969": [0.95003, 1.45, 0, 0, 0.58334],
      "8970": [0.95003, 1.45, 0, 0, 0.58334],
      "8971": [0.95003, 1.45, 0, 0, 0.58334],
      "10216": [0.95003, 1.45, 0, 0, 0.75],
      "10217": [0.95003, 1.45, 0, 0, 0.75]
    },
    "Size4-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "40": [1.25003, 1.75, 0, 0, 0.79167],
      "41": [1.25003, 1.75, 0, 0, 0.79167],
      "47": [1.25003, 1.75, 0, 0, 1.27778],
      "91": [1.25003, 1.75, 0, 0, 0.58334],
      "92": [1.25003, 1.75, 0, 0, 1.27778],
      "93": [1.25003, 1.75, 0, 0, 0.58334],
      "123": [1.25003, 1.75, 0, 0, 0.80556],
      "125": [1.25003, 1.75, 0, 0, 0.80556],
      "160": [0, 0, 0, 0, 0.25],
      "710": [0, 0.825, 0, 0, 1.8889],
      "732": [0, 0.825, 0, 0, 1.8889],
      "770": [0, 0.825, 0, 0, 1.8889],
      "771": [0, 0.825, 0, 0, 1.8889],
      "8730": [1.25003, 1.75, 0, 0, 1],
      "8968": [1.25003, 1.75, 0, 0, 0.63889],
      "8969": [1.25003, 1.75, 0, 0, 0.63889],
      "8970": [1.25003, 1.75, 0, 0, 0.63889],
      "8971": [1.25003, 1.75, 0, 0, 0.63889],
      "9115": [0.64502, 1.155, 0, 0, 0.875],
      "9116": [1e-5, 0.6, 0, 0, 0.875],
      "9117": [0.64502, 1.155, 0, 0, 0.875],
      "9118": [0.64502, 1.155, 0, 0, 0.875],
      "9119": [1e-5, 0.6, 0, 0, 0.875],
      "9120": [0.64502, 1.155, 0, 0, 0.875],
      "9121": [0.64502, 1.155, 0, 0, 0.66667],
      "9122": [-99e-5, 0.601, 0, 0, 0.66667],
      "9123": [0.64502, 1.155, 0, 0, 0.66667],
      "9124": [0.64502, 1.155, 0, 0, 0.66667],
      "9125": [-99e-5, 0.601, 0, 0, 0.66667],
      "9126": [0.64502, 1.155, 0, 0, 0.66667],
      "9127": [1e-5, 0.9, 0, 0, 0.88889],
      "9128": [0.65002, 1.15, 0, 0, 0.88889],
      "9129": [0.90001, 0, 0, 0, 0.88889],
      "9130": [0, 0.3, 0, 0, 0.88889],
      "9131": [1e-5, 0.9, 0, 0, 0.88889],
      "9132": [0.65002, 1.15, 0, 0, 0.88889],
      "9133": [0.90001, 0, 0, 0, 0.88889],
      "9143": [0.88502, 0.915, 0, 0, 1.05556],
      "10216": [1.25003, 1.75, 0, 0, 0.80556],
      "10217": [1.25003, 1.75, 0, 0, 0.80556],
      "57344": [-499e-5, 0.605, 0, 0, 1.05556],
      "57345": [-499e-5, 0.605, 0, 0, 1.05556],
      "57680": [0, 0.12, 0, 0, 0.45],
      "57681": [0, 0.12, 0, 0, 0.45],
      "57682": [0, 0.12, 0, 0, 0.45],
      "57683": [0, 0.12, 0, 0, 0.45]
    },
    "Typewriter-Regular": {
      "32": [0, 0, 0, 0, 0.525],
      "33": [0, 0.61111, 0, 0, 0.525],
      "34": [0, 0.61111, 0, 0, 0.525],
      "35": [0, 0.61111, 0, 0, 0.525],
      "36": [0.08333, 0.69444, 0, 0, 0.525],
      "37": [0.08333, 0.69444, 0, 0, 0.525],
      "38": [0, 0.61111, 0, 0, 0.525],
      "39": [0, 0.61111, 0, 0, 0.525],
      "40": [0.08333, 0.69444, 0, 0, 0.525],
      "41": [0.08333, 0.69444, 0, 0, 0.525],
      "42": [0, 0.52083, 0, 0, 0.525],
      "43": [-0.08056, 0.53055, 0, 0, 0.525],
      "44": [0.13889, 0.125, 0, 0, 0.525],
      "45": [-0.08056, 0.53055, 0, 0, 0.525],
      "46": [0, 0.125, 0, 0, 0.525],
      "47": [0.08333, 0.69444, 0, 0, 0.525],
      "48": [0, 0.61111, 0, 0, 0.525],
      "49": [0, 0.61111, 0, 0, 0.525],
      "50": [0, 0.61111, 0, 0, 0.525],
      "51": [0, 0.61111, 0, 0, 0.525],
      "52": [0, 0.61111, 0, 0, 0.525],
      "53": [0, 0.61111, 0, 0, 0.525],
      "54": [0, 0.61111, 0, 0, 0.525],
      "55": [0, 0.61111, 0, 0, 0.525],
      "56": [0, 0.61111, 0, 0, 0.525],
      "57": [0, 0.61111, 0, 0, 0.525],
      "58": [0, 0.43056, 0, 0, 0.525],
      "59": [0.13889, 0.43056, 0, 0, 0.525],
      "60": [-0.05556, 0.55556, 0, 0, 0.525],
      "61": [-0.19549, 0.41562, 0, 0, 0.525],
      "62": [-0.05556, 0.55556, 0, 0, 0.525],
      "63": [0, 0.61111, 0, 0, 0.525],
      "64": [0, 0.61111, 0, 0, 0.525],
      "65": [0, 0.61111, 0, 0, 0.525],
      "66": [0, 0.61111, 0, 0, 0.525],
      "67": [0, 0.61111, 0, 0, 0.525],
      "68": [0, 0.61111, 0, 0, 0.525],
      "69": [0, 0.61111, 0, 0, 0.525],
      "70": [0, 0.61111, 0, 0, 0.525],
      "71": [0, 0.61111, 0, 0, 0.525],
      "72": [0, 0.61111, 0, 0, 0.525],
      "73": [0, 0.61111, 0, 0, 0.525],
      "74": [0, 0.61111, 0, 0, 0.525],
      "75": [0, 0.61111, 0, 0, 0.525],
      "76": [0, 0.61111, 0, 0, 0.525],
      "77": [0, 0.61111, 0, 0, 0.525],
      "78": [0, 0.61111, 0, 0, 0.525],
      "79": [0, 0.61111, 0, 0, 0.525],
      "80": [0, 0.61111, 0, 0, 0.525],
      "81": [0.13889, 0.61111, 0, 0, 0.525],
      "82": [0, 0.61111, 0, 0, 0.525],
      "83": [0, 0.61111, 0, 0, 0.525],
      "84": [0, 0.61111, 0, 0, 0.525],
      "85": [0, 0.61111, 0, 0, 0.525],
      "86": [0, 0.61111, 0, 0, 0.525],
      "87": [0, 0.61111, 0, 0, 0.525],
      "88": [0, 0.61111, 0, 0, 0.525],
      "89": [0, 0.61111, 0, 0, 0.525],
      "90": [0, 0.61111, 0, 0, 0.525],
      "91": [0.08333, 0.69444, 0, 0, 0.525],
      "92": [0.08333, 0.69444, 0, 0, 0.525],
      "93": [0.08333, 0.69444, 0, 0, 0.525],
      "94": [0, 0.61111, 0, 0, 0.525],
      "95": [0.09514, 0, 0, 0, 0.525],
      "96": [0, 0.61111, 0, 0, 0.525],
      "97": [0, 0.43056, 0, 0, 0.525],
      "98": [0, 0.61111, 0, 0, 0.525],
      "99": [0, 0.43056, 0, 0, 0.525],
      "100": [0, 0.61111, 0, 0, 0.525],
      "101": [0, 0.43056, 0, 0, 0.525],
      "102": [0, 0.61111, 0, 0, 0.525],
      "103": [0.22222, 0.43056, 0, 0, 0.525],
      "104": [0, 0.61111, 0, 0, 0.525],
      "105": [0, 0.61111, 0, 0, 0.525],
      "106": [0.22222, 0.61111, 0, 0, 0.525],
      "107": [0, 0.61111, 0, 0, 0.525],
      "108": [0, 0.61111, 0, 0, 0.525],
      "109": [0, 0.43056, 0, 0, 0.525],
      "110": [0, 0.43056, 0, 0, 0.525],
      "111": [0, 0.43056, 0, 0, 0.525],
      "112": [0.22222, 0.43056, 0, 0, 0.525],
      "113": [0.22222, 0.43056, 0, 0, 0.525],
      "114": [0, 0.43056, 0, 0, 0.525],
      "115": [0, 0.43056, 0, 0, 0.525],
      "116": [0, 0.55358, 0, 0, 0.525],
      "117": [0, 0.43056, 0, 0, 0.525],
      "118": [0, 0.43056, 0, 0, 0.525],
      "119": [0, 0.43056, 0, 0, 0.525],
      "120": [0, 0.43056, 0, 0, 0.525],
      "121": [0.22222, 0.43056, 0, 0, 0.525],
      "122": [0, 0.43056, 0, 0, 0.525],
      "123": [0.08333, 0.69444, 0, 0, 0.525],
      "124": [0.08333, 0.69444, 0, 0, 0.525],
      "125": [0.08333, 0.69444, 0, 0, 0.525],
      "126": [0, 0.61111, 0, 0, 0.525],
      "127": [0, 0.61111, 0, 0, 0.525],
      "160": [0, 0, 0, 0, 0.525],
      "176": [0, 0.61111, 0, 0, 0.525],
      "184": [0.19445, 0, 0, 0, 0.525],
      "305": [0, 0.43056, 0, 0, 0.525],
      "567": [0.22222, 0.43056, 0, 0, 0.525],
      "711": [0, 0.56597, 0, 0, 0.525],
      "713": [0, 0.56555, 0, 0, 0.525],
      "714": [0, 0.61111, 0, 0, 0.525],
      "715": [0, 0.61111, 0, 0, 0.525],
      "728": [0, 0.61111, 0, 0, 0.525],
      "730": [0, 0.61111, 0, 0, 0.525],
      "770": [0, 0.61111, 0, 0, 0.525],
      "771": [0, 0.61111, 0, 0, 0.525],
      "776": [0, 0.61111, 0, 0, 0.525],
      "915": [0, 0.61111, 0, 0, 0.525],
      "916": [0, 0.61111, 0, 0, 0.525],
      "920": [0, 0.61111, 0, 0, 0.525],
      "923": [0, 0.61111, 0, 0, 0.525],
      "926": [0, 0.61111, 0, 0, 0.525],
      "928": [0, 0.61111, 0, 0, 0.525],
      "931": [0, 0.61111, 0, 0, 0.525],
      "933": [0, 0.61111, 0, 0, 0.525],
      "934": [0, 0.61111, 0, 0, 0.525],
      "936": [0, 0.61111, 0, 0, 0.525],
      "937": [0, 0.61111, 0, 0, 0.525],
      "8216": [0, 0.61111, 0, 0, 0.525],
      "8217": [0, 0.61111, 0, 0, 0.525],
      "8242": [0, 0.61111, 0, 0, 0.525],
      "9251": [0.11111, 0.21944, 0, 0, 0.525]
    }
  };
  var sigmasAndXis = {
    slant: [0.25, 0.25, 0.25],
    // sigma1
    space: [0, 0, 0],
    // sigma2
    stretch: [0, 0, 0],
    // sigma3
    shrink: [0, 0, 0],
    // sigma4
    xHeight: [0.431, 0.431, 0.431],
    // sigma5
    quad: [1, 1.171, 1.472],
    // sigma6
    extraSpace: [0, 0, 0],
    // sigma7
    num1: [0.677, 0.732, 0.925],
    // sigma8
    num2: [0.394, 0.384, 0.387],
    // sigma9
    num3: [0.444, 0.471, 0.504],
    // sigma10
    denom1: [0.686, 0.752, 1.025],
    // sigma11
    denom2: [0.345, 0.344, 0.532],
    // sigma12
    sup1: [0.413, 0.503, 0.504],
    // sigma13
    sup2: [0.363, 0.431, 0.404],
    // sigma14
    sup3: [0.289, 0.286, 0.294],
    // sigma15
    sub1: [0.15, 0.143, 0.2],
    // sigma16
    sub2: [0.247, 0.286, 0.4],
    // sigma17
    supDrop: [0.386, 0.353, 0.494],
    // sigma18
    subDrop: [0.05, 0.071, 0.1],
    // sigma19
    delim1: [2.39, 1.7, 1.98],
    // sigma20
    delim2: [1.01, 1.157, 1.42],
    // sigma21
    axisHeight: [0.25, 0.25, 0.25],
    // sigma22
    // These font metrics are extracted from TeX by using tftopl on cmex10.tfm;
    // they correspond to the font parameters of the extension fonts (family 3).
    // See the TeXbook, page 441. In AMSTeX, the extension fonts scale; to
    // match cmex7, we'd use cmex7.tfm values for script and scriptscript
    // values.
    defaultRuleThickness: [0.04, 0.049, 0.049],
    // xi8; cmex7: 0.049
    bigOpSpacing1: [0.111, 0.111, 0.111],
    // xi9
    bigOpSpacing2: [0.166, 0.166, 0.166],
    // xi10
    bigOpSpacing3: [0.2, 0.2, 0.2],
    // xi11
    bigOpSpacing4: [0.6, 0.611, 0.611],
    // xi12; cmex7: 0.611
    bigOpSpacing5: [0.1, 0.143, 0.143],
    // xi13; cmex7: 0.143
    // The \sqrt rule width is taken from the height of the surd character.
    // Since we use the same font at all sizes, this thickness doesn't scale.
    sqrtRuleThickness: [0.04, 0.04, 0.04],
    // This value determines how large a pt is, for metrics which are defined
    // in terms of pts.
    // This value is also used in katex.scss; if you change it make sure the
    // values match.
    ptPerEm: [10, 10, 10],
    // The space between adjacent `|` columns in an array definition. From
    // `\showthe\doublerulesep` in LaTeX. Equals 2.0 / ptPerEm.
    doubleRuleSep: [0.2, 0.2, 0.2],
    // The width of separator lines in {array} environments. From
    // `\showthe\arrayrulewidth` in LaTeX. Equals 0.4 / ptPerEm.
    arrayRuleWidth: [0.04, 0.04, 0.04],
    // Two values from LaTeX source2e:
    fboxsep: [0.3, 0.3, 0.3],
    //        3 pt / ptPerEm
    fboxrule: [0.04, 0.04, 0.04]
    // 0.4 pt / ptPerEm
  };
  var extraCharacterMap = {
    // Latin-1
    "\xC5": "A",
    "\xD0": "D",
    "\xDE": "o",
    "\xE5": "a",
    "\xF0": "d",
    "\xFE": "o",
    // Cyrillic
    "\u0410": "A",
    "\u0411": "B",
    "\u0412": "B",
    "\u0413": "F",
    "\u0414": "A",
    "\u0415": "E",
    "\u0416": "K",
    "\u0417": "3",
    "\u0418": "N",
    "\u0419": "N",
    "\u041A": "K",
    "\u041B": "N",
    "\u041C": "M",
    "\u041D": "H",
    "\u041E": "O",
    "\u041F": "N",
    "\u0420": "P",
    "\u0421": "C",
    "\u0422": "T",
    "\u0423": "y",
    "\u0424": "O",
    "\u0425": "X",
    "\u0426": "U",
    "\u0427": "h",
    "\u0428": "W",
    "\u0429": "W",
    "\u042A": "B",
    "\u042B": "X",
    "\u042C": "B",
    "\u042D": "3",
    "\u042E": "X",
    "\u042F": "R",
    "\u0430": "a",
    "\u0431": "b",
    "\u0432": "a",
    "\u0433": "r",
    "\u0434": "y",
    "\u0435": "e",
    "\u0436": "m",
    "\u0437": "e",
    "\u0438": "n",
    "\u0439": "n",
    "\u043A": "n",
    "\u043B": "n",
    "\u043C": "m",
    "\u043D": "n",
    "\u043E": "o",
    "\u043F": "n",
    "\u0440": "p",
    "\u0441": "c",
    "\u0442": "o",
    "\u0443": "y",
    "\u0444": "b",
    "\u0445": "x",
    "\u0446": "n",
    "\u0447": "n",
    "\u0448": "w",
    "\u0449": "w",
    "\u044A": "a",
    "\u044B": "m",
    "\u044C": "a",
    "\u044D": "e",
    "\u044E": "m",
    "\u044F": "r"
  };
  function setFontMetrics(fontName, metrics) {
    fontMetricsData[fontName] = metrics;
  }
  function getCharacterMetrics(character, font, mode) {
    if (!fontMetricsData[font]) {
      throw new Error("Font metrics not found for font: " + font + ".");
    }
    var ch = character.charCodeAt(0);
    var metrics = fontMetricsData[font][ch];
    if (!metrics && character[0] in extraCharacterMap) {
      ch = extraCharacterMap[character[0]].charCodeAt(0);
      metrics = fontMetricsData[font][ch];
    }
    if (!metrics && mode === "text") {
      if (supportedCodepoint(ch)) {
        metrics = fontMetricsData[font][77];
      }
    }
    if (metrics) {
      return {
        depth: metrics[0],
        height: metrics[1],
        italic: metrics[2],
        skew: metrics[3],
        width: metrics[4]
      };
    }
  }
  var fontMetricsBySizeIndex = {};
  function getGlobalMetrics(size) {
    var sizeIndex;
    if (size >= 5) {
      sizeIndex = 0;
    } else if (size >= 3) {
      sizeIndex = 1;
    } else {
      sizeIndex = 2;
    }
    if (!fontMetricsBySizeIndex[sizeIndex]) {
      var metrics = fontMetricsBySizeIndex[sizeIndex] = {
        cssEmPerMu: sigmasAndXis.quad[sizeIndex] / 18
      };
      for (var key2 in sigmasAndXis) {
        if (sigmasAndXis.hasOwnProperty(key2)) {
          metrics[key2] = sigmasAndXis[key2][sizeIndex];
        }
      }
    }
    return fontMetricsBySizeIndex[sizeIndex];
  }
  var sizeStyleMap = [
    // Each element contains [textsize, scriptsize, scriptscriptsize].
    // The size mappings are taken from TeX with \normalsize=10pt.
    [1, 1, 1],
    // size1: [5, 5, 5]              \tiny
    [2, 1, 1],
    // size2: [6, 5, 5]
    [3, 1, 1],
    // size3: [7, 5, 5]              \scriptsize
    [4, 2, 1],
    // size4: [8, 6, 5]              \footnotesize
    [5, 2, 1],
    // size5: [9, 6, 5]              \small
    [6, 3, 1],
    // size6: [10, 7, 5]             \normalsize
    [7, 4, 2],
    // size7: [12, 8, 6]             \large
    [8, 6, 3],
    // size8: [14.4, 10, 7]          \Large
    [9, 7, 6],
    // size9: [17.28, 12, 10]        \LARGE
    [10, 8, 7],
    // size10: [20.74, 14.4, 12]     \huge
    [11, 10, 9]
    // size11: [24.88, 20.74, 17.28] \HUGE
  ];
  var sizeMultipliers = [
    // fontMetrics.js:getGlobalMetrics also uses size indexes, so if
    // you change size indexes, change that function.
    0.5,
    0.6,
    0.7,
    0.8,
    0.9,
    1,
    1.2,
    1.44,
    1.728,
    2.074,
    2.488
  ];
  var sizeAtStyle = function sizeAtStyle2(size, style) {
    return style.size < 2 ? size : sizeStyleMap[size - 1][style.size - 1];
  };
  var Options = class _Options {
    // A font family applies to a group of fonts (i.e. SansSerif), while a font
    // represents a specific font (i.e. SansSerif Bold).
    // See: https://tex.stackexchange.com/questions/22350/difference-between-textrm-and-mathrm
    /**
     * The base size index.
     */
    constructor(data) {
      this.style = void 0;
      this.color = void 0;
      this.size = void 0;
      this.textSize = void 0;
      this.phantom = void 0;
      this.font = void 0;
      this.fontFamily = void 0;
      this.fontWeight = void 0;
      this.fontShape = void 0;
      this.sizeMultiplier = void 0;
      this.maxSize = void 0;
      this.minRuleThickness = void 0;
      this._fontMetrics = void 0;
      this.style = data.style;
      this.color = data.color;
      this.size = data.size || _Options.BASESIZE;
      this.textSize = data.textSize || this.size;
      this.phantom = !!data.phantom;
      this.font = data.font || "";
      this.fontFamily = data.fontFamily || "";
      this.fontWeight = data.fontWeight || "";
      this.fontShape = data.fontShape || "";
      this.sizeMultiplier = sizeMultipliers[this.size - 1];
      this.maxSize = data.maxSize;
      this.minRuleThickness = data.minRuleThickness;
      this._fontMetrics = void 0;
    }
    /**
     * Returns a new options object with the same properties as "this".  Properties
     * from "extension" will be copied to the new options object.
     */
    extend(extension) {
      var data = {
        style: this.style,
        size: this.size,
        textSize: this.textSize,
        color: this.color,
        phantom: this.phantom,
        font: this.font,
        fontFamily: this.fontFamily,
        fontWeight: this.fontWeight,
        fontShape: this.fontShape,
        maxSize: this.maxSize,
        minRuleThickness: this.minRuleThickness
      };
      for (var key2 in extension) {
        if (extension.hasOwnProperty(key2)) {
          data[key2] = extension[key2];
        }
      }
      return new _Options(data);
    }
    /**
     * Return an options object with the given style. If `this.style === style`,
     * returns `this`.
     */
    havingStyle(style) {
      if (this.style === style) {
        return this;
      } else {
        return this.extend({
          style,
          size: sizeAtStyle(this.textSize, style)
        });
      }
    }
    /**
     * Return an options object with a cramped version of the current style. If
     * the current style is cramped, returns `this`.
     */
    havingCrampedStyle() {
      return this.havingStyle(this.style.cramp());
    }
    /**
     * Return an options object with the given size and in at least `\textstyle`.
     * Returns `this` if appropriate.
     */
    havingSize(size) {
      if (this.size === size && this.textSize === size) {
        return this;
      } else {
        return this.extend({
          style: this.style.text(),
          size,
          textSize: size,
          sizeMultiplier: sizeMultipliers[size - 1]
        });
      }
    }
    /**
     * Like `this.havingSize(BASESIZE).havingStyle(style)`. If `style` is omitted,
     * changes to at least `\textstyle`.
     */
    havingBaseStyle(style) {
      style = style || this.style.text();
      var wantSize = sizeAtStyle(_Options.BASESIZE, style);
      if (this.size === wantSize && this.textSize === _Options.BASESIZE && this.style === style) {
        return this;
      } else {
        return this.extend({
          style,
          size: wantSize
        });
      }
    }
    /**
     * Remove the effect of sizing changes such as \Huge.
     * Keep the effect of the current style, such as \scriptstyle.
     */
    havingBaseSizing() {
      var size;
      switch (this.style.id) {
        case 4:
        case 5:
          size = 3;
          break;
        case 6:
        case 7:
          size = 1;
          break;
        default:
          size = 6;
      }
      return this.extend({
        style: this.style.text(),
        size
      });
    }
    /**
     * Create a new options object with the given color.
     */
    withColor(color) {
      return this.extend({
        color
      });
    }
    /**
     * Create a new options object with "phantom" set to true.
     */
    withPhantom() {
      return this.extend({
        phantom: true
      });
    }
    /**
     * Creates a new options object with the given math font or old text font.
     * @type {[type]}
     */
    withFont(font) {
      return this.extend({
        font
      });
    }
    /**
     * Create a new options objects with the given fontFamily.
     */
    withTextFontFamily(fontFamily) {
      return this.extend({
        fontFamily,
        font: ""
      });
    }
    /**
     * Creates a new options object with the given font weight
     */
    withTextFontWeight(fontWeight) {
      return this.extend({
        fontWeight,
        font: ""
      });
    }
    /**
     * Creates a new options object with the given font weight
     */
    withTextFontShape(fontShape) {
      return this.extend({
        fontShape,
        font: ""
      });
    }
    /**
     * Return the CSS sizing classes required to switch from enclosing options
     * `oldOptions` to `this`. Returns an array of classes.
     */
    sizingClasses(oldOptions) {
      if (oldOptions.size !== this.size) {
        return ["sizing", "reset-size" + oldOptions.size, "size" + this.size];
      } else {
        return [];
      }
    }
    /**
     * Return the CSS sizing classes required to switch to the base size. Like
     * `this.havingSize(BASESIZE).sizingClasses(this)`.
     */
    baseSizingClasses() {
      if (this.size !== _Options.BASESIZE) {
        return ["sizing", "reset-size" + this.size, "size" + _Options.BASESIZE];
      } else {
        return [];
      }
    }
    /**
     * Return the font metrics for this size.
     */
    fontMetrics() {
      if (!this._fontMetrics) {
        this._fontMetrics = getGlobalMetrics(this.size);
      }
      return this._fontMetrics;
    }
    /**
     * Gets the CSS color of the current options object
     */
    getColor() {
      if (this.phantom) {
        return "transparent";
      } else {
        return this.color;
      }
    }
  };
  Options.BASESIZE = 6;
  var ptPerUnit = {
    // https://en.wikibooks.org/wiki/LaTeX/Lengths and
    // https://tex.stackexchange.com/a/8263
    "pt": 1,
    // TeX point
    "mm": 7227 / 2540,
    // millimeter
    "cm": 7227 / 254,
    // centimeter
    "in": 72.27,
    // inch
    "bp": 803 / 800,
    // big (PostScript) points
    "pc": 12,
    // pica
    "dd": 1238 / 1157,
    // didot
    "cc": 14856 / 1157,
    // cicero (12 didot)
    "nd": 685 / 642,
    // new didot
    "nc": 1370 / 107,
    // new cicero (12 new didot)
    "sp": 1 / 65536,
    // scaled point (TeX's internal smallest unit)
    // https://tex.stackexchange.com/a/41371
    "px": 803 / 800
    // \pdfpxdimen defaults to 1 bp in pdfTeX and LuaTeX
  };
  var relativeUnit = {
    "ex": true,
    "em": true,
    "mu": true
  };
  var validUnit = function validUnit2(unit) {
    if (typeof unit !== "string") {
      unit = unit.unit;
    }
    return unit in ptPerUnit || unit in relativeUnit || unit === "ex";
  };
  var calculateSize = function calculateSize2(sizeValue, options) {
    var scale;
    if (sizeValue.unit in ptPerUnit) {
      scale = ptPerUnit[sizeValue.unit] / options.fontMetrics().ptPerEm / options.sizeMultiplier;
    } else if (sizeValue.unit === "mu") {
      scale = options.fontMetrics().cssEmPerMu;
    } else {
      var unitOptions;
      if (options.style.isTight()) {
        unitOptions = options.havingStyle(options.style.text());
      } else {
        unitOptions = options;
      }
      if (sizeValue.unit === "ex") {
        scale = unitOptions.fontMetrics().xHeight;
      } else if (sizeValue.unit === "em") {
        scale = unitOptions.fontMetrics().quad;
      } else {
        throw new ParseError("Invalid unit: '" + sizeValue.unit + "'");
      }
      if (unitOptions !== options) {
        scale *= unitOptions.sizeMultiplier / options.sizeMultiplier;
      }
    }
    return Math.min(sizeValue.number * scale, options.maxSize);
  };
  var makeEm = function makeEm2(n) {
    return +n.toFixed(4) + "em";
  };
  var createClass = function createClass2(classes) {
    return classes.filter((cls) => cls).join(" ");
  };
  var initNode = function initNode2(classes, options, style) {
    this.classes = classes || [];
    this.attributes = {};
    this.height = 0;
    this.depth = 0;
    this.maxFontSize = 0;
    this.style = style || {};
    if (options) {
      if (options.style.isTight()) {
        this.classes.push("mtight");
      }
      var color = options.getColor();
      if (color) {
        this.style.color = color;
      }
    }
  };
  var toNode = function toNode2(tagName) {
    var node = document.createElement(tagName);
    node.className = createClass(this.classes);
    for (var style in this.style) {
      if (this.style.hasOwnProperty(style)) {
        node.style[style] = this.style[style];
      }
    }
    for (var attr in this.attributes) {
      if (this.attributes.hasOwnProperty(attr)) {
        node.setAttribute(attr, this.attributes[attr]);
      }
    }
    for (var i2 = 0; i2 < this.children.length; i2++) {
      node.appendChild(this.children[i2].toNode());
    }
    return node;
  };
  var invalidAttributeNameRegex = /[\s"'>/=\x00-\x1f]/;
  var toMarkup = function toMarkup2(tagName) {
    var markup = "<" + tagName;
    if (this.classes.length) {
      markup += ' class="' + utils.escape(createClass(this.classes)) + '"';
    }
    var styles2 = "";
    for (var style in this.style) {
      if (this.style.hasOwnProperty(style)) {
        styles2 += utils.hyphenate(style) + ":" + this.style[style] + ";";
      }
    }
    if (styles2) {
      markup += ' style="' + utils.escape(styles2) + '"';
    }
    for (var attr in this.attributes) {
      if (this.attributes.hasOwnProperty(attr)) {
        if (invalidAttributeNameRegex.test(attr)) {
          throw new ParseError("Invalid attribute name '" + attr + "'");
        }
        markup += " " + attr + '="' + utils.escape(this.attributes[attr]) + '"';
      }
    }
    markup += ">";
    for (var i2 = 0; i2 < this.children.length; i2++) {
      markup += this.children[i2].toMarkup();
    }
    markup += "</" + tagName + ">";
    return markup;
  };
  var Span = class {
    constructor(classes, children, options, style) {
      this.children = void 0;
      this.attributes = void 0;
      this.classes = void 0;
      this.height = void 0;
      this.depth = void 0;
      this.width = void 0;
      this.maxFontSize = void 0;
      this.style = void 0;
      initNode.call(this, classes, options, style);
      this.children = children || [];
    }
    /**
     * Sets an arbitrary attribute on the span. Warning: use this wisely. Not
     * all browsers support attributes the same, and having too many custom
     * attributes is probably bad.
     */
    setAttribute(attribute, value) {
      this.attributes[attribute] = value;
    }
    hasClass(className) {
      return this.classes.includes(className);
    }
    toNode() {
      return toNode.call(this, "span");
    }
    toMarkup() {
      return toMarkup.call(this, "span");
    }
  };
  var Anchor = class {
    constructor(href, classes, children, options) {
      this.children = void 0;
      this.attributes = void 0;
      this.classes = void 0;
      this.height = void 0;
      this.depth = void 0;
      this.maxFontSize = void 0;
      this.style = void 0;
      initNode.call(this, classes, options);
      this.children = children || [];
      this.setAttribute("href", href);
    }
    setAttribute(attribute, value) {
      this.attributes[attribute] = value;
    }
    hasClass(className) {
      return this.classes.includes(className);
    }
    toNode() {
      return toNode.call(this, "a");
    }
    toMarkup() {
      return toMarkup.call(this, "a");
    }
  };
  var Img = class {
    constructor(src, alt, style) {
      this.src = void 0;
      this.alt = void 0;
      this.classes = void 0;
      this.height = void 0;
      this.depth = void 0;
      this.maxFontSize = void 0;
      this.style = void 0;
      this.alt = alt;
      this.src = src;
      this.classes = ["mord"];
      this.style = style;
    }
    hasClass(className) {
      return this.classes.includes(className);
    }
    toNode() {
      var node = document.createElement("img");
      node.src = this.src;
      node.alt = this.alt;
      node.className = "mord";
      for (var style in this.style) {
        if (this.style.hasOwnProperty(style)) {
          node.style[style] = this.style[style];
        }
      }
      return node;
    }
    toMarkup() {
      var markup = '<img src="' + utils.escape(this.src) + '"' + (' alt="' + utils.escape(this.alt) + '"');
      var styles2 = "";
      for (var style in this.style) {
        if (this.style.hasOwnProperty(style)) {
          styles2 += utils.hyphenate(style) + ":" + this.style[style] + ";";
        }
      }
      if (styles2) {
        markup += ' style="' + utils.escape(styles2) + '"';
      }
      markup += "'/>";
      return markup;
    }
  };
  var iCombinations = {
    "\xEE": "\u0131\u0302",
    "\xEF": "\u0131\u0308",
    "\xED": "\u0131\u0301",
    // 'ī': '\u0131\u0304', // enable when we add Extended Latin
    "\xEC": "\u0131\u0300"
  };
  var SymbolNode = class {
    constructor(text3, height, depth, italic, skew, width, classes, style) {
      this.text = void 0;
      this.height = void 0;
      this.depth = void 0;
      this.italic = void 0;
      this.skew = void 0;
      this.width = void 0;
      this.maxFontSize = void 0;
      this.classes = void 0;
      this.style = void 0;
      this.text = text3;
      this.height = height || 0;
      this.depth = depth || 0;
      this.italic = italic || 0;
      this.skew = skew || 0;
      this.width = width || 0;
      this.classes = classes || [];
      this.style = style || {};
      this.maxFontSize = 0;
      var script = scriptFromCodepoint(this.text.charCodeAt(0));
      if (script) {
        this.classes.push(script + "_fallback");
      }
      if (/[îïíì]/.test(this.text)) {
        this.text = iCombinations[this.text];
      }
    }
    hasClass(className) {
      return this.classes.includes(className);
    }
    /**
     * Creates a text node or span from a symbol node. Note that a span is only
     * created if it is needed.
     */
    toNode() {
      var node = document.createTextNode(this.text);
      var span = null;
      if (this.italic > 0) {
        span = document.createElement("span");
        span.style.marginRight = makeEm(this.italic);
      }
      if (this.classes.length > 0) {
        span = span || document.createElement("span");
        span.className = createClass(this.classes);
      }
      for (var style in this.style) {
        if (this.style.hasOwnProperty(style)) {
          span = span || document.createElement("span");
          span.style[style] = this.style[style];
        }
      }
      if (span) {
        span.appendChild(node);
        return span;
      } else {
        return node;
      }
    }
    /**
     * Creates markup for a symbol node.
     */
    toMarkup() {
      var needsSpan = false;
      var markup = "<span";
      if (this.classes.length) {
        needsSpan = true;
        markup += ' class="';
        markup += utils.escape(createClass(this.classes));
        markup += '"';
      }
      var styles2 = "";
      if (this.italic > 0) {
        styles2 += "margin-right:" + this.italic + "em;";
      }
      for (var style in this.style) {
        if (this.style.hasOwnProperty(style)) {
          styles2 += utils.hyphenate(style) + ":" + this.style[style] + ";";
        }
      }
      if (styles2) {
        needsSpan = true;
        markup += ' style="' + utils.escape(styles2) + '"';
      }
      var escaped = utils.escape(this.text);
      if (needsSpan) {
        markup += ">";
        markup += escaped;
        markup += "</span>";
        return markup;
      } else {
        return escaped;
      }
    }
  };
  var SvgNode = class {
    constructor(children, attributes) {
      this.children = void 0;
      this.attributes = void 0;
      this.children = children || [];
      this.attributes = attributes || {};
    }
    toNode() {
      var svgNS = "http://www.w3.org/2000/svg";
      var node = document.createElementNS(svgNS, "svg");
      for (var attr in this.attributes) {
        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
          node.setAttribute(attr, this.attributes[attr]);
        }
      }
      for (var i2 = 0; i2 < this.children.length; i2++) {
        node.appendChild(this.children[i2].toNode());
      }
      return node;
    }
    toMarkup() {
      var markup = '<svg xmlns="http://www.w3.org/2000/svg"';
      for (var attr in this.attributes) {
        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
          markup += " " + attr + '="' + utils.escape(this.attributes[attr]) + '"';
        }
      }
      markup += ">";
      for (var i2 = 0; i2 < this.children.length; i2++) {
        markup += this.children[i2].toMarkup();
      }
      markup += "</svg>";
      return markup;
    }
  };
  var PathNode = class {
    constructor(pathName, alternate) {
      this.pathName = void 0;
      this.alternate = void 0;
      this.pathName = pathName;
      this.alternate = alternate;
    }
    toNode() {
      var svgNS = "http://www.w3.org/2000/svg";
      var node = document.createElementNS(svgNS, "path");
      if (this.alternate) {
        node.setAttribute("d", this.alternate);
      } else {
        node.setAttribute("d", path[this.pathName]);
      }
      return node;
    }
    toMarkup() {
      if (this.alternate) {
        return '<path d="' + utils.escape(this.alternate) + '"/>';
      } else {
        return '<path d="' + utils.escape(path[this.pathName]) + '"/>';
      }
    }
  };
  var LineNode = class {
    constructor(attributes) {
      this.attributes = void 0;
      this.attributes = attributes || {};
    }
    toNode() {
      var svgNS = "http://www.w3.org/2000/svg";
      var node = document.createElementNS(svgNS, "line");
      for (var attr in this.attributes) {
        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
          node.setAttribute(attr, this.attributes[attr]);
        }
      }
      return node;
    }
    toMarkup() {
      var markup = "<line";
      for (var attr in this.attributes) {
        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
          markup += " " + attr + '="' + utils.escape(this.attributes[attr]) + '"';
        }
      }
      markup += "/>";
      return markup;
    }
  };
  function assertSymbolDomNode(group) {
    if (group instanceof SymbolNode) {
      return group;
    } else {
      throw new Error("Expected symbolNode but got " + String(group) + ".");
    }
  }
  function assertSpan(group) {
    if (group instanceof Span) {
      return group;
    } else {
      throw new Error("Expected span<HtmlDomNode> but got " + String(group) + ".");
    }
  }
  var ATOMS = {
    "bin": 1,
    "close": 1,
    "inner": 1,
    "open": 1,
    "punct": 1,
    "rel": 1
  };
  var NON_ATOMS = {
    "accent-token": 1,
    "mathord": 1,
    "op-token": 1,
    "spacing": 1,
    "textord": 1
  };
  var symbols = {
    "math": {},
    "text": {}
  };
  function defineSymbol(mode, font, group, replace, name, acceptUnicodeChar) {
    symbols[mode][name] = {
      font,
      group,
      replace
    };
    if (acceptUnicodeChar && replace) {
      symbols[mode][replace] = symbols[mode][name];
    }
  }
  var math = "math";
  var text = "text";
  var main = "main";
  var ams = "ams";
  var accent = "accent-token";
  var bin = "bin";
  var close = "close";
  var inner = "inner";
  var mathord = "mathord";
  var op = "op-token";
  var open = "open";
  var punct = "punct";
  var rel = "rel";
  var spacing = "spacing";
  var textord = "textord";
  defineSymbol(math, main, rel, "\u2261", "\\equiv", true);
  defineSymbol(math, main, rel, "\u227A", "\\prec", true);
  defineSymbol(math, main, rel, "\u227B", "\\succ", true);
  defineSymbol(math, main, rel, "\u223C", "\\sim", true);
  defineSymbol(math, main, rel, "\u22A5", "\\perp");
  defineSymbol(math, main, rel, "\u2AAF", "\\preceq", true);
  defineSymbol(math, main, rel, "\u2AB0", "\\succeq", true);
  defineSymbol(math, main, rel, "\u2243", "\\simeq", true);
  defineSymbol(math, main, rel, "\u2223", "\\mid", true);
  defineSymbol(math, main, rel, "\u226A", "\\ll", true);
  defineSymbol(math, main, rel, "\u226B", "\\gg", true);
  defineSymbol(math, main, rel, "\u224D", "\\asymp", true);
  defineSymbol(math, main, rel, "\u2225", "\\parallel");
  defineSymbol(math, main, rel, "\u22C8", "\\bowtie", true);
  defineSymbol(math, main, rel, "\u2323", "\\smile", true);
  defineSymbol(math, main, rel, "\u2291", "\\sqsubseteq", true);
  defineSymbol(math, main, rel, "\u2292", "\\sqsupseteq", true);
  defineSymbol(math, main, rel, "\u2250", "\\doteq", true);
  defineSymbol(math, main, rel, "\u2322", "\\frown", true);
  defineSymbol(math, main, rel, "\u220B", "\\ni", true);
  defineSymbol(math, main, rel, "\u221D", "\\propto", true);
  defineSymbol(math, main, rel, "\u22A2", "\\vdash", true);
  defineSymbol(math, main, rel, "\u22A3", "\\dashv", true);
  defineSymbol(math, main, rel, "\u220B", "\\owns");
  defineSymbol(math, main, punct, ".", "\\ldotp");
  defineSymbol(math, main, punct, "\u22C5", "\\cdotp");
  defineSymbol(math, main, textord, "#", "\\#");
  defineSymbol(text, main, textord, "#", "\\#");
  defineSymbol(math, main, textord, "&", "\\&");
  defineSymbol(text, main, textord, "&", "\\&");
  defineSymbol(math, main, textord, "\u2135", "\\aleph", true);
  defineSymbol(math, main, textord, "\u2200", "\\forall", true);
  defineSymbol(math, main, textord, "\u210F", "\\hbar", true);
  defineSymbol(math, main, textord, "\u2203", "\\exists", true);
  defineSymbol(math, main, textord, "\u2207", "\\nabla", true);
  defineSymbol(math, main, textord, "\u266D", "\\flat", true);
  defineSymbol(math, main, textord, "\u2113", "\\ell", true);
  defineSymbol(math, main, textord, "\u266E", "\\natural", true);
  defineSymbol(math, main, textord, "\u2663", "\\clubsuit", true);
  defineSymbol(math, main, textord, "\u2118", "\\wp", true);
  defineSymbol(math, main, textord, "\u266F", "\\sharp", true);
  defineSymbol(math, main, textord, "\u2662", "\\diamondsuit", true);
  defineSymbol(math, main, textord, "\u211C", "\\Re", true);
  defineSymbol(math, main, textord, "\u2661", "\\heartsuit", true);
  defineSymbol(math, main, textord, "\u2111", "\\Im", true);
  defineSymbol(math, main, textord, "\u2660", "\\spadesuit", true);
  defineSymbol(math, main, textord, "\xA7", "\\S", true);
  defineSymbol(text, main, textord, "\xA7", "\\S");
  defineSymbol(math, main, textord, "\xB6", "\\P", true);
  defineSymbol(text, main, textord, "\xB6", "\\P");
  defineSymbol(math, main, textord, "\u2020", "\\dag");
  defineSymbol(text, main, textord, "\u2020", "\\dag");
  defineSymbol(text, main, textord, "\u2020", "\\textdagger");
  defineSymbol(math, main, textord, "\u2021", "\\ddag");
  defineSymbol(text, main, textord, "\u2021", "\\ddag");
  defineSymbol(text, main, textord, "\u2021", "\\textdaggerdbl");
  defineSymbol(math, main, close, "\u23B1", "\\rmoustache", true);
  defineSymbol(math, main, open, "\u23B0", "\\lmoustache", true);
  defineSymbol(math, main, close, "\u27EF", "\\rgroup", true);
  defineSymbol(math, main, open, "\u27EE", "\\lgroup", true);
  defineSymbol(math, main, bin, "\u2213", "\\mp", true);
  defineSymbol(math, main, bin, "\u2296", "\\ominus", true);
  defineSymbol(math, main, bin, "\u228E", "\\uplus", true);
  defineSymbol(math, main, bin, "\u2293", "\\sqcap", true);
  defineSymbol(math, main, bin, "\u2217", "\\ast");
  defineSymbol(math, main, bin, "\u2294", "\\sqcup", true);
  defineSymbol(math, main, bin, "\u25EF", "\\bigcirc", true);
  defineSymbol(math, main, bin, "\u2219", "\\bullet", true);
  defineSymbol(math, main, bin, "\u2021", "\\ddagger");
  defineSymbol(math, main, bin, "\u2240", "\\wr", true);
  defineSymbol(math, main, bin, "\u2A3F", "\\amalg");
  defineSymbol(math, main, bin, "&", "\\And");
  defineSymbol(math, main, rel, "\u27F5", "\\longleftarrow", true);
  defineSymbol(math, main, rel, "\u21D0", "\\Leftarrow", true);
  defineSymbol(math, main, rel, "\u27F8", "\\Longleftarrow", true);
  defineSymbol(math, main, rel, "\u27F6", "\\longrightarrow", true);
  defineSymbol(math, main, rel, "\u21D2", "\\Rightarrow", true);
  defineSymbol(math, main, rel, "\u27F9", "\\Longrightarrow", true);
  defineSymbol(math, main, rel, "\u2194", "\\leftrightarrow", true);
  defineSymbol(math, main, rel, "\u27F7", "\\longleftrightarrow", true);
  defineSymbol(math, main, rel, "\u21D4", "\\Leftrightarrow", true);
  defineSymbol(math, main, rel, "\u27FA", "\\Longleftrightarrow", true);
  defineSymbol(math, main, rel, "\u21A6", "\\mapsto", true);
  defineSymbol(math, main, rel, "\u27FC", "\\longmapsto", true);
  defineSymbol(math, main, rel, "\u2197", "\\nearrow", true);
  defineSymbol(math, main, rel, "\u21A9", "\\hookleftarrow", true);
  defineSymbol(math, main, rel, "\u21AA", "\\hookrightarrow", true);
  defineSymbol(math, main, rel, "\u2198", "\\searrow", true);
  defineSymbol(math, main, rel, "\u21BC", "\\leftharpoonup", true);
  defineSymbol(math, main, rel, "\u21C0", "\\rightharpoonup", true);
  defineSymbol(math, main, rel, "\u2199", "\\swarrow", true);
  defineSymbol(math, main, rel, "\u21BD", "\\leftharpoondown", true);
  defineSymbol(math, main, rel, "\u21C1", "\\rightharpoondown", true);
  defineSymbol(math, main, rel, "\u2196", "\\nwarrow", true);
  defineSymbol(math, main, rel, "\u21CC", "\\rightleftharpoons", true);
  defineSymbol(math, ams, rel, "\u226E", "\\nless", true);
  defineSymbol(math, ams, rel, "\uE010", "\\@nleqslant");
  defineSymbol(math, ams, rel, "\uE011", "\\@nleqq");
  defineSymbol(math, ams, rel, "\u2A87", "\\lneq", true);
  defineSymbol(math, ams, rel, "\u2268", "\\lneqq", true);
  defineSymbol(math, ams, rel, "\uE00C", "\\@lvertneqq");
  defineSymbol(math, ams, rel, "\u22E6", "\\lnsim", true);
  defineSymbol(math, ams, rel, "\u2A89", "\\lnapprox", true);
  defineSymbol(math, ams, rel, "\u2280", "\\nprec", true);
  defineSymbol(math, ams, rel, "\u22E0", "\\npreceq", true);
  defineSymbol(math, ams, rel, "\u22E8", "\\precnsim", true);
  defineSymbol(math, ams, rel, "\u2AB9", "\\precnapprox", true);
  defineSymbol(math, ams, rel, "\u2241", "\\nsim", true);
  defineSymbol(math, ams, rel, "\uE006", "\\@nshortmid");
  defineSymbol(math, ams, rel, "\u2224", "\\nmid", true);
  defineSymbol(math, ams, rel, "\u22AC", "\\nvdash", true);
  defineSymbol(math, ams, rel, "\u22AD", "\\nvDash", true);
  defineSymbol(math, ams, rel, "\u22EA", "\\ntriangleleft");
  defineSymbol(math, ams, rel, "\u22EC", "\\ntrianglelefteq", true);
  defineSymbol(math, ams, rel, "\u228A", "\\subsetneq", true);
  defineSymbol(math, ams, rel, "\uE01A", "\\@varsubsetneq");
  defineSymbol(math, ams, rel, "\u2ACB", "\\subsetneqq", true);
  defineSymbol(math, ams, rel, "\uE017", "\\@varsubsetneqq");
  defineSymbol(math, ams, rel, "\u226F", "\\ngtr", true);
  defineSymbol(math, ams, rel, "\uE00F", "\\@ngeqslant");
  defineSymbol(math, ams, rel, "\uE00E", "\\@ngeqq");
  defineSymbol(math, ams, rel, "\u2A88", "\\gneq", true);
  defineSymbol(math, ams, rel, "\u2269", "\\gneqq", true);
  defineSymbol(math, ams, rel, "\uE00D", "\\@gvertneqq");
  defineSymbol(math, ams, rel, "\u22E7", "\\gnsim", true);
  defineSymbol(math, ams, rel, "\u2A8A", "\\gnapprox", true);
  defineSymbol(math, ams, rel, "\u2281", "\\nsucc", true);
  defineSymbol(math, ams, rel, "\u22E1", "\\nsucceq", true);
  defineSymbol(math, ams, rel, "\u22E9", "\\succnsim", true);
  defineSymbol(math, ams, rel, "\u2ABA", "\\succnapprox", true);
  defineSymbol(math, ams, rel, "\u2246", "\\ncong", true);
  defineSymbol(math, ams, rel, "\uE007", "\\@nshortparallel");
  defineSymbol(math, ams, rel, "\u2226", "\\nparallel", true);
  defineSymbol(math, ams, rel, "\u22AF", "\\nVDash", true);
  defineSymbol(math, ams, rel, "\u22EB", "\\ntriangleright");
  defineSymbol(math, ams, rel, "\u22ED", "\\ntrianglerighteq", true);
  defineSymbol(math, ams, rel, "\uE018", "\\@nsupseteqq");
  defineSymbol(math, ams, rel, "\u228B", "\\supsetneq", true);
  defineSymbol(math, ams, rel, "\uE01B", "\\@varsupsetneq");
  defineSymbol(math, ams, rel, "\u2ACC", "\\supsetneqq", true);
  defineSymbol(math, ams, rel, "\uE019", "\\@varsupsetneqq");
  defineSymbol(math, ams, rel, "\u22AE", "\\nVdash", true);
  defineSymbol(math, ams, rel, "\u2AB5", "\\precneqq", true);
  defineSymbol(math, ams, rel, "\u2AB6", "\\succneqq", true);
  defineSymbol(math, ams, rel, "\uE016", "\\@nsubseteqq");
  defineSymbol(math, ams, bin, "\u22B4", "\\unlhd");
  defineSymbol(math, ams, bin, "\u22B5", "\\unrhd");
  defineSymbol(math, ams, rel, "\u219A", "\\nleftarrow", true);
  defineSymbol(math, ams, rel, "\u219B", "\\nrightarrow", true);
  defineSymbol(math, ams, rel, "\u21CD", "\\nLeftarrow", true);
  defineSymbol(math, ams, rel, "\u21CF", "\\nRightarrow", true);
  defineSymbol(math, ams, rel, "\u21AE", "\\nleftrightarrow", true);
  defineSymbol(math, ams, rel, "\u21CE", "\\nLeftrightarrow", true);
  defineSymbol(math, ams, rel, "\u25B3", "\\vartriangle");
  defineSymbol(math, ams, textord, "\u210F", "\\hslash");
  defineSymbol(math, ams, textord, "\u25BD", "\\triangledown");
  defineSymbol(math, ams, textord, "\u25CA", "\\lozenge");
  defineSymbol(math, ams, textord, "\u24C8", "\\circledS");
  defineSymbol(math, ams, textord, "\xAE", "\\circledR");
  defineSymbol(text, ams, textord, "\xAE", "\\circledR");
  defineSymbol(math, ams, textord, "\u2221", "\\measuredangle", true);
  defineSymbol(math, ams, textord, "\u2204", "\\nexists");
  defineSymbol(math, ams, textord, "\u2127", "\\mho");
  defineSymbol(math, ams, textord, "\u2132", "\\Finv", true);
  defineSymbol(math, ams, textord, "\u2141", "\\Game", true);
  defineSymbol(math, ams, textord, "\u2035", "\\backprime");
  defineSymbol(math, ams, textord, "\u25B2", "\\blacktriangle");
  defineSymbol(math, ams, textord, "\u25BC", "\\blacktriangledown");
  defineSymbol(math, ams, textord, "\u25A0", "\\blacksquare");
  defineSymbol(math, ams, textord, "\u29EB", "\\blacklozenge");
  defineSymbol(math, ams, textord, "\u2605", "\\bigstar");
  defineSymbol(math, ams, textord, "\u2222", "\\sphericalangle", true);
  defineSymbol(math, ams, textord, "\u2201", "\\complement", true);
  defineSymbol(math, ams, textord, "\xF0", "\\eth", true);
  defineSymbol(text, main, textord, "\xF0", "\xF0");
  defineSymbol(math, ams, textord, "\u2571", "\\diagup");
  defineSymbol(math, ams, textord, "\u2572", "\\diagdown");
  defineSymbol(math, ams, textord, "\u25A1", "\\square");
  defineSymbol(math, ams, textord, "\u25A1", "\\Box");
  defineSymbol(math, ams, textord, "\u25CA", "\\Diamond");
  defineSymbol(math, ams, textord, "\xA5", "\\yen", true);
  defineSymbol(text, ams, textord, "\xA5", "\\yen", true);
  defineSymbol(math, ams, textord, "\u2713", "\\checkmark", true);
  defineSymbol(text, ams, textord, "\u2713", "\\checkmark");
  defineSymbol(math, ams, textord, "\u2136", "\\beth", true);
  defineSymbol(math, ams, textord, "\u2138", "\\daleth", true);
  defineSymbol(math, ams, textord, "\u2137", "\\gimel", true);
  defineSymbol(math, ams, textord, "\u03DD", "\\digamma", true);
  defineSymbol(math, ams, textord, "\u03F0", "\\varkappa");
  defineSymbol(math, ams, open, "\u250C", "\\@ulcorner", true);
  defineSymbol(math, ams, close, "\u2510", "\\@urcorner", true);
  defineSymbol(math, ams, open, "\u2514", "\\@llcorner", true);
  defineSymbol(math, ams, close, "\u2518", "\\@lrcorner", true);
  defineSymbol(math, ams, rel, "\u2266", "\\leqq", true);
  defineSymbol(math, ams, rel, "\u2A7D", "\\leqslant", true);
  defineSymbol(math, ams, rel, "\u2A95", "\\eqslantless", true);
  defineSymbol(math, ams, rel, "\u2272", "\\lesssim", true);
  defineSymbol(math, ams, rel, "\u2A85", "\\lessapprox", true);
  defineSymbol(math, ams, rel, "\u224A", "\\approxeq", true);
  defineSymbol(math, ams, bin, "\u22D6", "\\lessdot");
  defineSymbol(math, ams, rel, "\u22D8", "\\lll", true);
  defineSymbol(math, ams, rel, "\u2276", "\\lessgtr", true);
  defineSymbol(math, ams, rel, "\u22DA", "\\lesseqgtr", true);
  defineSymbol(math, ams, rel, "\u2A8B", "\\lesseqqgtr", true);
  defineSymbol(math, ams, rel, "\u2251", "\\doteqdot");
  defineSymbol(math, ams, rel, "\u2253", "\\risingdotseq", true);
  defineSymbol(math, ams, rel, "\u2252", "\\fallingdotseq", true);
  defineSymbol(math, ams, rel, "\u223D", "\\backsim", true);
  defineSymbol(math, ams, rel, "\u22CD", "\\backsimeq", true);
  defineSymbol(math, ams, rel, "\u2AC5", "\\subseteqq", true);
  defineSymbol(math, ams, rel, "\u22D0", "\\Subset", true);
  defineSymbol(math, ams, rel, "\u228F", "\\sqsubset", true);
  defineSymbol(math, ams, rel, "\u227C", "\\preccurlyeq", true);
  defineSymbol(math, ams, rel, "\u22DE", "\\curlyeqprec", true);
  defineSymbol(math, ams, rel, "\u227E", "\\precsim", true);
  defineSymbol(math, ams, rel, "\u2AB7", "\\precapprox", true);
  defineSymbol(math, ams, rel, "\u22B2", "\\vartriangleleft");
  defineSymbol(math, ams, rel, "\u22B4", "\\trianglelefteq");
  defineSymbol(math, ams, rel, "\u22A8", "\\vDash", true);
  defineSymbol(math, ams, rel, "\u22AA", "\\Vvdash", true);
  defineSymbol(math, ams, rel, "\u2323", "\\smallsmile");
  defineSymbol(math, ams, rel, "\u2322", "\\smallfrown");
  defineSymbol(math, ams, rel, "\u224F", "\\bumpeq", true);
  defineSymbol(math, ams, rel, "\u224E", "\\Bumpeq", true);
  defineSymbol(math, ams, rel, "\u2267", "\\geqq", true);
  defineSymbol(math, ams, rel, "\u2A7E", "\\geqslant", true);
  defineSymbol(math, ams, rel, "\u2A96", "\\eqslantgtr", true);
  defineSymbol(math, ams, rel, "\u2273", "\\gtrsim", true);
  defineSymbol(math, ams, rel, "\u2A86", "\\gtrapprox", true);
  defineSymbol(math, ams, bin, "\u22D7", "\\gtrdot");
  defineSymbol(math, ams, rel, "\u22D9", "\\ggg", true);
  defineSymbol(math, ams, rel, "\u2277", "\\gtrless", true);
  defineSymbol(math, ams, rel, "\u22DB", "\\gtreqless", true);
  defineSymbol(math, ams, rel, "\u2A8C", "\\gtreqqless", true);
  defineSymbol(math, ams, rel, "\u2256", "\\eqcirc", true);
  defineSymbol(math, ams, rel, "\u2257", "\\circeq", true);
  defineSymbol(math, ams, rel, "\u225C", "\\triangleq", true);
  defineSymbol(math, ams, rel, "\u223C", "\\thicksim");
  defineSymbol(math, ams, rel, "\u2248", "\\thickapprox");
  defineSymbol(math, ams, rel, "\u2AC6", "\\supseteqq", true);
  defineSymbol(math, ams, rel, "\u22D1", "\\Supset", true);
  defineSymbol(math, ams, rel, "\u2290", "\\sqsupset", true);
  defineSymbol(math, ams, rel, "\u227D", "\\succcurlyeq", true);
  defineSymbol(math, ams, rel, "\u22DF", "\\curlyeqsucc", true);
  defineSymbol(math, ams, rel, "\u227F", "\\succsim", true);
  defineSymbol(math, ams, rel, "\u2AB8", "\\succapprox", true);
  defineSymbol(math, ams, rel, "\u22B3", "\\vartriangleright");
  defineSymbol(math, ams, rel, "\u22B5", "\\trianglerighteq");
  defineSymbol(math, ams, rel, "\u22A9", "\\Vdash", true);
  defineSymbol(math, ams, rel, "\u2223", "\\shortmid");
  defineSymbol(math, ams, rel, "\u2225", "\\shortparallel");
  defineSymbol(math, ams, rel, "\u226C", "\\between", true);
  defineSymbol(math, ams, rel, "\u22D4", "\\pitchfork", true);
  defineSymbol(math, ams, rel, "\u221D", "\\varpropto");
  defineSymbol(math, ams, rel, "\u25C0", "\\blacktriangleleft");
  defineSymbol(math, ams, rel, "\u2234", "\\therefore", true);
  defineSymbol(math, ams, rel, "\u220D", "\\backepsilon");
  defineSymbol(math, ams, rel, "\u25B6", "\\blacktriangleright");
  defineSymbol(math, ams, rel, "\u2235", "\\because", true);
  defineSymbol(math, ams, rel, "\u22D8", "\\llless");
  defineSymbol(math, ams, rel, "\u22D9", "\\gggtr");
  defineSymbol(math, ams, bin, "\u22B2", "\\lhd");
  defineSymbol(math, ams, bin, "\u22B3", "\\rhd");
  defineSymbol(math, ams, rel, "\u2242", "\\eqsim", true);
  defineSymbol(math, main, rel, "\u22C8", "\\Join");
  defineSymbol(math, ams, rel, "\u2251", "\\Doteq", true);
  defineSymbol(math, ams, bin, "\u2214", "\\dotplus", true);
  defineSymbol(math, ams, bin, "\u2216", "\\smallsetminus");
  defineSymbol(math, ams, bin, "\u22D2", "\\Cap", true);
  defineSymbol(math, ams, bin, "\u22D3", "\\Cup", true);
  defineSymbol(math, ams, bin, "\u2A5E", "\\doublebarwedge", true);
  defineSymbol(math, ams, bin, "\u229F", "\\boxminus", true);
  defineSymbol(math, ams, bin, "\u229E", "\\boxplus", true);
  defineSymbol(math, ams, bin, "\u22C7", "\\divideontimes", true);
  defineSymbol(math, ams, bin, "\u22C9", "\\ltimes", true);
  defineSymbol(math, ams, bin, "\u22CA", "\\rtimes", true);
  defineSymbol(math, ams, bin, "\u22CB", "\\leftthreetimes", true);
  defineSymbol(math, ams, bin, "\u22CC", "\\rightthreetimes", true);
  defineSymbol(math, ams, bin, "\u22CF", "\\curlywedge", true);
  defineSymbol(math, ams, bin, "\u22CE", "\\curlyvee", true);
  defineSymbol(math, ams, bin, "\u229D", "\\circleddash", true);
  defineSymbol(math, ams, bin, "\u229B", "\\circledast", true);
  defineSymbol(math, ams, bin, "\u22C5", "\\centerdot");
  defineSymbol(math, ams, bin, "\u22BA", "\\intercal", true);
  defineSymbol(math, ams, bin, "\u22D2", "\\doublecap");
  defineSymbol(math, ams, bin, "\u22D3", "\\doublecup");
  defineSymbol(math, ams, bin, "\u22A0", "\\boxtimes", true);
  defineSymbol(math, ams, rel, "\u21E2", "\\dashrightarrow", true);
  defineSymbol(math, ams, rel, "\u21E0", "\\dashleftarrow", true);
  defineSymbol(math, ams, rel, "\u21C7", "\\leftleftarrows", true);
  defineSymbol(math, ams, rel, "\u21C6", "\\leftrightarrows", true);
  defineSymbol(math, ams, rel, "\u21DA", "\\Lleftarrow", true);
  defineSymbol(math, ams, rel, "\u219E", "\\twoheadleftarrow", true);
  defineSymbol(math, ams, rel, "\u21A2", "\\leftarrowtail", true);
  defineSymbol(math, ams, rel, "\u21AB", "\\looparrowleft", true);
  defineSymbol(math, ams, rel, "\u21CB", "\\leftrightharpoons", true);
  defineSymbol(math, ams, rel, "\u21B6", "\\curvearrowleft", true);
  defineSymbol(math, ams, rel, "\u21BA", "\\circlearrowleft", true);
  defineSymbol(math, ams, rel, "\u21B0", "\\Lsh", true);
  defineSymbol(math, ams, rel, "\u21C8", "\\upuparrows", true);
  defineSymbol(math, ams, rel, "\u21BF", "\\upharpoonleft", true);
  defineSymbol(math, ams, rel, "\u21C3", "\\downharpoonleft", true);
  defineSymbol(math, main, rel, "\u22B6", "\\origof", true);
  defineSymbol(math, main, rel, "\u22B7", "\\imageof", true);
  defineSymbol(math, ams, rel, "\u22B8", "\\multimap", true);
  defineSymbol(math, ams, rel, "\u21AD", "\\leftrightsquigarrow", true);
  defineSymbol(math, ams, rel, "\u21C9", "\\rightrightarrows", true);
  defineSymbol(math, ams, rel, "\u21C4", "\\rightleftarrows", true);
  defineSymbol(math, ams, rel, "\u21A0", "\\twoheadrightarrow", true);
  defineSymbol(math, ams, rel, "\u21A3", "\\rightarrowtail", true);
  defineSymbol(math, ams, rel, "\u21AC", "\\looparrowright", true);
  defineSymbol(math, ams, rel, "\u21B7", "\\curvearrowright", true);
  defineSymbol(math, ams, rel, "\u21BB", "\\circlearrowright", true);
  defineSymbol(math, ams, rel, "\u21B1", "\\Rsh", true);
  defineSymbol(math, ams, rel, "\u21CA", "\\downdownarrows", true);
  defineSymbol(math, ams, rel, "\u21BE", "\\upharpoonright", true);
  defineSymbol(math, ams, rel, "\u21C2", "\\downharpoonright", true);
  defineSymbol(math, ams, rel, "\u21DD", "\\rightsquigarrow", true);
  defineSymbol(math, ams, rel, "\u21DD", "\\leadsto");
  defineSymbol(math, ams, rel, "\u21DB", "\\Rrightarrow", true);
  defineSymbol(math, ams, rel, "\u21BE", "\\restriction");
  defineSymbol(math, main, textord, "\u2018", "`");
  defineSymbol(math, main, textord, "$", "\\$");
  defineSymbol(text, main, textord, "$", "\\$");
  defineSymbol(text, main, textord, "$", "\\textdollar");
  defineSymbol(math, main, textord, "%", "\\%");
  defineSymbol(text, main, textord, "%", "\\%");
  defineSymbol(math, main, textord, "_", "\\_");
  defineSymbol(text, main, textord, "_", "\\_");
  defineSymbol(text, main, textord, "_", "\\textunderscore");
  defineSymbol(math, main, textord, "\u2220", "\\angle", true);
  defineSymbol(math, main, textord, "\u221E", "\\infty", true);
  defineSymbol(math, main, textord, "\u2032", "\\prime");
  defineSymbol(math, main, textord, "\u25B3", "\\triangle");
  defineSymbol(math, main, textord, "\u0393", "\\Gamma", true);
  defineSymbol(math, main, textord, "\u0394", "\\Delta", true);
  defineSymbol(math, main, textord, "\u0398", "\\Theta", true);
  defineSymbol(math, main, textord, "\u039B", "\\Lambda", true);
  defineSymbol(math, main, textord, "\u039E", "\\Xi", true);
  defineSymbol(math, main, textord, "\u03A0", "\\Pi", true);
  defineSymbol(math, main, textord, "\u03A3", "\\Sigma", true);
  defineSymbol(math, main, textord, "\u03A5", "\\Upsilon", true);
  defineSymbol(math, main, textord, "\u03A6", "\\Phi", true);
  defineSymbol(math, main, textord, "\u03A8", "\\Psi", true);
  defineSymbol(math, main, textord, "\u03A9", "\\Omega", true);
  defineSymbol(math, main, textord, "A", "\u0391");
  defineSymbol(math, main, textord, "B", "\u0392");
  defineSymbol(math, main, textord, "E", "\u0395");
  defineSymbol(math, main, textord, "Z", "\u0396");
  defineSymbol(math, main, textord, "H", "\u0397");
  defineSymbol(math, main, textord, "I", "\u0399");
  defineSymbol(math, main, textord, "K", "\u039A");
  defineSymbol(math, main, textord, "M", "\u039C");
  defineSymbol(math, main, textord, "N", "\u039D");
  defineSymbol(math, main, textord, "O", "\u039F");
  defineSymbol(math, main, textord, "P", "\u03A1");
  defineSymbol(math, main, textord, "T", "\u03A4");
  defineSymbol(math, main, textord, "X", "\u03A7");
  defineSymbol(math, main, textord, "\xAC", "\\neg", true);
  defineSymbol(math, main, textord, "\xAC", "\\lnot");
  defineSymbol(math, main, textord, "\u22A4", "\\top");
  defineSymbol(math, main, textord, "\u22A5", "\\bot");
  defineSymbol(math, main, textord, "\u2205", "\\emptyset");
  defineSymbol(math, ams, textord, "\u2205", "\\varnothing");
  defineSymbol(math, main, mathord, "\u03B1", "\\alpha", true);
  defineSymbol(math, main, mathord, "\u03B2", "\\beta", true);
  defineSymbol(math, main, mathord, "\u03B3", "\\gamma", true);
  defineSymbol(math, main, mathord, "\u03B4", "\\delta", true);
  defineSymbol(math, main, mathord, "\u03F5", "\\epsilon", true);
  defineSymbol(math, main, mathord, "\u03B6", "\\zeta", true);
  defineSymbol(math, main, mathord, "\u03B7", "\\eta", true);
  defineSymbol(math, main, mathord, "\u03B8", "\\theta", true);
  defineSymbol(math, main, mathord, "\u03B9", "\\iota", true);
  defineSymbol(math, main, mathord, "\u03BA", "\\kappa", true);
  defineSymbol(math, main, mathord, "\u03BB", "\\lambda", true);
  defineSymbol(math, main, mathord, "\u03BC", "\\mu", true);
  defineSymbol(math, main, mathord, "\u03BD", "\\nu", true);
  defineSymbol(math, main, mathord, "\u03BE", "\\xi", true);
  defineSymbol(math, main, mathord, "\u03BF", "\\omicron", true);
  defineSymbol(math, main, mathord, "\u03C0", "\\pi", true);
  defineSymbol(math, main, mathord, "\u03C1", "\\rho", true);
  defineSymbol(math, main, mathord, "\u03C3", "\\sigma", true);
  defineSymbol(math, main, mathord, "\u03C4", "\\tau", true);
  defineSymbol(math, main, mathord, "\u03C5", "\\upsilon", true);
  defineSymbol(math, main, mathord, "\u03D5", "\\phi", true);
  defineSymbol(math, main, mathord, "\u03C7", "\\chi", true);
  defineSymbol(math, main, mathord, "\u03C8", "\\psi", true);
  defineSymbol(math, main, mathord, "\u03C9", "\\omega", true);
  defineSymbol(math, main, mathord, "\u03B5", "\\varepsilon", true);
  defineSymbol(math, main, mathord, "\u03D1", "\\vartheta", true);
  defineSymbol(math, main, mathord, "\u03D6", "\\varpi", true);
  defineSymbol(math, main, mathord, "\u03F1", "\\varrho", true);
  defineSymbol(math, main, mathord, "\u03C2", "\\varsigma", true);
  defineSymbol(math, main, mathord, "\u03C6", "\\varphi", true);
  defineSymbol(math, main, bin, "\u2217", "*", true);
  defineSymbol(math, main, bin, "+", "+");
  defineSymbol(math, main, bin, "\u2212", "-", true);
  defineSymbol(math, main, bin, "\u22C5", "\\cdot", true);
  defineSymbol(math, main, bin, "\u2218", "\\circ", true);
  defineSymbol(math, main, bin, "\xF7", "\\div", true);
  defineSymbol(math, main, bin, "\xB1", "\\pm", true);
  defineSymbol(math, main, bin, "\xD7", "\\times", true);
  defineSymbol(math, main, bin, "\u2229", "\\cap", true);
  defineSymbol(math, main, bin, "\u222A", "\\cup", true);
  defineSymbol(math, main, bin, "\u2216", "\\setminus", true);
  defineSymbol(math, main, bin, "\u2227", "\\land");
  defineSymbol(math, main, bin, "\u2228", "\\lor");
  defineSymbol(math, main, bin, "\u2227", "\\wedge", true);
  defineSymbol(math, main, bin, "\u2228", "\\vee", true);
  defineSymbol(math, main, textord, "\u221A", "\\surd");
  defineSymbol(math, main, open, "\u27E8", "\\langle", true);
  defineSymbol(math, main, open, "\u2223", "\\lvert");
  defineSymbol(math, main, open, "\u2225", "\\lVert");
  defineSymbol(math, main, close, "?", "?");
  defineSymbol(math, main, close, "!", "!");
  defineSymbol(math, main, close, "\u27E9", "\\rangle", true);
  defineSymbol(math, main, close, "\u2223", "\\rvert");
  defineSymbol(math, main, close, "\u2225", "\\rVert");
  defineSymbol(math, main, rel, "=", "=");
  defineSymbol(math, main, rel, ":", ":");
  defineSymbol(math, main, rel, "\u2248", "\\approx", true);
  defineSymbol(math, main, rel, "\u2245", "\\cong", true);
  defineSymbol(math, main, rel, "\u2265", "\\ge");
  defineSymbol(math, main, rel, "\u2265", "\\geq", true);
  defineSymbol(math, main, rel, "\u2190", "\\gets");
  defineSymbol(math, main, rel, ">", "\\gt", true);
  defineSymbol(math, main, rel, "\u2208", "\\in", true);
  defineSymbol(math, main, rel, "\uE020", "\\@not");
  defineSymbol(math, main, rel, "\u2282", "\\subset", true);
  defineSymbol(math, main, rel, "\u2283", "\\supset", true);
  defineSymbol(math, main, rel, "\u2286", "\\subseteq", true);
  defineSymbol(math, main, rel, "\u2287", "\\supseteq", true);
  defineSymbol(math, ams, rel, "\u2288", "\\nsubseteq", true);
  defineSymbol(math, ams, rel, "\u2289", "\\nsupseteq", true);
  defineSymbol(math, main, rel, "\u22A8", "\\models");
  defineSymbol(math, main, rel, "\u2190", "\\leftarrow", true);
  defineSymbol(math, main, rel, "\u2264", "\\le");
  defineSymbol(math, main, rel, "\u2264", "\\leq", true);
  defineSymbol(math, main, rel, "<", "\\lt", true);
  defineSymbol(math, main, rel, "\u2192", "\\rightarrow", true);
  defineSymbol(math, main, rel, "\u2192", "\\to");
  defineSymbol(math, ams, rel, "\u2271", "\\ngeq", true);
  defineSymbol(math, ams, rel, "\u2270", "\\nleq", true);
  defineSymbol(math, main, spacing, "\xA0", "\\ ");
  defineSymbol(math, main, spacing, "\xA0", "\\space");
  defineSymbol(math, main, spacing, "\xA0", "\\nobreakspace");
  defineSymbol(text, main, spacing, "\xA0", "\\ ");
  defineSymbol(text, main, spacing, "\xA0", " ");
  defineSymbol(text, main, spacing, "\xA0", "\\space");
  defineSymbol(text, main, spacing, "\xA0", "\\nobreakspace");
  defineSymbol(math, main, spacing, null, "\\nobreak");
  defineSymbol(math, main, spacing, null, "\\allowbreak");
  defineSymbol(math, main, punct, ",", ",");
  defineSymbol(math, main, punct, ";", ";");
  defineSymbol(math, ams, bin, "\u22BC", "\\barwedge", true);
  defineSymbol(math, ams, bin, "\u22BB", "\\veebar", true);
  defineSymbol(math, main, bin, "\u2299", "\\odot", true);
  defineSymbol(math, main, bin, "\u2295", "\\oplus", true);
  defineSymbol(math, main, bin, "\u2297", "\\otimes", true);
  defineSymbol(math, main, textord, "\u2202", "\\partial", true);
  defineSymbol(math, main, bin, "\u2298", "\\oslash", true);
  defineSymbol(math, ams, bin, "\u229A", "\\circledcirc", true);
  defineSymbol(math, ams, bin, "\u22A1", "\\boxdot", true);
  defineSymbol(math, main, bin, "\u25B3", "\\bigtriangleup");
  defineSymbol(math, main, bin, "\u25BD", "\\bigtriangledown");
  defineSymbol(math, main, bin, "\u2020", "\\dagger");
  defineSymbol(math, main, bin, "\u22C4", "\\diamond");
  defineSymbol(math, main, bin, "\u22C6", "\\star");
  defineSymbol(math, main, bin, "\u25C3", "\\triangleleft");
  defineSymbol(math, main, bin, "\u25B9", "\\triangleright");
  defineSymbol(math, main, open, "{", "\\{");
  defineSymbol(text, main, textord, "{", "\\{");
  defineSymbol(text, main, textord, "{", "\\textbraceleft");
  defineSymbol(math, main, close, "}", "\\}");
  defineSymbol(text, main, textord, "}", "\\}");
  defineSymbol(text, main, textord, "}", "\\textbraceright");
  defineSymbol(math, main, open, "{", "\\lbrace");
  defineSymbol(math, main, close, "}", "\\rbrace");
  defineSymbol(math, main, open, "[", "\\lbrack", true);
  defineSymbol(text, main, textord, "[", "\\lbrack", true);
  defineSymbol(math, main, close, "]", "\\rbrack", true);
  defineSymbol(text, main, textord, "]", "\\rbrack", true);
  defineSymbol(math, main, open, "(", "\\lparen", true);
  defineSymbol(math, main, close, ")", "\\rparen", true);
  defineSymbol(text, main, textord, "<", "\\textless", true);
  defineSymbol(text, main, textord, ">", "\\textgreater", true);
  defineSymbol(math, main, open, "\u230A", "\\lfloor", true);
  defineSymbol(math, main, close, "\u230B", "\\rfloor", true);
  defineSymbol(math, main, open, "\u2308", "\\lceil", true);
  defineSymbol(math, main, close, "\u2309", "\\rceil", true);
  defineSymbol(math, main, textord, "\\", "\\backslash");
  defineSymbol(math, main, textord, "\u2223", "|");
  defineSymbol(math, main, textord, "\u2223", "\\vert");
  defineSymbol(text, main, textord, "|", "\\textbar", true);
  defineSymbol(math, main, textord, "\u2225", "\\|");
  defineSymbol(math, main, textord, "\u2225", "\\Vert");
  defineSymbol(text, main, textord, "\u2225", "\\textbardbl");
  defineSymbol(text, main, textord, "~", "\\textasciitilde");
  defineSymbol(text, main, textord, "\\", "\\textbackslash");
  defineSymbol(text, main, textord, "^", "\\textasciicircum");
  defineSymbol(math, main, rel, "\u2191", "\\uparrow", true);
  defineSymbol(math, main, rel, "\u21D1", "\\Uparrow", true);
  defineSymbol(math, main, rel, "\u2193", "\\downarrow", true);
  defineSymbol(math, main, rel, "\u21D3", "\\Downarrow", true);
  defineSymbol(math, main, rel, "\u2195", "\\updownarrow", true);
  defineSymbol(math, main, rel, "\u21D5", "\\Updownarrow", true);
  defineSymbol(math, main, op, "\u2210", "\\coprod");
  defineSymbol(math, main, op, "\u22C1", "\\bigvee");
  defineSymbol(math, main, op, "\u22C0", "\\bigwedge");
  defineSymbol(math, main, op, "\u2A04", "\\biguplus");
  defineSymbol(math, main, op, "\u22C2", "\\bigcap");
  defineSymbol(math, main, op, "\u22C3", "\\bigcup");
  defineSymbol(math, main, op, "\u222B", "\\int");
  defineSymbol(math, main, op, "\u222B", "\\intop");
  defineSymbol(math, main, op, "\u222C", "\\iint");
  defineSymbol(math, main, op, "\u222D", "\\iiint");
  defineSymbol(math, main, op, "\u220F", "\\prod");
  defineSymbol(math, main, op, "\u2211", "\\sum");
  defineSymbol(math, main, op, "\u2A02", "\\bigotimes");
  defineSymbol(math, main, op, "\u2A01", "\\bigoplus");
  defineSymbol(math, main, op, "\u2A00", "\\bigodot");
  defineSymbol(math, main, op, "\u222E", "\\oint");
  defineSymbol(math, main, op, "\u222F", "\\oiint");
  defineSymbol(math, main, op, "\u2230", "\\oiiint");
  defineSymbol(math, main, op, "\u2A06", "\\bigsqcup");
  defineSymbol(math, main, op, "\u222B", "\\smallint");
  defineSymbol(text, main, inner, "\u2026", "\\textellipsis");
  defineSymbol(math, main, inner, "\u2026", "\\mathellipsis");
  defineSymbol(text, main, inner, "\u2026", "\\ldots", true);
  defineSymbol(math, main, inner, "\u2026", "\\ldots", true);
  defineSymbol(math, main, inner, "\u22EF", "\\@cdots", true);
  defineSymbol(math, main, inner, "\u22F1", "\\ddots", true);
  defineSymbol(math, main, textord, "\u22EE", "\\varvdots");
  defineSymbol(text, main, textord, "\u22EE", "\\varvdots");
  defineSymbol(math, main, accent, "\u02CA", "\\acute");
  defineSymbol(math, main, accent, "\u02CB", "\\grave");
  defineSymbol(math, main, accent, "\xA8", "\\ddot");
  defineSymbol(math, main, accent, "~", "\\tilde");
  defineSymbol(math, main, accent, "\u02C9", "\\bar");
  defineSymbol(math, main, accent, "\u02D8", "\\breve");
  defineSymbol(math, main, accent, "\u02C7", "\\check");
  defineSymbol(math, main, accent, "^", "\\hat");
  defineSymbol(math, main, accent, "\u20D7", "\\vec");
  defineSymbol(math, main, accent, "\u02D9", "\\dot");
  defineSymbol(math, main, accent, "\u02DA", "\\mathring");
  defineSymbol(math, main, mathord, "\uE131", "\\@imath");
  defineSymbol(math, main, mathord, "\uE237", "\\@jmath");
  defineSymbol(math, main, textord, "\u0131", "\u0131");
  defineSymbol(math, main, textord, "\u0237", "\u0237");
  defineSymbol(text, main, textord, "\u0131", "\\i", true);
  defineSymbol(text, main, textord, "\u0237", "\\j", true);
  defineSymbol(text, main, textord, "\xDF", "\\ss", true);
  defineSymbol(text, main, textord, "\xE6", "\\ae", true);
  defineSymbol(text, main, textord, "\u0153", "\\oe", true);
  defineSymbol(text, main, textord, "\xF8", "\\o", true);
  defineSymbol(text, main, textord, "\xC6", "\\AE", true);
  defineSymbol(text, main, textord, "\u0152", "\\OE", true);
  defineSymbol(text, main, textord, "\xD8", "\\O", true);
  defineSymbol(text, main, accent, "\u02CA", "\\'");
  defineSymbol(text, main, accent, "\u02CB", "\\`");
  defineSymbol(text, main, accent, "\u02C6", "\\^");
  defineSymbol(text, main, accent, "\u02DC", "\\~");
  defineSymbol(text, main, accent, "\u02C9", "\\=");
  defineSymbol(text, main, accent, "\u02D8", "\\u");
  defineSymbol(text, main, accent, "\u02D9", "\\.");
  defineSymbol(text, main, accent, "\xB8", "\\c");
  defineSymbol(text, main, accent, "\u02DA", "\\r");
  defineSymbol(text, main, accent, "\u02C7", "\\v");
  defineSymbol(text, main, accent, "\xA8", '\\"');
  defineSymbol(text, main, accent, "\u02DD", "\\H");
  defineSymbol(text, main, accent, "\u25EF", "\\textcircled");
  var ligatures = {
    "--": true,
    "---": true,
    "``": true,
    "''": true
  };
  defineSymbol(text, main, textord, "\u2013", "--", true);
  defineSymbol(text, main, textord, "\u2013", "\\textendash");
  defineSymbol(text, main, textord, "\u2014", "---", true);
  defineSymbol(text, main, textord, "\u2014", "\\textemdash");
  defineSymbol(text, main, textord, "\u2018", "`", true);
  defineSymbol(text, main, textord, "\u2018", "\\textquoteleft");
  defineSymbol(text, main, textord, "\u2019", "'", true);
  defineSymbol(text, main, textord, "\u2019", "\\textquoteright");
  defineSymbol(text, main, textord, "\u201C", "``", true);
  defineSymbol(text, main, textord, "\u201C", "\\textquotedblleft");
  defineSymbol(text, main, textord, "\u201D", "''", true);
  defineSymbol(text, main, textord, "\u201D", "\\textquotedblright");
  defineSymbol(math, main, textord, "\xB0", "\\degree", true);
  defineSymbol(text, main, textord, "\xB0", "\\degree");
  defineSymbol(text, main, textord, "\xB0", "\\textdegree", true);
  defineSymbol(math, main, textord, "\xA3", "\\pounds");
  defineSymbol(math, main, textord, "\xA3", "\\mathsterling", true);
  defineSymbol(text, main, textord, "\xA3", "\\pounds");
  defineSymbol(text, main, textord, "\xA3", "\\textsterling", true);
  defineSymbol(math, ams, textord, "\u2720", "\\maltese");
  defineSymbol(text, ams, textord, "\u2720", "\\maltese");
  var mathTextSymbols = '0123456789/@."';
  for (i2 = 0; i2 < mathTextSymbols.length; i2++) {
    ch = mathTextSymbols.charAt(i2);
    defineSymbol(math, main, textord, ch, ch);
  }
  var ch;
  var i2;
  var textSymbols = '0123456789!@*()-=+";:?/.,';
  for (_i = 0; _i < textSymbols.length; _i++) {
    _ch = textSymbols.charAt(_i);
    defineSymbol(text, main, textord, _ch, _ch);
  }
  var _ch;
  var _i;
  var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (_i2 = 0; _i2 < letters.length; _i2++) {
    _ch2 = letters.charAt(_i2);
    defineSymbol(math, main, mathord, _ch2, _ch2);
    defineSymbol(text, main, textord, _ch2, _ch2);
  }
  var _ch2;
  var _i2;
  defineSymbol(math, ams, textord, "C", "\u2102");
  defineSymbol(text, ams, textord, "C", "\u2102");
  defineSymbol(math, ams, textord, "H", "\u210D");
  defineSymbol(text, ams, textord, "H", "\u210D");
  defineSymbol(math, ams, textord, "N", "\u2115");
  defineSymbol(text, ams, textord, "N", "\u2115");
  defineSymbol(math, ams, textord, "P", "\u2119");
  defineSymbol(text, ams, textord, "P", "\u2119");
  defineSymbol(math, ams, textord, "Q", "\u211A");
  defineSymbol(text, ams, textord, "Q", "\u211A");
  defineSymbol(math, ams, textord, "R", "\u211D");
  defineSymbol(text, ams, textord, "R", "\u211D");
  defineSymbol(math, ams, textord, "Z", "\u2124");
  defineSymbol(text, ams, textord, "Z", "\u2124");
  defineSymbol(math, main, mathord, "h", "\u210E");
  defineSymbol(text, main, mathord, "h", "\u210E");
  var wideChar = "";
  for (_i3 = 0; _i3 < letters.length; _i3++) {
    _ch3 = letters.charAt(_i3);
    wideChar = String.fromCharCode(55349, 56320 + _i3);
    defineSymbol(math, main, mathord, _ch3, wideChar);
    defineSymbol(text, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56372 + _i3);
    defineSymbol(math, main, mathord, _ch3, wideChar);
    defineSymbol(text, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56424 + _i3);
    defineSymbol(math, main, mathord, _ch3, wideChar);
    defineSymbol(text, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56580 + _i3);
    defineSymbol(math, main, mathord, _ch3, wideChar);
    defineSymbol(text, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56684 + _i3);
    defineSymbol(math, main, mathord, _ch3, wideChar);
    defineSymbol(text, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56736 + _i3);
    defineSymbol(math, main, mathord, _ch3, wideChar);
    defineSymbol(text, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56788 + _i3);
    defineSymbol(math, main, mathord, _ch3, wideChar);
    defineSymbol(text, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56840 + _i3);
    defineSymbol(math, main, mathord, _ch3, wideChar);
    defineSymbol(text, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56944 + _i3);
    defineSymbol(math, main, mathord, _ch3, wideChar);
    defineSymbol(text, main, textord, _ch3, wideChar);
    if (_i3 < 26) {
      wideChar = String.fromCharCode(55349, 56632 + _i3);
      defineSymbol(math, main, mathord, _ch3, wideChar);
      defineSymbol(text, main, textord, _ch3, wideChar);
      wideChar = String.fromCharCode(55349, 56476 + _i3);
      defineSymbol(math, main, mathord, _ch3, wideChar);
      defineSymbol(text, main, textord, _ch3, wideChar);
    }
  }
  var _ch3;
  var _i3;
  wideChar = String.fromCharCode(55349, 56668);
  defineSymbol(math, main, mathord, "k", wideChar);
  defineSymbol(text, main, textord, "k", wideChar);
  for (_i4 = 0; _i4 < 10; _i4++) {
    _ch4 = _i4.toString();
    wideChar = String.fromCharCode(55349, 57294 + _i4);
    defineSymbol(math, main, mathord, _ch4, wideChar);
    defineSymbol(text, main, textord, _ch4, wideChar);
    wideChar = String.fromCharCode(55349, 57314 + _i4);
    defineSymbol(math, main, mathord, _ch4, wideChar);
    defineSymbol(text, main, textord, _ch4, wideChar);
    wideChar = String.fromCharCode(55349, 57324 + _i4);
    defineSymbol(math, main, mathord, _ch4, wideChar);
    defineSymbol(text, main, textord, _ch4, wideChar);
    wideChar = String.fromCharCode(55349, 57334 + _i4);
    defineSymbol(math, main, mathord, _ch4, wideChar);
    defineSymbol(text, main, textord, _ch4, wideChar);
  }
  var _ch4;
  var _i4;
  var extraLatin = "\xD0\xDE\xFE";
  for (_i5 = 0; _i5 < extraLatin.length; _i5++) {
    _ch5 = extraLatin.charAt(_i5);
    defineSymbol(math, main, mathord, _ch5, _ch5);
    defineSymbol(text, main, textord, _ch5, _ch5);
  }
  var _ch5;
  var _i5;
  var wideLatinLetterData = [
    ["mathbf", "textbf", "Main-Bold"],
    // A-Z bold upright
    ["mathbf", "textbf", "Main-Bold"],
    // a-z bold upright
    ["mathnormal", "textit", "Math-Italic"],
    // A-Z italic
    ["mathnormal", "textit", "Math-Italic"],
    // a-z italic
    ["boldsymbol", "boldsymbol", "Main-BoldItalic"],
    // A-Z bold italic
    ["boldsymbol", "boldsymbol", "Main-BoldItalic"],
    // a-z bold italic
    // Map fancy A-Z letters to script, not calligraphic.
    // This aligns with unicode-math and math fonts (except Cambria Math).
    ["mathscr", "textscr", "Script-Regular"],
    // A-Z script
    ["", "", ""],
    // a-z script.  No font
    ["", "", ""],
    // A-Z bold script. No font
    ["", "", ""],
    // a-z bold script. No font
    ["mathfrak", "textfrak", "Fraktur-Regular"],
    // A-Z Fraktur
    ["mathfrak", "textfrak", "Fraktur-Regular"],
    // a-z Fraktur
    ["mathbb", "textbb", "AMS-Regular"],
    // A-Z double-struck
    ["mathbb", "textbb", "AMS-Regular"],
    // k double-struck
    // Note that we are using a bold font, but font metrics for regular Fraktur.
    ["mathboldfrak", "textboldfrak", "Fraktur-Regular"],
    // A-Z bold Fraktur
    ["mathboldfrak", "textboldfrak", "Fraktur-Regular"],
    // a-z bold Fraktur
    ["mathsf", "textsf", "SansSerif-Regular"],
    // A-Z sans-serif
    ["mathsf", "textsf", "SansSerif-Regular"],
    // a-z sans-serif
    ["mathboldsf", "textboldsf", "SansSerif-Bold"],
    // A-Z bold sans-serif
    ["mathboldsf", "textboldsf", "SansSerif-Bold"],
    // a-z bold sans-serif
    ["mathitsf", "textitsf", "SansSerif-Italic"],
    // A-Z italic sans-serif
    ["mathitsf", "textitsf", "SansSerif-Italic"],
    // a-z italic sans-serif
    ["", "", ""],
    // A-Z bold italic sans. No font
    ["", "", ""],
    // a-z bold italic sans. No font
    ["mathtt", "texttt", "Typewriter-Regular"],
    // A-Z monospace
    ["mathtt", "texttt", "Typewriter-Regular"]
    // a-z monospace
  ];
  var wideNumeralData = [
    ["mathbf", "textbf", "Main-Bold"],
    // 0-9 bold
    ["", "", ""],
    // 0-9 double-struck. No KaTeX font.
    ["mathsf", "textsf", "SansSerif-Regular"],
    // 0-9 sans-serif
    ["mathboldsf", "textboldsf", "SansSerif-Bold"],
    // 0-9 bold sans-serif
    ["mathtt", "texttt", "Typewriter-Regular"]
    // 0-9 monospace
  ];
  var wideCharacterFont = function wideCharacterFont2(wideChar2, mode) {
    var H2 = wideChar2.charCodeAt(0);
    var L4 = wideChar2.charCodeAt(1);
    var codePoint = (H2 - 55296) * 1024 + (L4 - 56320) + 65536;
    var j3 = mode === "math" ? 0 : 1;
    if (119808 <= codePoint && codePoint < 120484) {
      var i2 = Math.floor((codePoint - 119808) / 26);
      return [wideLatinLetterData[i2][2], wideLatinLetterData[i2][j3]];
    } else if (120782 <= codePoint && codePoint <= 120831) {
      var _i = Math.floor((codePoint - 120782) / 10);
      return [wideNumeralData[_i][2], wideNumeralData[_i][j3]];
    } else if (codePoint === 120485 || codePoint === 120486) {
      return [wideLatinLetterData[0][2], wideLatinLetterData[0][j3]];
    } else if (120486 < codePoint && codePoint < 120782) {
      return ["", ""];
    } else {
      throw new ParseError("Unsupported character: " + wideChar2);
    }
  };
  var lookupSymbol = function lookupSymbol2(value, fontName, mode) {
    if (symbols[mode][value] && symbols[mode][value].replace) {
      value = symbols[mode][value].replace;
    }
    return {
      value,
      metrics: getCharacterMetrics(value, fontName, mode)
    };
  };
  var makeSymbol = function makeSymbol2(value, fontName, mode, options, classes) {
    var lookup = lookupSymbol(value, fontName, mode);
    var metrics = lookup.metrics;
    value = lookup.value;
    var symbolNode;
    if (metrics) {
      var italic = metrics.italic;
      if (mode === "text" || options && options.font === "mathit") {
        italic = 0;
      }
      symbolNode = new SymbolNode(value, metrics.height, metrics.depth, italic, metrics.skew, metrics.width, classes);
    } else {
      typeof console !== "undefined" && console.warn("No character metrics " + ("for '" + value + "' in style '" + fontName + "' and mode '" + mode + "'"));
      symbolNode = new SymbolNode(value, 0, 0, 0, 0, 0, classes);
    }
    if (options) {
      symbolNode.maxFontSize = options.sizeMultiplier;
      if (options.style.isTight()) {
        symbolNode.classes.push("mtight");
      }
      var color = options.getColor();
      if (color) {
        symbolNode.style.color = color;
      }
    }
    return symbolNode;
  };
  var mathsym = function mathsym2(value, mode, options, classes) {
    if (classes === void 0) {
      classes = [];
    }
    if (options.font === "boldsymbol" && lookupSymbol(value, "Main-Bold", mode).metrics) {
      return makeSymbol(value, "Main-Bold", mode, options, classes.concat(["mathbf"]));
    } else if (value === "\\" || symbols[mode][value].font === "main") {
      return makeSymbol(value, "Main-Regular", mode, options, classes);
    } else {
      return makeSymbol(value, "AMS-Regular", mode, options, classes.concat(["amsrm"]));
    }
  };
  var boldsymbol = function boldsymbol2(value, mode, options, classes, type) {
    if (type !== "textord" && lookupSymbol(value, "Math-BoldItalic", mode).metrics) {
      return {
        fontName: "Math-BoldItalic",
        fontClass: "boldsymbol"
      };
    } else {
      return {
        fontName: "Main-Bold",
        fontClass: "mathbf"
      };
    }
  };
  var makeOrd = function makeOrd2(group, options, type) {
    var mode = group.mode;
    var text3 = group.text;
    var classes = ["mord"];
    var isFont = mode === "math" || mode === "text" && options.font;
    var fontOrFamily = isFont ? options.font : options.fontFamily;
    var wideFontName = "";
    var wideFontClass = "";
    if (text3.charCodeAt(0) === 55349) {
      [wideFontName, wideFontClass] = wideCharacterFont(text3, mode);
    }
    if (wideFontName.length > 0) {
      return makeSymbol(text3, wideFontName, mode, options, classes.concat(wideFontClass));
    } else if (fontOrFamily) {
      var fontName;
      var fontClasses;
      if (fontOrFamily === "boldsymbol") {
        var fontData = boldsymbol(text3, mode, options, classes, type);
        fontName = fontData.fontName;
        fontClasses = [fontData.fontClass];
      } else if (isFont) {
        fontName = fontMap[fontOrFamily].fontName;
        fontClasses = [fontOrFamily];
      } else {
        fontName = retrieveTextFontName(fontOrFamily, options.fontWeight, options.fontShape);
        fontClasses = [fontOrFamily, options.fontWeight, options.fontShape];
      }
      if (lookupSymbol(text3, fontName, mode).metrics) {
        return makeSymbol(text3, fontName, mode, options, classes.concat(fontClasses));
      } else if (ligatures.hasOwnProperty(text3) && fontName.slice(0, 10) === "Typewriter") {
        var parts = [];
        for (var i2 = 0; i2 < text3.length; i2++) {
          parts.push(makeSymbol(text3[i2], fontName, mode, options, classes.concat(fontClasses)));
        }
        return makeFragment(parts);
      }
    }
    if (type === "mathord") {
      return makeSymbol(text3, "Math-Italic", mode, options, classes.concat(["mathnormal"]));
    } else if (type === "textord") {
      var font = symbols[mode][text3] && symbols[mode][text3].font;
      if (font === "ams") {
        var _fontName = retrieveTextFontName("amsrm", options.fontWeight, options.fontShape);
        return makeSymbol(text3, _fontName, mode, options, classes.concat("amsrm", options.fontWeight, options.fontShape));
      } else if (font === "main" || !font) {
        var _fontName2 = retrieveTextFontName("textrm", options.fontWeight, options.fontShape);
        return makeSymbol(text3, _fontName2, mode, options, classes.concat(options.fontWeight, options.fontShape));
      } else {
        var _fontName3 = retrieveTextFontName(font, options.fontWeight, options.fontShape);
        return makeSymbol(text3, _fontName3, mode, options, classes.concat(_fontName3, options.fontWeight, options.fontShape));
      }
    } else {
      throw new Error("unexpected type: " + type + " in makeOrd");
    }
  };
  var canCombine = (prev, next) => {
    if (createClass(prev.classes) !== createClass(next.classes) || prev.skew !== next.skew || prev.maxFontSize !== next.maxFontSize) {
      return false;
    }
    if (prev.classes.length === 1) {
      var cls = prev.classes[0];
      if (cls === "mbin" || cls === "mord") {
        return false;
      }
    }
    for (var style in prev.style) {
      if (prev.style.hasOwnProperty(style) && prev.style[style] !== next.style[style]) {
        return false;
      }
    }
    for (var _style in next.style) {
      if (next.style.hasOwnProperty(_style) && prev.style[_style] !== next.style[_style]) {
        return false;
      }
    }
    return true;
  };
  var tryCombineChars = (chars) => {
    for (var i2 = 0; i2 < chars.length - 1; i2++) {
      var prev = chars[i2];
      var next = chars[i2 + 1];
      if (prev instanceof SymbolNode && next instanceof SymbolNode && canCombine(prev, next)) {
        prev.text += next.text;
        prev.height = Math.max(prev.height, next.height);
        prev.depth = Math.max(prev.depth, next.depth);
        prev.italic = next.italic;
        chars.splice(i2 + 1, 1);
        i2--;
      }
    }
    return chars;
  };
  var sizeElementFromChildren = function sizeElementFromChildren2(elem) {
    var height = 0;
    var depth = 0;
    var maxFontSize = 0;
    for (var i2 = 0; i2 < elem.children.length; i2++) {
      var child = elem.children[i2];
      if (child.height > height) {
        height = child.height;
      }
      if (child.depth > depth) {
        depth = child.depth;
      }
      if (child.maxFontSize > maxFontSize) {
        maxFontSize = child.maxFontSize;
      }
    }
    elem.height = height;
    elem.depth = depth;
    elem.maxFontSize = maxFontSize;
  };
  var makeSpan$2 = function makeSpan(classes, children, options, style) {
    var span = new Span(classes, children, options, style);
    sizeElementFromChildren(span);
    return span;
  };
  var makeSvgSpan = (classes, children, options, style) => new Span(classes, children, options, style);
  var makeLineSpan = function makeLineSpan2(className, options, thickness) {
    var line = makeSpan$2([className], [], options);
    line.height = Math.max(thickness || options.fontMetrics().defaultRuleThickness, options.minRuleThickness);
    line.style.borderBottomWidth = makeEm(line.height);
    line.maxFontSize = 1;
    return line;
  };
  var makeAnchor = function makeAnchor2(href, classes, children, options) {
    var anchor = new Anchor(href, classes, children, options);
    sizeElementFromChildren(anchor);
    return anchor;
  };
  var makeFragment = function makeFragment2(children) {
    var fragment = new DocumentFragment(children);
    sizeElementFromChildren(fragment);
    return fragment;
  };
  var wrapFragment = function wrapFragment2(group, options) {
    if (group instanceof DocumentFragment) {
      return makeSpan$2([], [group], options);
    }
    return group;
  };
  var getVListChildrenAndDepth = function getVListChildrenAndDepth2(params) {
    if (params.positionType === "individualShift") {
      var oldChildren = params.children;
      var children = [oldChildren[0]];
      var _depth = -oldChildren[0].shift - oldChildren[0].elem.depth;
      var currPos = _depth;
      for (var i2 = 1; i2 < oldChildren.length; i2++) {
        var diff = -oldChildren[i2].shift - currPos - oldChildren[i2].elem.depth;
        var size = diff - (oldChildren[i2 - 1].elem.height + oldChildren[i2 - 1].elem.depth);
        currPos = currPos + diff;
        children.push({
          type: "kern",
          size
        });
        children.push(oldChildren[i2]);
      }
      return {
        children,
        depth: _depth
      };
    }
    var depth;
    if (params.positionType === "top") {
      var bottom = params.positionData;
      for (var _i = 0; _i < params.children.length; _i++) {
        var child = params.children[_i];
        bottom -= child.type === "kern" ? child.size : child.elem.height + child.elem.depth;
      }
      depth = bottom;
    } else if (params.positionType === "bottom") {
      depth = -params.positionData;
    } else {
      var firstChild = params.children[0];
      if (firstChild.type !== "elem") {
        throw new Error('First child must have type "elem".');
      }
      if (params.positionType === "shift") {
        depth = -firstChild.elem.depth - params.positionData;
      } else if (params.positionType === "firstBaseline") {
        depth = -firstChild.elem.depth;
      } else {
        throw new Error("Invalid positionType " + params.positionType + ".");
      }
    }
    return {
      children: params.children,
      depth
    };
  };
  var makeVList = function makeVList2(params, options) {
    var {
      children,
      depth
    } = getVListChildrenAndDepth(params);
    var pstrutSize = 0;
    for (var i2 = 0; i2 < children.length; i2++) {
      var child = children[i2];
      if (child.type === "elem") {
        var elem = child.elem;
        pstrutSize = Math.max(pstrutSize, elem.maxFontSize, elem.height);
      }
    }
    pstrutSize += 2;
    var pstrut = makeSpan$2(["pstrut"], []);
    pstrut.style.height = makeEm(pstrutSize);
    var realChildren = [];
    var minPos = depth;
    var maxPos = depth;
    var currPos = depth;
    for (var _i2 = 0; _i2 < children.length; _i2++) {
      var _child = children[_i2];
      if (_child.type === "kern") {
        currPos += _child.size;
      } else {
        var _elem = _child.elem;
        var classes = _child.wrapperClasses || [];
        var style = _child.wrapperStyle || {};
        var childWrap = makeSpan$2(classes, [pstrut, _elem], void 0, style);
        childWrap.style.top = makeEm(-pstrutSize - currPos - _elem.depth);
        if (_child.marginLeft) {
          childWrap.style.marginLeft = _child.marginLeft;
        }
        if (_child.marginRight) {
          childWrap.style.marginRight = _child.marginRight;
        }
        realChildren.push(childWrap);
        currPos += _elem.height + _elem.depth;
      }
      minPos = Math.min(minPos, currPos);
      maxPos = Math.max(maxPos, currPos);
    }
    var vlist = makeSpan$2(["vlist"], realChildren);
    vlist.style.height = makeEm(maxPos);
    var rows;
    if (minPos < 0) {
      var emptySpan = makeSpan$2([], []);
      var depthStrut = makeSpan$2(["vlist"], [emptySpan]);
      depthStrut.style.height = makeEm(-minPos);
      var topStrut = makeSpan$2(["vlist-s"], [new SymbolNode("\u200B")]);
      rows = [makeSpan$2(["vlist-r"], [vlist, topStrut]), makeSpan$2(["vlist-r"], [depthStrut])];
    } else {
      rows = [makeSpan$2(["vlist-r"], [vlist])];
    }
    var vtable = makeSpan$2(["vlist-t"], rows);
    if (rows.length === 2) {
      vtable.classes.push("vlist-t2");
    }
    vtable.height = maxPos;
    vtable.depth = -minPos;
    return vtable;
  };
  var makeGlue = (measurement, options) => {
    var rule = makeSpan$2(["mspace"], [], options);
    var size = calculateSize(measurement, options);
    rule.style.marginRight = makeEm(size);
    return rule;
  };
  var retrieveTextFontName = function retrieveTextFontName2(fontFamily, fontWeight, fontShape) {
    var baseFontName = "";
    switch (fontFamily) {
      case "amsrm":
        baseFontName = "AMS";
        break;
      case "textrm":
        baseFontName = "Main";
        break;
      case "textsf":
        baseFontName = "SansSerif";
        break;
      case "texttt":
        baseFontName = "Typewriter";
        break;
      default:
        baseFontName = fontFamily;
    }
    var fontStylesName;
    if (fontWeight === "textbf" && fontShape === "textit") {
      fontStylesName = "BoldItalic";
    } else if (fontWeight === "textbf") {
      fontStylesName = "Bold";
    } else if (fontWeight === "textit") {
      fontStylesName = "Italic";
    } else {
      fontStylesName = "Regular";
    }
    return baseFontName + "-" + fontStylesName;
  };
  var fontMap = {
    // styles
    "mathbf": {
      variant: "bold",
      fontName: "Main-Bold"
    },
    "mathrm": {
      variant: "normal",
      fontName: "Main-Regular"
    },
    "textit": {
      variant: "italic",
      fontName: "Main-Italic"
    },
    "mathit": {
      variant: "italic",
      fontName: "Main-Italic"
    },
    "mathnormal": {
      variant: "italic",
      fontName: "Math-Italic"
    },
    "mathsfit": {
      variant: "sans-serif-italic",
      fontName: "SansSerif-Italic"
    },
    // "boldsymbol" is missing because they require the use of multiple fonts:
    // Math-BoldItalic and Main-Bold.  This is handled by a special case in
    // makeOrd which ends up calling boldsymbol.
    // families
    "mathbb": {
      variant: "double-struck",
      fontName: "AMS-Regular"
    },
    "mathcal": {
      variant: "script",
      fontName: "Caligraphic-Regular"
    },
    "mathfrak": {
      variant: "fraktur",
      fontName: "Fraktur-Regular"
    },
    "mathscr": {
      variant: "script",
      fontName: "Script-Regular"
    },
    "mathsf": {
      variant: "sans-serif",
      fontName: "SansSerif-Regular"
    },
    "mathtt": {
      variant: "monospace",
      fontName: "Typewriter-Regular"
    }
  };
  var svgData = {
    //   path, width, height
    vec: ["vec", 0.471, 0.714],
    // values from the font glyph
    oiintSize1: ["oiintSize1", 0.957, 0.499],
    // oval to overlay the integrand
    oiintSize2: ["oiintSize2", 1.472, 0.659],
    oiiintSize1: ["oiiintSize1", 1.304, 0.499],
    oiiintSize2: ["oiiintSize2", 1.98, 0.659]
  };
  var staticSvg = function staticSvg2(value, options) {
    var [pathName, width, height] = svgData[value];
    var path2 = new PathNode(pathName);
    var svgNode = new SvgNode([path2], {
      "width": makeEm(width),
      "height": makeEm(height),
      // Override CSS rule `.katex svg { width: 100% }`
      "style": "width:" + makeEm(width),
      "viewBox": "0 0 " + 1e3 * width + " " + 1e3 * height,
      "preserveAspectRatio": "xMinYMin"
    });
    var span = makeSvgSpan(["overlay"], [svgNode], options);
    span.height = height;
    span.style.height = makeEm(height);
    span.style.width = makeEm(width);
    return span;
  };
  var buildCommon = {
    fontMap,
    makeSymbol,
    mathsym,
    makeSpan: makeSpan$2,
    makeSvgSpan,
    makeLineSpan,
    makeAnchor,
    makeFragment,
    wrapFragment,
    makeVList,
    makeOrd,
    makeGlue,
    staticSvg,
    svgData,
    tryCombineChars
  };
  var thinspace = {
    number: 3,
    unit: "mu"
  };
  var mediumspace = {
    number: 4,
    unit: "mu"
  };
  var thickspace = {
    number: 5,
    unit: "mu"
  };
  var spacings = {
    mord: {
      mop: thinspace,
      mbin: mediumspace,
      mrel: thickspace,
      minner: thinspace
    },
    mop: {
      mord: thinspace,
      mop: thinspace,
      mrel: thickspace,
      minner: thinspace
    },
    mbin: {
      mord: mediumspace,
      mop: mediumspace,
      mopen: mediumspace,
      minner: mediumspace
    },
    mrel: {
      mord: thickspace,
      mop: thickspace,
      mopen: thickspace,
      minner: thickspace
    },
    mopen: {},
    mclose: {
      mop: thinspace,
      mbin: mediumspace,
      mrel: thickspace,
      minner: thinspace
    },
    mpunct: {
      mord: thinspace,
      mop: thinspace,
      mrel: thickspace,
      mopen: thinspace,
      mclose: thinspace,
      mpunct: thinspace,
      minner: thinspace
    },
    minner: {
      mord: thinspace,
      mop: thinspace,
      mbin: mediumspace,
      mrel: thickspace,
      mopen: thinspace,
      mpunct: thinspace,
      minner: thinspace
    }
  };
  var tightSpacings = {
    mord: {
      mop: thinspace
    },
    mop: {
      mord: thinspace,
      mop: thinspace
    },
    mbin: {},
    mrel: {},
    mopen: {},
    mclose: {
      mop: thinspace
    },
    mpunct: {},
    minner: {
      mop: thinspace
    }
  };
  var _functions = {};
  var _htmlGroupBuilders = {};
  var _mathmlGroupBuilders = {};
  function defineFunction(_ref) {
    var {
      type,
      names,
      props,
      handler,
      htmlBuilder: htmlBuilder3,
      mathmlBuilder: mathmlBuilder3
    } = _ref;
    var data = {
      type,
      numArgs: props.numArgs,
      argTypes: props.argTypes,
      allowedInArgument: !!props.allowedInArgument,
      allowedInText: !!props.allowedInText,
      allowedInMath: props.allowedInMath === void 0 ? true : props.allowedInMath,
      numOptionalArgs: props.numOptionalArgs || 0,
      infix: !!props.infix,
      primitive: !!props.primitive,
      handler
    };
    for (var i2 = 0; i2 < names.length; ++i2) {
      _functions[names[i2]] = data;
    }
    if (type) {
      if (htmlBuilder3) {
        _htmlGroupBuilders[type] = htmlBuilder3;
      }
      if (mathmlBuilder3) {
        _mathmlGroupBuilders[type] = mathmlBuilder3;
      }
    }
  }
  function defineFunctionBuilders(_ref2) {
    var {
      type,
      htmlBuilder: htmlBuilder3,
      mathmlBuilder: mathmlBuilder3
    } = _ref2;
    defineFunction({
      type,
      names: [],
      props: {
        numArgs: 0
      },
      handler() {
        throw new Error("Should never be called.");
      },
      htmlBuilder: htmlBuilder3,
      mathmlBuilder: mathmlBuilder3
    });
  }
  var normalizeArgument = function normalizeArgument2(arg) {
    return arg.type === "ordgroup" && arg.body.length === 1 ? arg.body[0] : arg;
  };
  var ordargument = function ordargument2(arg) {
    return arg.type === "ordgroup" ? arg.body : [arg];
  };
  var makeSpan$1 = buildCommon.makeSpan;
  var binLeftCanceller = ["leftmost", "mbin", "mopen", "mrel", "mop", "mpunct"];
  var binRightCanceller = ["rightmost", "mrel", "mclose", "mpunct"];
  var styleMap$1 = {
    "display": Style$1.DISPLAY,
    "text": Style$1.TEXT,
    "script": Style$1.SCRIPT,
    "scriptscript": Style$1.SCRIPTSCRIPT
  };
  var DomEnum = {
    mord: "mord",
    mop: "mop",
    mbin: "mbin",
    mrel: "mrel",
    mopen: "mopen",
    mclose: "mclose",
    mpunct: "mpunct",
    minner: "minner"
  };
  var buildExpression$1 = function buildExpression(expression, options, isRealGroup, surrounding) {
    if (surrounding === void 0) {
      surrounding = [null, null];
    }
    var groups = [];
    for (var i2 = 0; i2 < expression.length; i2++) {
      var output = buildGroup$1(expression[i2], options);
      if (output instanceof DocumentFragment) {
        var children = output.children;
        groups.push(...children);
      } else {
        groups.push(output);
      }
    }
    buildCommon.tryCombineChars(groups);
    if (!isRealGroup) {
      return groups;
    }
    var glueOptions = options;
    if (expression.length === 1) {
      var node = expression[0];
      if (node.type === "sizing") {
        glueOptions = options.havingSize(node.size);
      } else if (node.type === "styling") {
        glueOptions = options.havingStyle(styleMap$1[node.style]);
      }
    }
    var dummyPrev = makeSpan$1([surrounding[0] || "leftmost"], [], options);
    var dummyNext = makeSpan$1([surrounding[1] || "rightmost"], [], options);
    var isRoot = isRealGroup === "root";
    traverseNonSpaceNodes(groups, (node2, prev) => {
      var prevType = prev.classes[0];
      var type = node2.classes[0];
      if (prevType === "mbin" && binRightCanceller.includes(type)) {
        prev.classes[0] = "mord";
      } else if (type === "mbin" && binLeftCanceller.includes(prevType)) {
        node2.classes[0] = "mord";
      }
    }, {
      node: dummyPrev
    }, dummyNext, isRoot);
    traverseNonSpaceNodes(groups, (node2, prev) => {
      var prevType = getTypeOfDomTree(prev);
      var type = getTypeOfDomTree(node2);
      var space = prevType && type ? node2.hasClass("mtight") ? tightSpacings[prevType][type] : spacings[prevType][type] : null;
      if (space) {
        return buildCommon.makeGlue(space, glueOptions);
      }
    }, {
      node: dummyPrev
    }, dummyNext, isRoot);
    return groups;
  };
  var traverseNonSpaceNodes = function traverseNonSpaceNodes2(nodes, callback, prev, next, isRoot) {
    if (next) {
      nodes.push(next);
    }
    var i2 = 0;
    for (; i2 < nodes.length; i2++) {
      var node = nodes[i2];
      var partialGroup = checkPartialGroup(node);
      if (partialGroup) {
        traverseNonSpaceNodes2(partialGroup.children, callback, prev, null, isRoot);
        continue;
      }
      var nonspace = !node.hasClass("mspace");
      if (nonspace) {
        var result = callback(node, prev.node);
        if (result) {
          if (prev.insertAfter) {
            prev.insertAfter(result);
          } else {
            nodes.unshift(result);
            i2++;
          }
        }
      }
      if (nonspace) {
        prev.node = node;
      } else if (isRoot && node.hasClass("newline")) {
        prev.node = makeSpan$1(["leftmost"]);
      }
      prev.insertAfter = /* @__PURE__ */ ((index) => (n) => {
        nodes.splice(index + 1, 0, n);
        i2++;
      })(i2);
    }
    if (next) {
      nodes.pop();
    }
  };
  var checkPartialGroup = function checkPartialGroup2(node) {
    if (node instanceof DocumentFragment || node instanceof Anchor || node instanceof Span && node.hasClass("enclosing")) {
      return node;
    }
    return null;
  };
  var getOutermostNode = function getOutermostNode2(node, side) {
    var partialGroup = checkPartialGroup(node);
    if (partialGroup) {
      var children = partialGroup.children;
      if (children.length) {
        if (side === "right") {
          return getOutermostNode2(children[children.length - 1], "right");
        } else if (side === "left") {
          return getOutermostNode2(children[0], "left");
        }
      }
    }
    return node;
  };
  var getTypeOfDomTree = function getTypeOfDomTree2(node, side) {
    if (!node) {
      return null;
    }
    if (side) {
      node = getOutermostNode(node, side);
    }
    return DomEnum[node.classes[0]] || null;
  };
  var makeNullDelimiter = function makeNullDelimiter2(options, classes) {
    var moreClasses = ["nulldelimiter"].concat(options.baseSizingClasses());
    return makeSpan$1(classes.concat(moreClasses));
  };
  var buildGroup$1 = function buildGroup(group, options, baseOptions) {
    if (!group) {
      return makeSpan$1();
    }
    if (_htmlGroupBuilders[group.type]) {
      var groupNode = _htmlGroupBuilders[group.type](group, options);
      if (baseOptions && options.size !== baseOptions.size) {
        groupNode = makeSpan$1(options.sizingClasses(baseOptions), [groupNode], options);
        var multiplier = options.sizeMultiplier / baseOptions.sizeMultiplier;
        groupNode.height *= multiplier;
        groupNode.depth *= multiplier;
      }
      return groupNode;
    } else {
      throw new ParseError("Got group of unknown type: '" + group.type + "'");
    }
  };
  function buildHTMLUnbreakable(children, options) {
    var body3 = makeSpan$1(["base"], children, options);
    var strut = makeSpan$1(["strut"]);
    strut.style.height = makeEm(body3.height + body3.depth);
    if (body3.depth) {
      strut.style.verticalAlign = makeEm(-body3.depth);
    }
    body3.children.unshift(strut);
    return body3;
  }
  function buildHTML(tree, options) {
    var tag = null;
    if (tree.length === 1 && tree[0].type === "tag") {
      tag = tree[0].tag;
      tree = tree[0].body;
    }
    var expression = buildExpression$1(tree, options, "root");
    var eqnNum;
    if (expression.length === 2 && expression[1].hasClass("tag")) {
      eqnNum = expression.pop();
    }
    var children = [];
    var parts = [];
    for (var i2 = 0; i2 < expression.length; i2++) {
      parts.push(expression[i2]);
      if (expression[i2].hasClass("mbin") || expression[i2].hasClass("mrel") || expression[i2].hasClass("allowbreak")) {
        var nobreak = false;
        while (i2 < expression.length - 1 && expression[i2 + 1].hasClass("mspace") && !expression[i2 + 1].hasClass("newline")) {
          i2++;
          parts.push(expression[i2]);
          if (expression[i2].hasClass("nobreak")) {
            nobreak = true;
          }
        }
        if (!nobreak) {
          children.push(buildHTMLUnbreakable(parts, options));
          parts = [];
        }
      } else if (expression[i2].hasClass("newline")) {
        parts.pop();
        if (parts.length > 0) {
          children.push(buildHTMLUnbreakable(parts, options));
          parts = [];
        }
        children.push(expression[i2]);
      }
    }
    if (parts.length > 0) {
      children.push(buildHTMLUnbreakable(parts, options));
    }
    var tagChild;
    if (tag) {
      tagChild = buildHTMLUnbreakable(buildExpression$1(tag, options, true));
      tagChild.classes = ["tag"];
      children.push(tagChild);
    } else if (eqnNum) {
      children.push(eqnNum);
    }
    var htmlNode = makeSpan$1(["katex-html"], children);
    htmlNode.setAttribute("aria-hidden", "true");
    if (tagChild) {
      var strut = tagChild.children[0];
      strut.style.height = makeEm(htmlNode.height + htmlNode.depth);
      if (htmlNode.depth) {
        strut.style.verticalAlign = makeEm(-htmlNode.depth);
      }
    }
    return htmlNode;
  }
  function newDocumentFragment(children) {
    return new DocumentFragment(children);
  }
  var MathNode = class {
    constructor(type, children, classes) {
      this.type = void 0;
      this.attributes = void 0;
      this.children = void 0;
      this.classes = void 0;
      this.type = type;
      this.attributes = {};
      this.children = children || [];
      this.classes = classes || [];
    }
    /**
     * Sets an attribute on a MathML node. MathML depends on attributes to convey a
     * semantic content, so this is used heavily.
     */
    setAttribute(name, value) {
      this.attributes[name] = value;
    }
    /**
     * Gets an attribute on a MathML node.
     */
    getAttribute(name) {
      return this.attributes[name];
    }
    /**
     * Converts the math node into a MathML-namespaced DOM element.
     */
    toNode() {
      var node = document.createElementNS("http://www.w3.org/1998/Math/MathML", this.type);
      for (var attr in this.attributes) {
        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
          node.setAttribute(attr, this.attributes[attr]);
        }
      }
      if (this.classes.length > 0) {
        node.className = createClass(this.classes);
      }
      for (var i2 = 0; i2 < this.children.length; i2++) {
        if (this.children[i2] instanceof TextNode && this.children[i2 + 1] instanceof TextNode) {
          var text3 = this.children[i2].toText() + this.children[++i2].toText();
          while (this.children[i2 + 1] instanceof TextNode) {
            text3 += this.children[++i2].toText();
          }
          node.appendChild(new TextNode(text3).toNode());
        } else {
          node.appendChild(this.children[i2].toNode());
        }
      }
      return node;
    }
    /**
     * Converts the math node into an HTML markup string.
     */
    toMarkup() {
      var markup = "<" + this.type;
      for (var attr in this.attributes) {
        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
          markup += " " + attr + '="';
          markup += utils.escape(this.attributes[attr]);
          markup += '"';
        }
      }
      if (this.classes.length > 0) {
        markup += ' class ="' + utils.escape(createClass(this.classes)) + '"';
      }
      markup += ">";
      for (var i2 = 0; i2 < this.children.length; i2++) {
        markup += this.children[i2].toMarkup();
      }
      markup += "</" + this.type + ">";
      return markup;
    }
    /**
     * Converts the math node into a string, similar to innerText, but escaped.
     */
    toText() {
      return this.children.map((child) => child.toText()).join("");
    }
  };
  var TextNode = class {
    constructor(text3) {
      this.text = void 0;
      this.text = text3;
    }
    /**
     * Converts the text node into a DOM text node.
     */
    toNode() {
      return document.createTextNode(this.text);
    }
    /**
     * Converts the text node into escaped HTML markup
     * (representing the text itself).
     */
    toMarkup() {
      return utils.escape(this.toText());
    }
    /**
     * Converts the text node into a string
     * (representing the text itself).
     */
    toText() {
      return this.text;
    }
  };
  var SpaceNode = class {
    /**
     * Create a Space node with width given in CSS ems.
     */
    constructor(width) {
      this.width = void 0;
      this.character = void 0;
      this.width = width;
      if (width >= 0.05555 && width <= 0.05556) {
        this.character = "\u200A";
      } else if (width >= 0.1666 && width <= 0.1667) {
        this.character = "\u2009";
      } else if (width >= 0.2222 && width <= 0.2223) {
        this.character = "\u2005";
      } else if (width >= 0.2777 && width <= 0.2778) {
        this.character = "\u2005\u200A";
      } else if (width >= -0.05556 && width <= -0.05555) {
        this.character = "\u200A\u2063";
      } else if (width >= -0.1667 && width <= -0.1666) {
        this.character = "\u2009\u2063";
      } else if (width >= -0.2223 && width <= -0.2222) {
        this.character = "\u205F\u2063";
      } else if (width >= -0.2778 && width <= -0.2777) {
        this.character = "\u2005\u2063";
      } else {
        this.character = null;
      }
    }
    /**
     * Converts the math node into a MathML-namespaced DOM element.
     */
    toNode() {
      if (this.character) {
        return document.createTextNode(this.character);
      } else {
        var node = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mspace");
        node.setAttribute("width", makeEm(this.width));
        return node;
      }
    }
    /**
     * Converts the math node into an HTML markup string.
     */
    toMarkup() {
      if (this.character) {
        return "<mtext>" + this.character + "</mtext>";
      } else {
        return '<mspace width="' + makeEm(this.width) + '"/>';
      }
    }
    /**
     * Converts the math node into a string, similar to innerText.
     */
    toText() {
      if (this.character) {
        return this.character;
      } else {
        return " ";
      }
    }
  };
  var mathMLTree = {
    MathNode,
    TextNode,
    SpaceNode,
    newDocumentFragment
  };
  var makeText = function makeText2(text3, mode, options) {
    if (symbols[mode][text3] && symbols[mode][text3].replace && text3.charCodeAt(0) !== 55349 && !(ligatures.hasOwnProperty(text3) && options && (options.fontFamily && options.fontFamily.slice(4, 6) === "tt" || options.font && options.font.slice(4, 6) === "tt"))) {
      text3 = symbols[mode][text3].replace;
    }
    return new mathMLTree.TextNode(text3);
  };
  var makeRow = function makeRow2(body3) {
    if (body3.length === 1) {
      return body3[0];
    } else {
      return new mathMLTree.MathNode("mrow", body3);
    }
  };
  var getVariant = function getVariant2(group, options) {
    if (options.fontFamily === "texttt") {
      return "monospace";
    } else if (options.fontFamily === "textsf") {
      if (options.fontShape === "textit" && options.fontWeight === "textbf") {
        return "sans-serif-bold-italic";
      } else if (options.fontShape === "textit") {
        return "sans-serif-italic";
      } else if (options.fontWeight === "textbf") {
        return "bold-sans-serif";
      } else {
        return "sans-serif";
      }
    } else if (options.fontShape === "textit" && options.fontWeight === "textbf") {
      return "bold-italic";
    } else if (options.fontShape === "textit") {
      return "italic";
    } else if (options.fontWeight === "textbf") {
      return "bold";
    }
    var font = options.font;
    if (!font || font === "mathnormal") {
      return null;
    }
    var mode = group.mode;
    if (font === "mathit") {
      return "italic";
    } else if (font === "boldsymbol") {
      return group.type === "textord" ? "bold" : "bold-italic";
    } else if (font === "mathbf") {
      return "bold";
    } else if (font === "mathbb") {
      return "double-struck";
    } else if (font === "mathsfit") {
      return "sans-serif-italic";
    } else if (font === "mathfrak") {
      return "fraktur";
    } else if (font === "mathscr" || font === "mathcal") {
      return "script";
    } else if (font === "mathsf") {
      return "sans-serif";
    } else if (font === "mathtt") {
      return "monospace";
    }
    var text3 = group.text;
    if (["\\imath", "\\jmath"].includes(text3)) {
      return null;
    }
    if (symbols[mode][text3] && symbols[mode][text3].replace) {
      text3 = symbols[mode][text3].replace;
    }
    var fontName = buildCommon.fontMap[font].fontName;
    if (getCharacterMetrics(text3, fontName, mode)) {
      return buildCommon.fontMap[font].variant;
    }
    return null;
  };
  function isNumberPunctuation(group) {
    if (!group) {
      return false;
    }
    if (group.type === "mi" && group.children.length === 1) {
      var child = group.children[0];
      return child instanceof TextNode && child.text === ".";
    } else if (group.type === "mo" && group.children.length === 1 && group.getAttribute("separator") === "true" && group.getAttribute("lspace") === "0em" && group.getAttribute("rspace") === "0em") {
      var _child = group.children[0];
      return _child instanceof TextNode && _child.text === ",";
    } else {
      return false;
    }
  }
  var buildExpression2 = function buildExpression3(expression, options, isOrdgroup) {
    if (expression.length === 1) {
      var group = buildGroup2(expression[0], options);
      if (isOrdgroup && group instanceof MathNode && group.type === "mo") {
        group.setAttribute("lspace", "0em");
        group.setAttribute("rspace", "0em");
      }
      return [group];
    }
    var groups = [];
    var lastGroup;
    for (var i2 = 0; i2 < expression.length; i2++) {
      var _group = buildGroup2(expression[i2], options);
      if (_group instanceof MathNode && lastGroup instanceof MathNode) {
        if (_group.type === "mtext" && lastGroup.type === "mtext" && _group.getAttribute("mathvariant") === lastGroup.getAttribute("mathvariant")) {
          lastGroup.children.push(..._group.children);
          continue;
        } else if (_group.type === "mn" && lastGroup.type === "mn") {
          lastGroup.children.push(..._group.children);
          continue;
        } else if (isNumberPunctuation(_group) && lastGroup.type === "mn") {
          lastGroup.children.push(..._group.children);
          continue;
        } else if (_group.type === "mn" && isNumberPunctuation(lastGroup)) {
          _group.children = [...lastGroup.children, ..._group.children];
          groups.pop();
        } else if ((_group.type === "msup" || _group.type === "msub") && _group.children.length >= 1 && (lastGroup.type === "mn" || isNumberPunctuation(lastGroup))) {
          var base = _group.children[0];
          if (base instanceof MathNode && base.type === "mn") {
            base.children = [...lastGroup.children, ...base.children];
            groups.pop();
          }
        } else if (lastGroup.type === "mi" && lastGroup.children.length === 1) {
          var lastChild = lastGroup.children[0];
          if (lastChild instanceof TextNode && lastChild.text === "\u0338" && (_group.type === "mo" || _group.type === "mi" || _group.type === "mn")) {
            var child = _group.children[0];
            if (child instanceof TextNode && child.text.length > 0) {
              child.text = child.text.slice(0, 1) + "\u0338" + child.text.slice(1);
              groups.pop();
            }
          }
        }
      }
      groups.push(_group);
      lastGroup = _group;
    }
    return groups;
  };
  var buildExpressionRow = function buildExpressionRow2(expression, options, isOrdgroup) {
    return makeRow(buildExpression2(expression, options, isOrdgroup));
  };
  var buildGroup2 = function buildGroup3(group, options) {
    if (!group) {
      return new mathMLTree.MathNode("mrow");
    }
    if (_mathmlGroupBuilders[group.type]) {
      var result = _mathmlGroupBuilders[group.type](group, options);
      return result;
    } else {
      throw new ParseError("Got group of unknown type: '" + group.type + "'");
    }
  };
  function buildMathML(tree, texExpression, options, isDisplayMode, forMathmlOnly) {
    var expression = buildExpression2(tree, options);
    var wrapper;
    if (expression.length === 1 && expression[0] instanceof MathNode && ["mrow", "mtable"].includes(expression[0].type)) {
      wrapper = expression[0];
    } else {
      wrapper = new mathMLTree.MathNode("mrow", expression);
    }
    var annotation = new mathMLTree.MathNode("annotation", [new mathMLTree.TextNode(texExpression)]);
    annotation.setAttribute("encoding", "application/x-tex");
    var semantics = new mathMLTree.MathNode("semantics", [wrapper, annotation]);
    var math2 = new mathMLTree.MathNode("math", [semantics]);
    math2.setAttribute("xmlns", "http://www.w3.org/1998/Math/MathML");
    if (isDisplayMode) {
      math2.setAttribute("display", "block");
    }
    var wrapperClass = forMathmlOnly ? "katex" : "katex-mathml";
    return buildCommon.makeSpan([wrapperClass], [math2]);
  }
  var optionsFromSettings = function optionsFromSettings2(settings) {
    return new Options({
      style: settings.displayMode ? Style$1.DISPLAY : Style$1.TEXT,
      maxSize: settings.maxSize,
      minRuleThickness: settings.minRuleThickness
    });
  };
  var displayWrap = function displayWrap2(node, settings) {
    if (settings.displayMode) {
      var classes = ["katex-display"];
      if (settings.leqno) {
        classes.push("leqno");
      }
      if (settings.fleqn) {
        classes.push("fleqn");
      }
      node = buildCommon.makeSpan(classes, [node]);
    }
    return node;
  };
  var buildTree = function buildTree2(tree, expression, settings) {
    var options = optionsFromSettings(settings);
    var katexNode;
    if (settings.output === "mathml") {
      return buildMathML(tree, expression, options, settings.displayMode, true);
    } else if (settings.output === "html") {
      var htmlNode = buildHTML(tree, options);
      katexNode = buildCommon.makeSpan(["katex"], [htmlNode]);
    } else {
      var mathMLNode = buildMathML(tree, expression, options, settings.displayMode, false);
      var _htmlNode = buildHTML(tree, options);
      katexNode = buildCommon.makeSpan(["katex"], [mathMLNode, _htmlNode]);
    }
    return displayWrap(katexNode, settings);
  };
  var buildHTMLTree = function buildHTMLTree2(tree, expression, settings) {
    var options = optionsFromSettings(settings);
    var htmlNode = buildHTML(tree, options);
    var katexNode = buildCommon.makeSpan(["katex"], [htmlNode]);
    return displayWrap(katexNode, settings);
  };
  var stretchyCodePoint = {
    widehat: "^",
    widecheck: "\u02C7",
    widetilde: "~",
    utilde: "~",
    overleftarrow: "\u2190",
    underleftarrow: "\u2190",
    xleftarrow: "\u2190",
    overrightarrow: "\u2192",
    underrightarrow: "\u2192",
    xrightarrow: "\u2192",
    underbrace: "\u23DF",
    overbrace: "\u23DE",
    overgroup: "\u23E0",
    undergroup: "\u23E1",
    overleftrightarrow: "\u2194",
    underleftrightarrow: "\u2194",
    xleftrightarrow: "\u2194",
    Overrightarrow: "\u21D2",
    xRightarrow: "\u21D2",
    overleftharpoon: "\u21BC",
    xleftharpoonup: "\u21BC",
    overrightharpoon: "\u21C0",
    xrightharpoonup: "\u21C0",
    xLeftarrow: "\u21D0",
    xLeftrightarrow: "\u21D4",
    xhookleftarrow: "\u21A9",
    xhookrightarrow: "\u21AA",
    xmapsto: "\u21A6",
    xrightharpoondown: "\u21C1",
    xleftharpoondown: "\u21BD",
    xrightleftharpoons: "\u21CC",
    xleftrightharpoons: "\u21CB",
    xtwoheadleftarrow: "\u219E",
    xtwoheadrightarrow: "\u21A0",
    xlongequal: "=",
    xtofrom: "\u21C4",
    xrightleftarrows: "\u21C4",
    xrightequilibrium: "\u21CC",
    // Not a perfect match.
    xleftequilibrium: "\u21CB",
    // None better available.
    "\\cdrightarrow": "\u2192",
    "\\cdleftarrow": "\u2190",
    "\\cdlongequal": "="
  };
  var mathMLnode = function mathMLnode2(label) {
    var node = new mathMLTree.MathNode("mo", [new mathMLTree.TextNode(stretchyCodePoint[label.replace(/^\\/, "")])]);
    node.setAttribute("stretchy", "true");
    return node;
  };
  var katexImagesData = {
    //   path(s), minWidth, height, align
    overrightarrow: [["rightarrow"], 0.888, 522, "xMaxYMin"],
    overleftarrow: [["leftarrow"], 0.888, 522, "xMinYMin"],
    underrightarrow: [["rightarrow"], 0.888, 522, "xMaxYMin"],
    underleftarrow: [["leftarrow"], 0.888, 522, "xMinYMin"],
    xrightarrow: [["rightarrow"], 1.469, 522, "xMaxYMin"],
    "\\cdrightarrow": [["rightarrow"], 3, 522, "xMaxYMin"],
    // CD minwwidth2.5pc
    xleftarrow: [["leftarrow"], 1.469, 522, "xMinYMin"],
    "\\cdleftarrow": [["leftarrow"], 3, 522, "xMinYMin"],
    Overrightarrow: [["doublerightarrow"], 0.888, 560, "xMaxYMin"],
    xRightarrow: [["doublerightarrow"], 1.526, 560, "xMaxYMin"],
    xLeftarrow: [["doubleleftarrow"], 1.526, 560, "xMinYMin"],
    overleftharpoon: [["leftharpoon"], 0.888, 522, "xMinYMin"],
    xleftharpoonup: [["leftharpoon"], 0.888, 522, "xMinYMin"],
    xleftharpoondown: [["leftharpoondown"], 0.888, 522, "xMinYMin"],
    overrightharpoon: [["rightharpoon"], 0.888, 522, "xMaxYMin"],
    xrightharpoonup: [["rightharpoon"], 0.888, 522, "xMaxYMin"],
    xrightharpoondown: [["rightharpoondown"], 0.888, 522, "xMaxYMin"],
    xlongequal: [["longequal"], 0.888, 334, "xMinYMin"],
    "\\cdlongequal": [["longequal"], 3, 334, "xMinYMin"],
    xtwoheadleftarrow: [["twoheadleftarrow"], 0.888, 334, "xMinYMin"],
    xtwoheadrightarrow: [["twoheadrightarrow"], 0.888, 334, "xMaxYMin"],
    overleftrightarrow: [["leftarrow", "rightarrow"], 0.888, 522],
    overbrace: [["leftbrace", "midbrace", "rightbrace"], 1.6, 548],
    underbrace: [["leftbraceunder", "midbraceunder", "rightbraceunder"], 1.6, 548],
    underleftrightarrow: [["leftarrow", "rightarrow"], 0.888, 522],
    xleftrightarrow: [["leftarrow", "rightarrow"], 1.75, 522],
    xLeftrightarrow: [["doubleleftarrow", "doublerightarrow"], 1.75, 560],
    xrightleftharpoons: [["leftharpoondownplus", "rightharpoonplus"], 1.75, 716],
    xleftrightharpoons: [["leftharpoonplus", "rightharpoondownplus"], 1.75, 716],
    xhookleftarrow: [["leftarrow", "righthook"], 1.08, 522],
    xhookrightarrow: [["lefthook", "rightarrow"], 1.08, 522],
    overlinesegment: [["leftlinesegment", "rightlinesegment"], 0.888, 522],
    underlinesegment: [["leftlinesegment", "rightlinesegment"], 0.888, 522],
    overgroup: [["leftgroup", "rightgroup"], 0.888, 342],
    undergroup: [["leftgroupunder", "rightgroupunder"], 0.888, 342],
    xmapsto: [["leftmapsto", "rightarrow"], 1.5, 522],
    xtofrom: [["leftToFrom", "rightToFrom"], 1.75, 528],
    // The next three arrows are from the mhchem package.
    // In mhchem.sty, min-length is 2.0em. But these arrows might appear in the
    // document as \xrightarrow or \xrightleftharpoons. Those have
    // min-length = 1.75em, so we set min-length on these next three to match.
    xrightleftarrows: [["baraboveleftarrow", "rightarrowabovebar"], 1.75, 901],
    xrightequilibrium: [["baraboveshortleftharpoon", "rightharpoonaboveshortbar"], 1.75, 716],
    xleftequilibrium: [["shortbaraboveleftharpoon", "shortrightharpoonabovebar"], 1.75, 716]
  };
  var groupLength = function groupLength2(arg) {
    if (arg.type === "ordgroup") {
      return arg.body.length;
    } else {
      return 1;
    }
  };
  var svgSpan = function svgSpan2(group, options) {
    function buildSvgSpan_() {
      var viewBoxWidth = 4e5;
      var label = group.label.slice(1);
      if (["widehat", "widecheck", "widetilde", "utilde"].includes(label)) {
        var grp = group;
        var numChars = groupLength(grp.base);
        var viewBoxHeight;
        var pathName;
        var _height;
        if (numChars > 5) {
          if (label === "widehat" || label === "widecheck") {
            viewBoxHeight = 420;
            viewBoxWidth = 2364;
            _height = 0.42;
            pathName = label + "4";
          } else {
            viewBoxHeight = 312;
            viewBoxWidth = 2340;
            _height = 0.34;
            pathName = "tilde4";
          }
        } else {
          var imgIndex = [1, 1, 2, 2, 3, 3][numChars];
          if (label === "widehat" || label === "widecheck") {
            viewBoxWidth = [0, 1062, 2364, 2364, 2364][imgIndex];
            viewBoxHeight = [0, 239, 300, 360, 420][imgIndex];
            _height = [0, 0.24, 0.3, 0.3, 0.36, 0.42][imgIndex];
            pathName = label + imgIndex;
          } else {
            viewBoxWidth = [0, 600, 1033, 2339, 2340][imgIndex];
            viewBoxHeight = [0, 260, 286, 306, 312][imgIndex];
            _height = [0, 0.26, 0.286, 0.3, 0.306, 0.34][imgIndex];
            pathName = "tilde" + imgIndex;
          }
        }
        var path2 = new PathNode(pathName);
        var svgNode = new SvgNode([path2], {
          "width": "100%",
          "height": makeEm(_height),
          "viewBox": "0 0 " + viewBoxWidth + " " + viewBoxHeight,
          "preserveAspectRatio": "none"
        });
        return {
          span: buildCommon.makeSvgSpan([], [svgNode], options),
          minWidth: 0,
          height: _height
        };
      } else {
        var spans = [];
        var data = katexImagesData[label];
        var [paths, _minWidth, _viewBoxHeight] = data;
        var _height2 = _viewBoxHeight / 1e3;
        var numSvgChildren = paths.length;
        var widthClasses;
        var aligns;
        if (numSvgChildren === 1) {
          var align1 = data[3];
          widthClasses = ["hide-tail"];
          aligns = [align1];
        } else if (numSvgChildren === 2) {
          widthClasses = ["halfarrow-left", "halfarrow-right"];
          aligns = ["xMinYMin", "xMaxYMin"];
        } else if (numSvgChildren === 3) {
          widthClasses = ["brace-left", "brace-center", "brace-right"];
          aligns = ["xMinYMin", "xMidYMin", "xMaxYMin"];
        } else {
          throw new Error("Correct katexImagesData or update code here to support\n                    " + numSvgChildren + " children.");
        }
        for (var i2 = 0; i2 < numSvgChildren; i2++) {
          var _path = new PathNode(paths[i2]);
          var _svgNode = new SvgNode([_path], {
            "width": "400em",
            "height": makeEm(_height2),
            "viewBox": "0 0 " + viewBoxWidth + " " + _viewBoxHeight,
            "preserveAspectRatio": aligns[i2] + " slice"
          });
          var _span = buildCommon.makeSvgSpan([widthClasses[i2]], [_svgNode], options);
          if (numSvgChildren === 1) {
            return {
              span: _span,
              minWidth: _minWidth,
              height: _height2
            };
          } else {
            _span.style.height = makeEm(_height2);
            spans.push(_span);
          }
        }
        return {
          span: buildCommon.makeSpan(["stretchy"], spans, options),
          minWidth: _minWidth,
          height: _height2
        };
      }
    }
    var {
      span,
      minWidth,
      height
    } = buildSvgSpan_();
    span.height = height;
    span.style.height = makeEm(height);
    if (minWidth > 0) {
      span.style.minWidth = makeEm(minWidth);
    }
    return span;
  };
  var encloseSpan = function encloseSpan2(inner2, label, topPad, bottomPad, options) {
    var img;
    var totalHeight = inner2.height + inner2.depth + topPad + bottomPad;
    if (/fbox|color|angl/.test(label)) {
      img = buildCommon.makeSpan(["stretchy", label], [], options);
      if (label === "fbox") {
        var color = options.color && options.getColor();
        if (color) {
          img.style.borderColor = color;
        }
      }
    } else {
      var lines = [];
      if (/^[bx]cancel$/.test(label)) {
        lines.push(new LineNode({
          "x1": "0",
          "y1": "0",
          "x2": "100%",
          "y2": "100%",
          "stroke-width": "0.046em"
        }));
      }
      if (/^x?cancel$/.test(label)) {
        lines.push(new LineNode({
          "x1": "0",
          "y1": "100%",
          "x2": "100%",
          "y2": "0",
          "stroke-width": "0.046em"
        }));
      }
      var svgNode = new SvgNode(lines, {
        "width": "100%",
        "height": makeEm(totalHeight)
      });
      img = buildCommon.makeSvgSpan([], [svgNode], options);
    }
    img.height = totalHeight;
    img.style.height = makeEm(totalHeight);
    return img;
  };
  var stretchy = {
    encloseSpan,
    mathMLnode,
    svgSpan
  };
  function assertNodeType(node, type) {
    if (!node || node.type !== type) {
      throw new Error("Expected node of type " + type + ", but got " + (node ? "node of type " + node.type : String(node)));
    }
    return node;
  }
  function assertSymbolNodeType(node) {
    var typedNode = checkSymbolNodeType(node);
    if (!typedNode) {
      throw new Error("Expected node of symbol group type, but got " + (node ? "node of type " + node.type : String(node)));
    }
    return typedNode;
  }
  function checkSymbolNodeType(node) {
    if (node && (node.type === "atom" || NON_ATOMS.hasOwnProperty(node.type))) {
      return node;
    }
    return null;
  }
  var htmlBuilder$a = (grp, options) => {
    var base;
    var group;
    var supSubGroup;
    if (grp && grp.type === "supsub") {
      group = assertNodeType(grp.base, "accent");
      base = group.base;
      grp.base = base;
      supSubGroup = assertSpan(buildGroup$1(grp, options));
      grp.base = group;
    } else {
      group = assertNodeType(grp, "accent");
      base = group.base;
    }
    var body3 = buildGroup$1(base, options.havingCrampedStyle());
    var mustShift = group.isShifty && utils.isCharacterBox(base);
    var skew = 0;
    if (mustShift) {
      var baseChar = utils.getBaseElem(base);
      var baseGroup = buildGroup$1(baseChar, options.havingCrampedStyle());
      skew = assertSymbolDomNode(baseGroup).skew;
    }
    var accentBelow = group.label === "\\c";
    var clearance = accentBelow ? body3.height + body3.depth : Math.min(body3.height, options.fontMetrics().xHeight);
    var accentBody;
    if (!group.isStretchy) {
      var accent2;
      var width;
      if (group.label === "\\vec") {
        accent2 = buildCommon.staticSvg("vec", options);
        width = buildCommon.svgData.vec[1];
      } else {
        accent2 = buildCommon.makeOrd({
          mode: group.mode,
          text: group.label
        }, options, "textord");
        accent2 = assertSymbolDomNode(accent2);
        accent2.italic = 0;
        width = accent2.width;
        if (accentBelow) {
          clearance += accent2.depth;
        }
      }
      accentBody = buildCommon.makeSpan(["accent-body"], [accent2]);
      var accentFull = group.label === "\\textcircled";
      if (accentFull) {
        accentBody.classes.push("accent-full");
        clearance = body3.height;
      }
      var left = skew;
      if (!accentFull) {
        left -= width / 2;
      }
      accentBody.style.left = makeEm(left);
      if (group.label === "\\textcircled") {
        accentBody.style.top = ".2em";
      }
      accentBody = buildCommon.makeVList({
        positionType: "firstBaseline",
        children: [{
          type: "elem",
          elem: body3
        }, {
          type: "kern",
          size: -clearance
        }, {
          type: "elem",
          elem: accentBody
        }]
      }, options);
    } else {
      accentBody = stretchy.svgSpan(group, options);
      accentBody = buildCommon.makeVList({
        positionType: "firstBaseline",
        children: [{
          type: "elem",
          elem: body3
        }, {
          type: "elem",
          elem: accentBody,
          wrapperClasses: ["svg-align"],
          wrapperStyle: skew > 0 ? {
            width: "calc(100% - " + makeEm(2 * skew) + ")",
            marginLeft: makeEm(2 * skew)
          } : void 0
        }]
      }, options);
    }
    var accentWrap = buildCommon.makeSpan(["mord", "accent"], [accentBody], options);
    if (supSubGroup) {
      supSubGroup.children[0] = accentWrap;
      supSubGroup.height = Math.max(accentWrap.height, supSubGroup.height);
      supSubGroup.classes[0] = "mord";
      return supSubGroup;
    } else {
      return accentWrap;
    }
  };
  var mathmlBuilder$9 = (group, options) => {
    var accentNode = group.isStretchy ? stretchy.mathMLnode(group.label) : new mathMLTree.MathNode("mo", [makeText(group.label, group.mode)]);
    var node = new mathMLTree.MathNode("mover", [buildGroup2(group.base, options), accentNode]);
    node.setAttribute("accent", "true");
    return node;
  };
  var NON_STRETCHY_ACCENT_REGEX = new RegExp(["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring"].map((accent2) => "\\" + accent2).join("|"));
  defineFunction({
    type: "accent",
    names: ["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring", "\\widecheck", "\\widehat", "\\widetilde", "\\overrightarrow", "\\overleftarrow", "\\Overrightarrow", "\\overleftrightarrow", "\\overgroup", "\\overlinesegment", "\\overleftharpoon", "\\overrightharpoon"],
    props: {
      numArgs: 1
    },
    handler: (context, args) => {
      var base = normalizeArgument(args[0]);
      var isStretchy = !NON_STRETCHY_ACCENT_REGEX.test(context.funcName);
      var isShifty = !isStretchy || context.funcName === "\\widehat" || context.funcName === "\\widetilde" || context.funcName === "\\widecheck";
      return {
        type: "accent",
        mode: context.parser.mode,
        label: context.funcName,
        isStretchy,
        isShifty,
        base
      };
    },
    htmlBuilder: htmlBuilder$a,
    mathmlBuilder: mathmlBuilder$9
  });
  defineFunction({
    type: "accent",
    names: ["\\'", "\\`", "\\^", "\\~", "\\=", "\\u", "\\.", '\\"', "\\c", "\\r", "\\H", "\\v", "\\textcircled"],
    props: {
      numArgs: 1,
      allowedInText: true,
      allowedInMath: true,
      // unless in strict mode
      argTypes: ["primitive"]
    },
    handler: (context, args) => {
      var base = args[0];
      var mode = context.parser.mode;
      if (mode === "math") {
        context.parser.settings.reportNonstrict("mathVsTextAccents", "LaTeX's accent " + context.funcName + " works only in text mode");
        mode = "text";
      }
      return {
        type: "accent",
        mode,
        label: context.funcName,
        isStretchy: false,
        isShifty: true,
        base
      };
    },
    htmlBuilder: htmlBuilder$a,
    mathmlBuilder: mathmlBuilder$9
  });
  defineFunction({
    type: "accentUnder",
    names: ["\\underleftarrow", "\\underrightarrow", "\\underleftrightarrow", "\\undergroup", "\\underlinesegment", "\\utilde"],
    props: {
      numArgs: 1
    },
    handler: (_ref, args) => {
      var {
        parser,
        funcName
      } = _ref;
      var base = args[0];
      return {
        type: "accentUnder",
        mode: parser.mode,
        label: funcName,
        base
      };
    },
    htmlBuilder: (group, options) => {
      var innerGroup = buildGroup$1(group.base, options);
      var accentBody = stretchy.svgSpan(group, options);
      var kern = group.label === "\\utilde" ? 0.12 : 0;
      var vlist = buildCommon.makeVList({
        positionType: "top",
        positionData: innerGroup.height,
        children: [{
          type: "elem",
          elem: accentBody,
          wrapperClasses: ["svg-align"]
        }, {
          type: "kern",
          size: kern
        }, {
          type: "elem",
          elem: innerGroup
        }]
      }, options);
      return buildCommon.makeSpan(["mord", "accentunder"], [vlist], options);
    },
    mathmlBuilder: (group, options) => {
      var accentNode = stretchy.mathMLnode(group.label);
      var node = new mathMLTree.MathNode("munder", [buildGroup2(group.base, options), accentNode]);
      node.setAttribute("accentunder", "true");
      return node;
    }
  });
  var paddedNode = (group) => {
    var node = new mathMLTree.MathNode("mpadded", group ? [group] : []);
    node.setAttribute("width", "+0.6em");
    node.setAttribute("lspace", "0.3em");
    return node;
  };
  defineFunction({
    type: "xArrow",
    names: [
      "\\xleftarrow",
      "\\xrightarrow",
      "\\xLeftarrow",
      "\\xRightarrow",
      "\\xleftrightarrow",
      "\\xLeftrightarrow",
      "\\xhookleftarrow",
      "\\xhookrightarrow",
      "\\xmapsto",
      "\\xrightharpoondown",
      "\\xrightharpoonup",
      "\\xleftharpoondown",
      "\\xleftharpoonup",
      "\\xrightleftharpoons",
      "\\xleftrightharpoons",
      "\\xlongequal",
      "\\xtwoheadrightarrow",
      "\\xtwoheadleftarrow",
      "\\xtofrom",
      // The next 3 functions are here to support the mhchem extension.
      // Direct use of these functions is discouraged and may break someday.
      "\\xrightleftarrows",
      "\\xrightequilibrium",
      "\\xleftequilibrium",
      // The next 3 functions are here only to support the {CD} environment.
      "\\\\cdrightarrow",
      "\\\\cdleftarrow",
      "\\\\cdlongequal"
    ],
    props: {
      numArgs: 1,
      numOptionalArgs: 1
    },
    handler(_ref, args, optArgs) {
      var {
        parser,
        funcName
      } = _ref;
      return {
        type: "xArrow",
        mode: parser.mode,
        label: funcName,
        body: args[0],
        below: optArgs[0]
      };
    },
    // Flow is unable to correctly infer the type of `group`, even though it's
    // unambiguously determined from the passed-in `type` above.
    htmlBuilder(group, options) {
      var style = options.style;
      var newOptions = options.havingStyle(style.sup());
      var upperGroup = buildCommon.wrapFragment(buildGroup$1(group.body, newOptions, options), options);
      var arrowPrefix = group.label.slice(0, 2) === "\\x" ? "x" : "cd";
      upperGroup.classes.push(arrowPrefix + "-arrow-pad");
      var lowerGroup;
      if (group.below) {
        newOptions = options.havingStyle(style.sub());
        lowerGroup = buildCommon.wrapFragment(buildGroup$1(group.below, newOptions, options), options);
        lowerGroup.classes.push(arrowPrefix + "-arrow-pad");
      }
      var arrowBody = stretchy.svgSpan(group, options);
      var arrowShift = -options.fontMetrics().axisHeight + 0.5 * arrowBody.height;
      var upperShift = -options.fontMetrics().axisHeight - 0.5 * arrowBody.height - 0.111;
      if (upperGroup.depth > 0.25 || group.label === "\\xleftequilibrium") {
        upperShift -= upperGroup.depth;
      }
      var vlist;
      if (lowerGroup) {
        var lowerShift = -options.fontMetrics().axisHeight + lowerGroup.height + 0.5 * arrowBody.height + 0.111;
        vlist = buildCommon.makeVList({
          positionType: "individualShift",
          children: [{
            type: "elem",
            elem: upperGroup,
            shift: upperShift
          }, {
            type: "elem",
            elem: arrowBody,
            shift: arrowShift
          }, {
            type: "elem",
            elem: lowerGroup,
            shift: lowerShift
          }]
        }, options);
      } else {
        vlist = buildCommon.makeVList({
          positionType: "individualShift",
          children: [{
            type: "elem",
            elem: upperGroup,
            shift: upperShift
          }, {
            type: "elem",
            elem: arrowBody,
            shift: arrowShift
          }]
        }, options);
      }
      vlist.children[0].children[0].children[1].classes.push("svg-align");
      return buildCommon.makeSpan(["mrel", "x-arrow"], [vlist], options);
    },
    mathmlBuilder(group, options) {
      var arrowNode = stretchy.mathMLnode(group.label);
      arrowNode.setAttribute("minsize", group.label.charAt(0) === "x" ? "1.75em" : "3.0em");
      var node;
      if (group.body) {
        var upperNode = paddedNode(buildGroup2(group.body, options));
        if (group.below) {
          var lowerNode = paddedNode(buildGroup2(group.below, options));
          node = new mathMLTree.MathNode("munderover", [arrowNode, lowerNode, upperNode]);
        } else {
          node = new mathMLTree.MathNode("mover", [arrowNode, upperNode]);
        }
      } else if (group.below) {
        var _lowerNode = paddedNode(buildGroup2(group.below, options));
        node = new mathMLTree.MathNode("munder", [arrowNode, _lowerNode]);
      } else {
        node = paddedNode();
        node = new mathMLTree.MathNode("mover", [arrowNode, node]);
      }
      return node;
    }
  });
  var makeSpan2 = buildCommon.makeSpan;
  function htmlBuilder$9(group, options) {
    var elements = buildExpression$1(group.body, options, true);
    return makeSpan2([group.mclass], elements, options);
  }
  function mathmlBuilder$8(group, options) {
    var node;
    var inner2 = buildExpression2(group.body, options);
    if (group.mclass === "minner") {
      node = new mathMLTree.MathNode("mpadded", inner2);
    } else if (group.mclass === "mord") {
      if (group.isCharacterBox) {
        node = inner2[0];
        node.type = "mi";
      } else {
        node = new mathMLTree.MathNode("mi", inner2);
      }
    } else {
      if (group.isCharacterBox) {
        node = inner2[0];
        node.type = "mo";
      } else {
        node = new mathMLTree.MathNode("mo", inner2);
      }
      if (group.mclass === "mbin") {
        node.attributes.lspace = "0.22em";
        node.attributes.rspace = "0.22em";
      } else if (group.mclass === "mpunct") {
        node.attributes.lspace = "0em";
        node.attributes.rspace = "0.17em";
      } else if (group.mclass === "mopen" || group.mclass === "mclose") {
        node.attributes.lspace = "0em";
        node.attributes.rspace = "0em";
      } else if (group.mclass === "minner") {
        node.attributes.lspace = "0.0556em";
        node.attributes.width = "+0.1111em";
      }
    }
    return node;
  }
  defineFunction({
    type: "mclass",
    names: ["\\mathord", "\\mathbin", "\\mathrel", "\\mathopen", "\\mathclose", "\\mathpunct", "\\mathinner"],
    props: {
      numArgs: 1,
      primitive: true
    },
    handler(_ref, args) {
      var {
        parser,
        funcName
      } = _ref;
      var body3 = args[0];
      return {
        type: "mclass",
        mode: parser.mode,
        mclass: "m" + funcName.slice(5),
        // TODO(kevinb): don't prefix with 'm'
        body: ordargument(body3),
        isCharacterBox: utils.isCharacterBox(body3)
      };
    },
    htmlBuilder: htmlBuilder$9,
    mathmlBuilder: mathmlBuilder$8
  });
  var binrelClass = (arg) => {
    var atom = arg.type === "ordgroup" && arg.body.length ? arg.body[0] : arg;
    if (atom.type === "atom" && (atom.family === "bin" || atom.family === "rel")) {
      return "m" + atom.family;
    } else {
      return "mord";
    }
  };
  defineFunction({
    type: "mclass",
    names: ["\\@binrel"],
    props: {
      numArgs: 2
    },
    handler(_ref2, args) {
      var {
        parser
      } = _ref2;
      return {
        type: "mclass",
        mode: parser.mode,
        mclass: binrelClass(args[0]),
        body: ordargument(args[1]),
        isCharacterBox: utils.isCharacterBox(args[1])
      };
    }
  });
  defineFunction({
    type: "mclass",
    names: ["\\stackrel", "\\overset", "\\underset"],
    props: {
      numArgs: 2
    },
    handler(_ref3, args) {
      var {
        parser,
        funcName
      } = _ref3;
      var baseArg = args[1];
      var shiftedArg = args[0];
      var mclass;
      if (funcName !== "\\stackrel") {
        mclass = binrelClass(baseArg);
      } else {
        mclass = "mrel";
      }
      var baseOp = {
        type: "op",
        mode: baseArg.mode,
        limits: true,
        alwaysHandleSupSub: true,
        parentIsSupSub: false,
        symbol: false,
        suppressBaseShift: funcName !== "\\stackrel",
        body: ordargument(baseArg)
      };
      var supsub = {
        type: "supsub",
        mode: shiftedArg.mode,
        base: baseOp,
        sup: funcName === "\\underset" ? null : shiftedArg,
        sub: funcName === "\\underset" ? shiftedArg : null
      };
      return {
        type: "mclass",
        mode: parser.mode,
        mclass,
        body: [supsub],
        isCharacterBox: utils.isCharacterBox(supsub)
      };
    },
    htmlBuilder: htmlBuilder$9,
    mathmlBuilder: mathmlBuilder$8
  });
  defineFunction({
    type: "pmb",
    names: ["\\pmb"],
    props: {
      numArgs: 1,
      allowedInText: true
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      return {
        type: "pmb",
        mode: parser.mode,
        mclass: binrelClass(args[0]),
        body: ordargument(args[0])
      };
    },
    htmlBuilder(group, options) {
      var elements = buildExpression$1(group.body, options, true);
      var node = buildCommon.makeSpan([group.mclass], elements, options);
      node.style.textShadow = "0.02em 0.01em 0.04px";
      return node;
    },
    mathmlBuilder(group, style) {
      var inner2 = buildExpression2(group.body, style);
      var node = new mathMLTree.MathNode("mstyle", inner2);
      node.setAttribute("style", "text-shadow: 0.02em 0.01em 0.04px");
      return node;
    }
  });
  var cdArrowFunctionName = {
    ">": "\\\\cdrightarrow",
    "<": "\\\\cdleftarrow",
    "=": "\\\\cdlongequal",
    "A": "\\uparrow",
    "V": "\\downarrow",
    "|": "\\Vert",
    ".": "no arrow"
  };
  var newCell = () => {
    return {
      type: "styling",
      body: [],
      mode: "math",
      style: "display"
    };
  };
  var isStartOfArrow = (node) => {
    return node.type === "textord" && node.text === "@";
  };
  var isLabelEnd = (node, endChar) => {
    return (node.type === "mathord" || node.type === "atom") && node.text === endChar;
  };
  function cdArrow(arrowChar, labels, parser) {
    var funcName = cdArrowFunctionName[arrowChar];
    switch (funcName) {
      case "\\\\cdrightarrow":
      case "\\\\cdleftarrow":
        return parser.callFunction(funcName, [labels[0]], [labels[1]]);
      case "\\uparrow":
      case "\\downarrow": {
        var leftLabel = parser.callFunction("\\\\cdleft", [labels[0]], []);
        var bareArrow = {
          type: "atom",
          text: funcName,
          mode: "math",
          family: "rel"
        };
        var sizedArrow = parser.callFunction("\\Big", [bareArrow], []);
        var rightLabel = parser.callFunction("\\\\cdright", [labels[1]], []);
        var arrowGroup = {
          type: "ordgroup",
          mode: "math",
          body: [leftLabel, sizedArrow, rightLabel]
        };
        return parser.callFunction("\\\\cdparent", [arrowGroup], []);
      }
      case "\\\\cdlongequal":
        return parser.callFunction("\\\\cdlongequal", [], []);
      case "\\Vert": {
        var arrow = {
          type: "textord",
          text: "\\Vert",
          mode: "math"
        };
        return parser.callFunction("\\Big", [arrow], []);
      }
      default:
        return {
          type: "textord",
          text: " ",
          mode: "math"
        };
    }
  }
  function parseCD(parser) {
    var parsedRows = [];
    parser.gullet.beginGroup();
    parser.gullet.macros.set("\\cr", "\\\\\\relax");
    parser.gullet.beginGroup();
    while (true) {
      parsedRows.push(parser.parseExpression(false, "\\\\"));
      parser.gullet.endGroup();
      parser.gullet.beginGroup();
      var next = parser.fetch().text;
      if (next === "&" || next === "\\\\") {
        parser.consume();
      } else if (next === "\\end") {
        if (parsedRows[parsedRows.length - 1].length === 0) {
          parsedRows.pop();
        }
        break;
      } else {
        throw new ParseError("Expected \\\\ or \\cr or \\end", parser.nextToken);
      }
    }
    var row = [];
    var body3 = [row];
    for (var i2 = 0; i2 < parsedRows.length; i2++) {
      var rowNodes = parsedRows[i2];
      var cell = newCell();
      for (var j3 = 0; j3 < rowNodes.length; j3++) {
        if (!isStartOfArrow(rowNodes[j3])) {
          cell.body.push(rowNodes[j3]);
        } else {
          row.push(cell);
          j3 += 1;
          var arrowChar = assertSymbolNodeType(rowNodes[j3]).text;
          var labels = new Array(2);
          labels[0] = {
            type: "ordgroup",
            mode: "math",
            body: []
          };
          labels[1] = {
            type: "ordgroup",
            mode: "math",
            body: []
          };
          if ("=|.".indexOf(arrowChar) > -1) ;
          else if ("<>AV".indexOf(arrowChar) > -1) {
            for (var labelNum = 0; labelNum < 2; labelNum++) {
              var inLabel = true;
              for (var k4 = j3 + 1; k4 < rowNodes.length; k4++) {
                if (isLabelEnd(rowNodes[k4], arrowChar)) {
                  inLabel = false;
                  j3 = k4;
                  break;
                }
                if (isStartOfArrow(rowNodes[k4])) {
                  throw new ParseError("Missing a " + arrowChar + " character to complete a CD arrow.", rowNodes[k4]);
                }
                labels[labelNum].body.push(rowNodes[k4]);
              }
              if (inLabel) {
                throw new ParseError("Missing a " + arrowChar + " character to complete a CD arrow.", rowNodes[j3]);
              }
            }
          } else {
            throw new ParseError('Expected one of "<>AV=|." after @', rowNodes[j3]);
          }
          var arrow = cdArrow(arrowChar, labels, parser);
          var wrappedArrow = {
            type: "styling",
            body: [arrow],
            mode: "math",
            style: "display"
            // CD is always displaystyle.
          };
          row.push(wrappedArrow);
          cell = newCell();
        }
      }
      if (i2 % 2 === 0) {
        row.push(cell);
      } else {
        row.shift();
      }
      row = [];
      body3.push(row);
    }
    parser.gullet.endGroup();
    parser.gullet.endGroup();
    var cols = new Array(body3[0].length).fill({
      type: "align",
      align: "c",
      pregap: 0.25,
      // CD package sets \enskip between columns.
      postgap: 0.25
      // So pre and post each get half an \enskip, i.e. 0.25em.
    });
    return {
      type: "array",
      mode: "math",
      body: body3,
      arraystretch: 1,
      addJot: true,
      rowGaps: [null],
      cols,
      colSeparationType: "CD",
      hLinesBeforeRow: new Array(body3.length + 1).fill([])
    };
  }
  defineFunction({
    type: "cdlabel",
    names: ["\\\\cdleft", "\\\\cdright"],
    props: {
      numArgs: 1
    },
    handler(_ref, args) {
      var {
        parser,
        funcName
      } = _ref;
      return {
        type: "cdlabel",
        mode: parser.mode,
        side: funcName.slice(4),
        label: args[0]
      };
    },
    htmlBuilder(group, options) {
      var newOptions = options.havingStyle(options.style.sup());
      var label = buildCommon.wrapFragment(buildGroup$1(group.label, newOptions, options), options);
      label.classes.push("cd-label-" + group.side);
      label.style.bottom = makeEm(0.8 - label.depth);
      label.height = 0;
      label.depth = 0;
      return label;
    },
    mathmlBuilder(group, options) {
      var label = new mathMLTree.MathNode("mrow", [buildGroup2(group.label, options)]);
      label = new mathMLTree.MathNode("mpadded", [label]);
      label.setAttribute("width", "0");
      if (group.side === "left") {
        label.setAttribute("lspace", "-1width");
      }
      label.setAttribute("voffset", "0.7em");
      label = new mathMLTree.MathNode("mstyle", [label]);
      label.setAttribute("displaystyle", "false");
      label.setAttribute("scriptlevel", "1");
      return label;
    }
  });
  defineFunction({
    type: "cdlabelparent",
    names: ["\\\\cdparent"],
    props: {
      numArgs: 1
    },
    handler(_ref2, args) {
      var {
        parser
      } = _ref2;
      return {
        type: "cdlabelparent",
        mode: parser.mode,
        fragment: args[0]
      };
    },
    htmlBuilder(group, options) {
      var parent = buildCommon.wrapFragment(buildGroup$1(group.fragment, options), options);
      parent.classes.push("cd-vert-arrow");
      return parent;
    },
    mathmlBuilder(group, options) {
      return new mathMLTree.MathNode("mrow", [buildGroup2(group.fragment, options)]);
    }
  });
  defineFunction({
    type: "textord",
    names: ["\\@char"],
    props: {
      numArgs: 1,
      allowedInText: true
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      var arg = assertNodeType(args[0], "ordgroup");
      var group = arg.body;
      var number2 = "";
      for (var i2 = 0; i2 < group.length; i2++) {
        var node = assertNodeType(group[i2], "textord");
        number2 += node.text;
      }
      var code = parseInt(number2);
      var text3;
      if (isNaN(code)) {
        throw new ParseError("\\@char has non-numeric argument " + number2);
      } else if (code < 0 || code >= 1114111) {
        throw new ParseError("\\@char with invalid code point " + number2);
      } else if (code <= 65535) {
        text3 = String.fromCharCode(code);
      } else {
        code -= 65536;
        text3 = String.fromCharCode((code >> 10) + 55296, (code & 1023) + 56320);
      }
      return {
        type: "textord",
        mode: parser.mode,
        text: text3
      };
    }
  });
  var htmlBuilder$8 = (group, options) => {
    var elements = buildExpression$1(group.body, options.withColor(group.color), false);
    return buildCommon.makeFragment(elements);
  };
  var mathmlBuilder$7 = (group, options) => {
    var inner2 = buildExpression2(group.body, options.withColor(group.color));
    var node = new mathMLTree.MathNode("mstyle", inner2);
    node.setAttribute("mathcolor", group.color);
    return node;
  };
  defineFunction({
    type: "color",
    names: ["\\textcolor"],
    props: {
      numArgs: 2,
      allowedInText: true,
      argTypes: ["color", "original"]
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      var color = assertNodeType(args[0], "color-token").color;
      var body3 = args[1];
      return {
        type: "color",
        mode: parser.mode,
        color,
        body: ordargument(body3)
      };
    },
    htmlBuilder: htmlBuilder$8,
    mathmlBuilder: mathmlBuilder$7
  });
  defineFunction({
    type: "color",
    names: ["\\color"],
    props: {
      numArgs: 1,
      allowedInText: true,
      argTypes: ["color"]
    },
    handler(_ref2, args) {
      var {
        parser,
        breakOnTokenText
      } = _ref2;
      var color = assertNodeType(args[0], "color-token").color;
      parser.gullet.macros.set("\\current@color", color);
      var body3 = parser.parseExpression(true, breakOnTokenText);
      return {
        type: "color",
        mode: parser.mode,
        color,
        body: body3
      };
    },
    htmlBuilder: htmlBuilder$8,
    mathmlBuilder: mathmlBuilder$7
  });
  defineFunction({
    type: "cr",
    names: ["\\\\"],
    props: {
      numArgs: 0,
      numOptionalArgs: 0,
      allowedInText: true
    },
    handler(_ref, args, optArgs) {
      var {
        parser
      } = _ref;
      var size = parser.gullet.future().text === "[" ? parser.parseSizeGroup(true) : null;
      var newLine = !parser.settings.displayMode || !parser.settings.useStrictBehavior("newLineInDisplayMode", "In LaTeX, \\\\ or \\newline does nothing in display mode");
      return {
        type: "cr",
        mode: parser.mode,
        newLine,
        size: size && assertNodeType(size, "size").value
      };
    },
    // The following builders are called only at the top level,
    // not within tabular/array environments.
    htmlBuilder(group, options) {
      var span = buildCommon.makeSpan(["mspace"], [], options);
      if (group.newLine) {
        span.classes.push("newline");
        if (group.size) {
          span.style.marginTop = makeEm(calculateSize(group.size, options));
        }
      }
      return span;
    },
    mathmlBuilder(group, options) {
      var node = new mathMLTree.MathNode("mspace");
      if (group.newLine) {
        node.setAttribute("linebreak", "newline");
        if (group.size) {
          node.setAttribute("height", makeEm(calculateSize(group.size, options)));
        }
      }
      return node;
    }
  });
  var globalMap = {
    "\\global": "\\global",
    "\\long": "\\\\globallong",
    "\\\\globallong": "\\\\globallong",
    "\\def": "\\gdef",
    "\\gdef": "\\gdef",
    "\\edef": "\\xdef",
    "\\xdef": "\\xdef",
    "\\let": "\\\\globallet",
    "\\futurelet": "\\\\globalfuture"
  };
  var checkControlSequence = (tok) => {
    var name = tok.text;
    if (/^(?:[\\{}$&#^_]|EOF)$/.test(name)) {
      throw new ParseError("Expected a control sequence", tok);
    }
    return name;
  };
  var getRHS = (parser) => {
    var tok = parser.gullet.popToken();
    if (tok.text === "=") {
      tok = parser.gullet.popToken();
      if (tok.text === " ") {
        tok = parser.gullet.popToken();
      }
    }
    return tok;
  };
  var letCommand = (parser, name, tok, global) => {
    var macro = parser.gullet.macros.get(tok.text);
    if (macro == null) {
      tok.noexpand = true;
      macro = {
        tokens: [tok],
        numArgs: 0,
        // reproduce the same behavior in expansion
        unexpandable: !parser.gullet.isExpandable(tok.text)
      };
    }
    parser.gullet.macros.set(name, macro, global);
  };
  defineFunction({
    type: "internal",
    names: [
      "\\global",
      "\\long",
      "\\\\globallong"
      // can’t be entered directly
    ],
    props: {
      numArgs: 0,
      allowedInText: true
    },
    handler(_ref) {
      var {
        parser,
        funcName
      } = _ref;
      parser.consumeSpaces();
      var token2 = parser.fetch();
      if (globalMap[token2.text]) {
        if (funcName === "\\global" || funcName === "\\\\globallong") {
          token2.text = globalMap[token2.text];
        }
        return assertNodeType(parser.parseFunction(), "internal");
      }
      throw new ParseError("Invalid token after macro prefix", token2);
    }
  });
  defineFunction({
    type: "internal",
    names: ["\\def", "\\gdef", "\\edef", "\\xdef"],
    props: {
      numArgs: 0,
      allowedInText: true,
      primitive: true
    },
    handler(_ref2) {
      var {
        parser,
        funcName
      } = _ref2;
      var tok = parser.gullet.popToken();
      var name = tok.text;
      if (/^(?:[\\{}$&#^_]|EOF)$/.test(name)) {
        throw new ParseError("Expected a control sequence", tok);
      }
      var numArgs = 0;
      var insert;
      var delimiters2 = [[]];
      while (parser.gullet.future().text !== "{") {
        tok = parser.gullet.popToken();
        if (tok.text === "#") {
          if (parser.gullet.future().text === "{") {
            insert = parser.gullet.future();
            delimiters2[numArgs].push("{");
            break;
          }
          tok = parser.gullet.popToken();
          if (!/^[1-9]$/.test(tok.text)) {
            throw new ParseError('Invalid argument number "' + tok.text + '"');
          }
          if (parseInt(tok.text) !== numArgs + 1) {
            throw new ParseError('Argument number "' + tok.text + '" out of order');
          }
          numArgs++;
          delimiters2.push([]);
        } else if (tok.text === "EOF") {
          throw new ParseError("Expected a macro definition");
        } else {
          delimiters2[numArgs].push(tok.text);
        }
      }
      var {
        tokens
      } = parser.gullet.consumeArg();
      if (insert) {
        tokens.unshift(insert);
      }
      if (funcName === "\\edef" || funcName === "\\xdef") {
        tokens = parser.gullet.expandTokens(tokens);
        tokens.reverse();
      }
      parser.gullet.macros.set(name, {
        tokens,
        numArgs,
        delimiters: delimiters2
      }, funcName === globalMap[funcName]);
      return {
        type: "internal",
        mode: parser.mode
      };
    }
  });
  defineFunction({
    type: "internal",
    names: [
      "\\let",
      "\\\\globallet"
      // can’t be entered directly
    ],
    props: {
      numArgs: 0,
      allowedInText: true,
      primitive: true
    },
    handler(_ref3) {
      var {
        parser,
        funcName
      } = _ref3;
      var name = checkControlSequence(parser.gullet.popToken());
      parser.gullet.consumeSpaces();
      var tok = getRHS(parser);
      letCommand(parser, name, tok, funcName === "\\\\globallet");
      return {
        type: "internal",
        mode: parser.mode
      };
    }
  });
  defineFunction({
    type: "internal",
    names: [
      "\\futurelet",
      "\\\\globalfuture"
      // can’t be entered directly
    ],
    props: {
      numArgs: 0,
      allowedInText: true,
      primitive: true
    },
    handler(_ref4) {
      var {
        parser,
        funcName
      } = _ref4;
      var name = checkControlSequence(parser.gullet.popToken());
      var middle = parser.gullet.popToken();
      var tok = parser.gullet.popToken();
      letCommand(parser, name, tok, funcName === "\\\\globalfuture");
      parser.gullet.pushToken(tok);
      parser.gullet.pushToken(middle);
      return {
        type: "internal",
        mode: parser.mode
      };
    }
  });
  var getMetrics = function getMetrics2(symbol, font, mode) {
    var replace = symbols.math[symbol] && symbols.math[symbol].replace;
    var metrics = getCharacterMetrics(replace || symbol, font, mode);
    if (!metrics) {
      throw new Error("Unsupported symbol " + symbol + " and font size " + font + ".");
    }
    return metrics;
  };
  var styleWrap = function styleWrap2(delim, toStyle, options, classes) {
    var newOptions = options.havingBaseStyle(toStyle);
    var span = buildCommon.makeSpan(classes.concat(newOptions.sizingClasses(options)), [delim], options);
    var delimSizeMultiplier = newOptions.sizeMultiplier / options.sizeMultiplier;
    span.height *= delimSizeMultiplier;
    span.depth *= delimSizeMultiplier;
    span.maxFontSize = newOptions.sizeMultiplier;
    return span;
  };
  var centerSpan = function centerSpan2(span, options, style) {
    var newOptions = options.havingBaseStyle(style);
    var shift = (1 - options.sizeMultiplier / newOptions.sizeMultiplier) * options.fontMetrics().axisHeight;
    span.classes.push("delimcenter");
    span.style.top = makeEm(shift);
    span.height -= shift;
    span.depth += shift;
  };
  var makeSmallDelim = function makeSmallDelim2(delim, style, center, options, mode, classes) {
    var text3 = buildCommon.makeSymbol(delim, "Main-Regular", mode, options);
    var span = styleWrap(text3, style, options, classes);
    if (center) {
      centerSpan(span, options, style);
    }
    return span;
  };
  var mathrmSize = function mathrmSize2(value, size, mode, options) {
    return buildCommon.makeSymbol(value, "Size" + size + "-Regular", mode, options);
  };
  var makeLargeDelim = function makeLargeDelim2(delim, size, center, options, mode, classes) {
    var inner2 = mathrmSize(delim, size, mode, options);
    var span = styleWrap(buildCommon.makeSpan(["delimsizing", "size" + size], [inner2], options), Style$1.TEXT, options, classes);
    if (center) {
      centerSpan(span, options, Style$1.TEXT);
    }
    return span;
  };
  var makeGlyphSpan = function makeGlyphSpan2(symbol, font, mode) {
    var sizeClass;
    if (font === "Size1-Regular") {
      sizeClass = "delim-size1";
    } else {
      sizeClass = "delim-size4";
    }
    var corner = buildCommon.makeSpan(["delimsizinginner", sizeClass], [buildCommon.makeSpan([], [buildCommon.makeSymbol(symbol, font, mode)])]);
    return {
      type: "elem",
      elem: corner
    };
  };
  var makeInner = function makeInner2(ch, height, options) {
    var width = fontMetricsData["Size4-Regular"][ch.charCodeAt(0)] ? fontMetricsData["Size4-Regular"][ch.charCodeAt(0)][4] : fontMetricsData["Size1-Regular"][ch.charCodeAt(0)][4];
    var path2 = new PathNode("inner", innerPath(ch, Math.round(1e3 * height)));
    var svgNode = new SvgNode([path2], {
      "width": makeEm(width),
      "height": makeEm(height),
      // Override CSS rule `.katex svg { width: 100% }`
      "style": "width:" + makeEm(width),
      "viewBox": "0 0 " + 1e3 * width + " " + Math.round(1e3 * height),
      "preserveAspectRatio": "xMinYMin"
    });
    var span = buildCommon.makeSvgSpan([], [svgNode], options);
    span.height = height;
    span.style.height = makeEm(height);
    span.style.width = makeEm(width);
    return {
      type: "elem",
      elem: span
    };
  };
  var lapInEms = 8e-3;
  var lap = {
    type: "kern",
    size: -1 * lapInEms
  };
  var verts = ["|", "\\lvert", "\\rvert", "\\vert"];
  var doubleVerts = ["\\|", "\\lVert", "\\rVert", "\\Vert"];
  var makeStackedDelim = function makeStackedDelim2(delim, heightTotal, center, options, mode, classes) {
    var top;
    var middle;
    var repeat;
    var bottom;
    var svgLabel = "";
    var viewBoxWidth = 0;
    top = repeat = bottom = delim;
    middle = null;
    var font = "Size1-Regular";
    if (delim === "\\uparrow") {
      repeat = bottom = "\u23D0";
    } else if (delim === "\\Uparrow") {
      repeat = bottom = "\u2016";
    } else if (delim === "\\downarrow") {
      top = repeat = "\u23D0";
    } else if (delim === "\\Downarrow") {
      top = repeat = "\u2016";
    } else if (delim === "\\updownarrow") {
      top = "\\uparrow";
      repeat = "\u23D0";
      bottom = "\\downarrow";
    } else if (delim === "\\Updownarrow") {
      top = "\\Uparrow";
      repeat = "\u2016";
      bottom = "\\Downarrow";
    } else if (verts.includes(delim)) {
      repeat = "\u2223";
      svgLabel = "vert";
      viewBoxWidth = 333;
    } else if (doubleVerts.includes(delim)) {
      repeat = "\u2225";
      svgLabel = "doublevert";
      viewBoxWidth = 556;
    } else if (delim === "[" || delim === "\\lbrack") {
      top = "\u23A1";
      repeat = "\u23A2";
      bottom = "\u23A3";
      font = "Size4-Regular";
      svgLabel = "lbrack";
      viewBoxWidth = 667;
    } else if (delim === "]" || delim === "\\rbrack") {
      top = "\u23A4";
      repeat = "\u23A5";
      bottom = "\u23A6";
      font = "Size4-Regular";
      svgLabel = "rbrack";
      viewBoxWidth = 667;
    } else if (delim === "\\lfloor" || delim === "\u230A") {
      repeat = top = "\u23A2";
      bottom = "\u23A3";
      font = "Size4-Regular";
      svgLabel = "lfloor";
      viewBoxWidth = 667;
    } else if (delim === "\\lceil" || delim === "\u2308") {
      top = "\u23A1";
      repeat = bottom = "\u23A2";
      font = "Size4-Regular";
      svgLabel = "lceil";
      viewBoxWidth = 667;
    } else if (delim === "\\rfloor" || delim === "\u230B") {
      repeat = top = "\u23A5";
      bottom = "\u23A6";
      font = "Size4-Regular";
      svgLabel = "rfloor";
      viewBoxWidth = 667;
    } else if (delim === "\\rceil" || delim === "\u2309") {
      top = "\u23A4";
      repeat = bottom = "\u23A5";
      font = "Size4-Regular";
      svgLabel = "rceil";
      viewBoxWidth = 667;
    } else if (delim === "(" || delim === "\\lparen") {
      top = "\u239B";
      repeat = "\u239C";
      bottom = "\u239D";
      font = "Size4-Regular";
      svgLabel = "lparen";
      viewBoxWidth = 875;
    } else if (delim === ")" || delim === "\\rparen") {
      top = "\u239E";
      repeat = "\u239F";
      bottom = "\u23A0";
      font = "Size4-Regular";
      svgLabel = "rparen";
      viewBoxWidth = 875;
    } else if (delim === "\\{" || delim === "\\lbrace") {
      top = "\u23A7";
      middle = "\u23A8";
      bottom = "\u23A9";
      repeat = "\u23AA";
      font = "Size4-Regular";
    } else if (delim === "\\}" || delim === "\\rbrace") {
      top = "\u23AB";
      middle = "\u23AC";
      bottom = "\u23AD";
      repeat = "\u23AA";
      font = "Size4-Regular";
    } else if (delim === "\\lgroup" || delim === "\u27EE") {
      top = "\u23A7";
      bottom = "\u23A9";
      repeat = "\u23AA";
      font = "Size4-Regular";
    } else if (delim === "\\rgroup" || delim === "\u27EF") {
      top = "\u23AB";
      bottom = "\u23AD";
      repeat = "\u23AA";
      font = "Size4-Regular";
    } else if (delim === "\\lmoustache" || delim === "\u23B0") {
      top = "\u23A7";
      bottom = "\u23AD";
      repeat = "\u23AA";
      font = "Size4-Regular";
    } else if (delim === "\\rmoustache" || delim === "\u23B1") {
      top = "\u23AB";
      bottom = "\u23A9";
      repeat = "\u23AA";
      font = "Size4-Regular";
    }
    var topMetrics = getMetrics(top, font, mode);
    var topHeightTotal = topMetrics.height + topMetrics.depth;
    var repeatMetrics = getMetrics(repeat, font, mode);
    var repeatHeightTotal = repeatMetrics.height + repeatMetrics.depth;
    var bottomMetrics = getMetrics(bottom, font, mode);
    var bottomHeightTotal = bottomMetrics.height + bottomMetrics.depth;
    var middleHeightTotal = 0;
    var middleFactor = 1;
    if (middle !== null) {
      var middleMetrics = getMetrics(middle, font, mode);
      middleHeightTotal = middleMetrics.height + middleMetrics.depth;
      middleFactor = 2;
    }
    var minHeight = topHeightTotal + bottomHeightTotal + middleHeightTotal;
    var repeatCount = Math.max(0, Math.ceil((heightTotal - minHeight) / (middleFactor * repeatHeightTotal)));
    var realHeightTotal = minHeight + repeatCount * middleFactor * repeatHeightTotal;
    var axisHeight = options.fontMetrics().axisHeight;
    if (center) {
      axisHeight *= options.sizeMultiplier;
    }
    var depth = realHeightTotal / 2 - axisHeight;
    var stack = [];
    if (svgLabel.length > 0) {
      var midHeight = realHeightTotal - topHeightTotal - bottomHeightTotal;
      var viewBoxHeight = Math.round(realHeightTotal * 1e3);
      var pathStr = tallDelim(svgLabel, Math.round(midHeight * 1e3));
      var path2 = new PathNode(svgLabel, pathStr);
      var width = (viewBoxWidth / 1e3).toFixed(3) + "em";
      var height = (viewBoxHeight / 1e3).toFixed(3) + "em";
      var svg3 = new SvgNode([path2], {
        "width": width,
        "height": height,
        "viewBox": "0 0 " + viewBoxWidth + " " + viewBoxHeight
      });
      var wrapper = buildCommon.makeSvgSpan([], [svg3], options);
      wrapper.height = viewBoxHeight / 1e3;
      wrapper.style.width = width;
      wrapper.style.height = height;
      stack.push({
        type: "elem",
        elem: wrapper
      });
    } else {
      stack.push(makeGlyphSpan(bottom, font, mode));
      stack.push(lap);
      if (middle === null) {
        var innerHeight = realHeightTotal - topHeightTotal - bottomHeightTotal + 2 * lapInEms;
        stack.push(makeInner(repeat, innerHeight, options));
      } else {
        var _innerHeight = (realHeightTotal - topHeightTotal - bottomHeightTotal - middleHeightTotal) / 2 + 2 * lapInEms;
        stack.push(makeInner(repeat, _innerHeight, options));
        stack.push(lap);
        stack.push(makeGlyphSpan(middle, font, mode));
        stack.push(lap);
        stack.push(makeInner(repeat, _innerHeight, options));
      }
      stack.push(lap);
      stack.push(makeGlyphSpan(top, font, mode));
    }
    var newOptions = options.havingBaseStyle(Style$1.TEXT);
    var inner2 = buildCommon.makeVList({
      positionType: "bottom",
      positionData: depth,
      children: stack
    }, newOptions);
    return styleWrap(buildCommon.makeSpan(["delimsizing", "mult"], [inner2], newOptions), Style$1.TEXT, options, classes);
  };
  var vbPad = 80;
  var emPad = 0.08;
  var sqrtSvg = function sqrtSvg2(sqrtName, height, viewBoxHeight, extraVinculum, options) {
    var path2 = sqrtPath(sqrtName, extraVinculum, viewBoxHeight);
    var pathNode = new PathNode(sqrtName, path2);
    var svg3 = new SvgNode([pathNode], {
      // Note: 1000:1 ratio of viewBox to document em width.
      "width": "400em",
      "height": makeEm(height),
      "viewBox": "0 0 400000 " + viewBoxHeight,
      "preserveAspectRatio": "xMinYMin slice"
    });
    return buildCommon.makeSvgSpan(["hide-tail"], [svg3], options);
  };
  var makeSqrtImage = function makeSqrtImage2(height, options) {
    var newOptions = options.havingBaseSizing();
    var delim = traverseSequence("\\surd", height * newOptions.sizeMultiplier, stackLargeDelimiterSequence, newOptions);
    var sizeMultiplier = newOptions.sizeMultiplier;
    var extraVinculum = Math.max(0, options.minRuleThickness - options.fontMetrics().sqrtRuleThickness);
    var span;
    var spanHeight = 0;
    var texHeight = 0;
    var viewBoxHeight = 0;
    var advanceWidth;
    if (delim.type === "small") {
      viewBoxHeight = 1e3 + 1e3 * extraVinculum + vbPad;
      if (height < 1) {
        sizeMultiplier = 1;
      } else if (height < 1.4) {
        sizeMultiplier = 0.7;
      }
      spanHeight = (1 + extraVinculum + emPad) / sizeMultiplier;
      texHeight = (1 + extraVinculum) / sizeMultiplier;
      span = sqrtSvg("sqrtMain", spanHeight, viewBoxHeight, extraVinculum, options);
      span.style.minWidth = "0.853em";
      advanceWidth = 0.833 / sizeMultiplier;
    } else if (delim.type === "large") {
      viewBoxHeight = (1e3 + vbPad) * sizeToMaxHeight[delim.size];
      texHeight = (sizeToMaxHeight[delim.size] + extraVinculum) / sizeMultiplier;
      spanHeight = (sizeToMaxHeight[delim.size] + extraVinculum + emPad) / sizeMultiplier;
      span = sqrtSvg("sqrtSize" + delim.size, spanHeight, viewBoxHeight, extraVinculum, options);
      span.style.minWidth = "1.02em";
      advanceWidth = 1 / sizeMultiplier;
    } else {
      spanHeight = height + extraVinculum + emPad;
      texHeight = height + extraVinculum;
      viewBoxHeight = Math.floor(1e3 * height + extraVinculum) + vbPad;
      span = sqrtSvg("sqrtTall", spanHeight, viewBoxHeight, extraVinculum, options);
      span.style.minWidth = "0.742em";
      advanceWidth = 1.056;
    }
    span.height = texHeight;
    span.style.height = makeEm(spanHeight);
    return {
      span,
      advanceWidth,
      // Calculate the actual line width.
      // This actually should depend on the chosen font -- e.g. \boldmath
      // should use the thicker surd symbols from e.g. KaTeX_Main-Bold, and
      // have thicker rules.
      ruleWidth: (options.fontMetrics().sqrtRuleThickness + extraVinculum) * sizeMultiplier
    };
  };
  var stackLargeDelimiters = ["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "\u230A", "\u230B", "\\lceil", "\\rceil", "\u2308", "\u2309", "\\surd"];
  var stackAlwaysDelimiters = ["\\uparrow", "\\downarrow", "\\updownarrow", "\\Uparrow", "\\Downarrow", "\\Updownarrow", "|", "\\|", "\\vert", "\\Vert", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "\u27EE", "\u27EF", "\\lmoustache", "\\rmoustache", "\u23B0", "\u23B1"];
  var stackNeverDelimiters = ["<", ">", "\\langle", "\\rangle", "/", "\\backslash", "\\lt", "\\gt"];
  var sizeToMaxHeight = [0, 1.2, 1.8, 2.4, 3];
  var makeSizedDelim = function makeSizedDelim2(delim, size, options, mode, classes) {
    if (delim === "<" || delim === "\\lt" || delim === "\u27E8") {
      delim = "\\langle";
    } else if (delim === ">" || delim === "\\gt" || delim === "\u27E9") {
      delim = "\\rangle";
    }
    if (stackLargeDelimiters.includes(delim) || stackNeverDelimiters.includes(delim)) {
      return makeLargeDelim(delim, size, false, options, mode, classes);
    } else if (stackAlwaysDelimiters.includes(delim)) {
      return makeStackedDelim(delim, sizeToMaxHeight[size], false, options, mode, classes);
    } else {
      throw new ParseError("Illegal delimiter: '" + delim + "'");
    }
  };
  var stackNeverDelimiterSequence = [{
    type: "small",
    style: Style$1.SCRIPTSCRIPT
  }, {
    type: "small",
    style: Style$1.SCRIPT
  }, {
    type: "small",
    style: Style$1.TEXT
  }, {
    type: "large",
    size: 1
  }, {
    type: "large",
    size: 2
  }, {
    type: "large",
    size: 3
  }, {
    type: "large",
    size: 4
  }];
  var stackAlwaysDelimiterSequence = [{
    type: "small",
    style: Style$1.SCRIPTSCRIPT
  }, {
    type: "small",
    style: Style$1.SCRIPT
  }, {
    type: "small",
    style: Style$1.TEXT
  }, {
    type: "stack"
  }];
  var stackLargeDelimiterSequence = [{
    type: "small",
    style: Style$1.SCRIPTSCRIPT
  }, {
    type: "small",
    style: Style$1.SCRIPT
  }, {
    type: "small",
    style: Style$1.TEXT
  }, {
    type: "large",
    size: 1
  }, {
    type: "large",
    size: 2
  }, {
    type: "large",
    size: 3
  }, {
    type: "large",
    size: 4
  }, {
    type: "stack"
  }];
  var delimTypeToFont = function delimTypeToFont2(type) {
    if (type.type === "small") {
      return "Main-Regular";
    } else if (type.type === "large") {
      return "Size" + type.size + "-Regular";
    } else if (type.type === "stack") {
      return "Size4-Regular";
    } else {
      throw new Error("Add support for delim type '" + type.type + "' here.");
    }
  };
  var traverseSequence = function traverseSequence2(delim, height, sequence, options) {
    var start = Math.min(2, 3 - options.style.size);
    for (var i2 = start; i2 < sequence.length; i2++) {
      if (sequence[i2].type === "stack") {
        break;
      }
      var metrics = getMetrics(delim, delimTypeToFont(sequence[i2]), "math");
      var heightDepth = metrics.height + metrics.depth;
      if (sequence[i2].type === "small") {
        var newOptions = options.havingBaseStyle(sequence[i2].style);
        heightDepth *= newOptions.sizeMultiplier;
      }
      if (heightDepth > height) {
        return sequence[i2];
      }
    }
    return sequence[sequence.length - 1];
  };
  var makeCustomSizedDelim = function makeCustomSizedDelim2(delim, height, center, options, mode, classes) {
    if (delim === "<" || delim === "\\lt" || delim === "\u27E8") {
      delim = "\\langle";
    } else if (delim === ">" || delim === "\\gt" || delim === "\u27E9") {
      delim = "\\rangle";
    }
    var sequence;
    if (stackNeverDelimiters.includes(delim)) {
      sequence = stackNeverDelimiterSequence;
    } else if (stackLargeDelimiters.includes(delim)) {
      sequence = stackLargeDelimiterSequence;
    } else {
      sequence = stackAlwaysDelimiterSequence;
    }
    var delimType = traverseSequence(delim, height, sequence, options);
    if (delimType.type === "small") {
      return makeSmallDelim(delim, delimType.style, center, options, mode, classes);
    } else if (delimType.type === "large") {
      return makeLargeDelim(delim, delimType.size, center, options, mode, classes);
    } else {
      return makeStackedDelim(delim, height, center, options, mode, classes);
    }
  };
  var makeLeftRightDelim = function makeLeftRightDelim2(delim, height, depth, options, mode, classes) {
    var axisHeight = options.fontMetrics().axisHeight * options.sizeMultiplier;
    var delimiterFactor = 901;
    var delimiterExtend = 5 / options.fontMetrics().ptPerEm;
    var maxDistFromAxis = Math.max(height - axisHeight, depth + axisHeight);
    var totalHeight = Math.max(
      // In real TeX, calculations are done using integral values which are
      // 65536 per pt, or 655360 per em. So, the division here truncates in
      // TeX but doesn't here, producing different results. If we wanted to
      // exactly match TeX's calculation, we could do
      //   Math.floor(655360 * maxDistFromAxis / 500) *
      //    delimiterFactor / 655360
      // (To see the difference, compare
      //    x^{x^{\left(\rule{0.1em}{0.68em}\right)}}
      // in TeX and KaTeX)
      maxDistFromAxis / 500 * delimiterFactor,
      2 * maxDistFromAxis - delimiterExtend
    );
    return makeCustomSizedDelim(delim, totalHeight, true, options, mode, classes);
  };
  var delimiter = {
    sqrtImage: makeSqrtImage,
    sizedDelim: makeSizedDelim,
    sizeToMaxHeight,
    customSizedDelim: makeCustomSizedDelim,
    leftRightDelim: makeLeftRightDelim
  };
  var delimiterSizes = {
    "\\bigl": {
      mclass: "mopen",
      size: 1
    },
    "\\Bigl": {
      mclass: "mopen",
      size: 2
    },
    "\\biggl": {
      mclass: "mopen",
      size: 3
    },
    "\\Biggl": {
      mclass: "mopen",
      size: 4
    },
    "\\bigr": {
      mclass: "mclose",
      size: 1
    },
    "\\Bigr": {
      mclass: "mclose",
      size: 2
    },
    "\\biggr": {
      mclass: "mclose",
      size: 3
    },
    "\\Biggr": {
      mclass: "mclose",
      size: 4
    },
    "\\bigm": {
      mclass: "mrel",
      size: 1
    },
    "\\Bigm": {
      mclass: "mrel",
      size: 2
    },
    "\\biggm": {
      mclass: "mrel",
      size: 3
    },
    "\\Biggm": {
      mclass: "mrel",
      size: 4
    },
    "\\big": {
      mclass: "mord",
      size: 1
    },
    "\\Big": {
      mclass: "mord",
      size: 2
    },
    "\\bigg": {
      mclass: "mord",
      size: 3
    },
    "\\Bigg": {
      mclass: "mord",
      size: 4
    }
  };
  var delimiters = ["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "\u230A", "\u230B", "\\lceil", "\\rceil", "\u2308", "\u2309", "<", ">", "\\langle", "\u27E8", "\\rangle", "\u27E9", "\\lt", "\\gt", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "\u27EE", "\u27EF", "\\lmoustache", "\\rmoustache", "\u23B0", "\u23B1", "/", "\\backslash", "|", "\\vert", "\\|", "\\Vert", "\\uparrow", "\\Uparrow", "\\downarrow", "\\Downarrow", "\\updownarrow", "\\Updownarrow", "."];
  function checkDelimiter(delim, context) {
    var symDelim = checkSymbolNodeType(delim);
    if (symDelim && delimiters.includes(symDelim.text)) {
      return symDelim;
    } else if (symDelim) {
      throw new ParseError("Invalid delimiter '" + symDelim.text + "' after '" + context.funcName + "'", delim);
    } else {
      throw new ParseError("Invalid delimiter type '" + delim.type + "'", delim);
    }
  }
  defineFunction({
    type: "delimsizing",
    names: ["\\bigl", "\\Bigl", "\\biggl", "\\Biggl", "\\bigr", "\\Bigr", "\\biggr", "\\Biggr", "\\bigm", "\\Bigm", "\\biggm", "\\Biggm", "\\big", "\\Big", "\\bigg", "\\Bigg"],
    props: {
      numArgs: 1,
      argTypes: ["primitive"]
    },
    handler: (context, args) => {
      var delim = checkDelimiter(args[0], context);
      return {
        type: "delimsizing",
        mode: context.parser.mode,
        size: delimiterSizes[context.funcName].size,
        mclass: delimiterSizes[context.funcName].mclass,
        delim: delim.text
      };
    },
    htmlBuilder: (group, options) => {
      if (group.delim === ".") {
        return buildCommon.makeSpan([group.mclass]);
      }
      return delimiter.sizedDelim(group.delim, group.size, options, group.mode, [group.mclass]);
    },
    mathmlBuilder: (group) => {
      var children = [];
      if (group.delim !== ".") {
        children.push(makeText(group.delim, group.mode));
      }
      var node = new mathMLTree.MathNode("mo", children);
      if (group.mclass === "mopen" || group.mclass === "mclose") {
        node.setAttribute("fence", "true");
      } else {
        node.setAttribute("fence", "false");
      }
      node.setAttribute("stretchy", "true");
      var size = makeEm(delimiter.sizeToMaxHeight[group.size]);
      node.setAttribute("minsize", size);
      node.setAttribute("maxsize", size);
      return node;
    }
  });
  function assertParsed(group) {
    if (!group.body) {
      throw new Error("Bug: The leftright ParseNode wasn't fully parsed.");
    }
  }
  defineFunction({
    type: "leftright-right",
    names: ["\\right"],
    props: {
      numArgs: 1,
      primitive: true
    },
    handler: (context, args) => {
      var color = context.parser.gullet.macros.get("\\current@color");
      if (color && typeof color !== "string") {
        throw new ParseError("\\current@color set to non-string in \\right");
      }
      return {
        type: "leftright-right",
        mode: context.parser.mode,
        delim: checkDelimiter(args[0], context).text,
        color
        // undefined if not set via \color
      };
    }
  });
  defineFunction({
    type: "leftright",
    names: ["\\left"],
    props: {
      numArgs: 1,
      primitive: true
    },
    handler: (context, args) => {
      var delim = checkDelimiter(args[0], context);
      var parser = context.parser;
      ++parser.leftrightDepth;
      var body3 = parser.parseExpression(false);
      --parser.leftrightDepth;
      parser.expect("\\right", false);
      var right = assertNodeType(parser.parseFunction(), "leftright-right");
      return {
        type: "leftright",
        mode: parser.mode,
        body: body3,
        left: delim.text,
        right: right.delim,
        rightColor: right.color
      };
    },
    htmlBuilder: (group, options) => {
      assertParsed(group);
      var inner2 = buildExpression$1(group.body, options, true, ["mopen", "mclose"]);
      var innerHeight = 0;
      var innerDepth = 0;
      var hadMiddle = false;
      for (var i2 = 0; i2 < inner2.length; i2++) {
        if (inner2[i2].isMiddle) {
          hadMiddle = true;
        } else {
          innerHeight = Math.max(inner2[i2].height, innerHeight);
          innerDepth = Math.max(inner2[i2].depth, innerDepth);
        }
      }
      innerHeight *= options.sizeMultiplier;
      innerDepth *= options.sizeMultiplier;
      var leftDelim;
      if (group.left === ".") {
        leftDelim = makeNullDelimiter(options, ["mopen"]);
      } else {
        leftDelim = delimiter.leftRightDelim(group.left, innerHeight, innerDepth, options, group.mode, ["mopen"]);
      }
      inner2.unshift(leftDelim);
      if (hadMiddle) {
        for (var _i = 1; _i < inner2.length; _i++) {
          var middleDelim = inner2[_i];
          var isMiddle = middleDelim.isMiddle;
          if (isMiddle) {
            inner2[_i] = delimiter.leftRightDelim(isMiddle.delim, innerHeight, innerDepth, isMiddle.options, group.mode, []);
          }
        }
      }
      var rightDelim;
      if (group.right === ".") {
        rightDelim = makeNullDelimiter(options, ["mclose"]);
      } else {
        var colorOptions = group.rightColor ? options.withColor(group.rightColor) : options;
        rightDelim = delimiter.leftRightDelim(group.right, innerHeight, innerDepth, colorOptions, group.mode, ["mclose"]);
      }
      inner2.push(rightDelim);
      return buildCommon.makeSpan(["minner"], inner2, options);
    },
    mathmlBuilder: (group, options) => {
      assertParsed(group);
      var inner2 = buildExpression2(group.body, options);
      if (group.left !== ".") {
        var leftNode = new mathMLTree.MathNode("mo", [makeText(group.left, group.mode)]);
        leftNode.setAttribute("fence", "true");
        inner2.unshift(leftNode);
      }
      if (group.right !== ".") {
        var rightNode = new mathMLTree.MathNode("mo", [makeText(group.right, group.mode)]);
        rightNode.setAttribute("fence", "true");
        if (group.rightColor) {
          rightNode.setAttribute("mathcolor", group.rightColor);
        }
        inner2.push(rightNode);
      }
      return makeRow(inner2);
    }
  });
  defineFunction({
    type: "middle",
    names: ["\\middle"],
    props: {
      numArgs: 1,
      primitive: true
    },
    handler: (context, args) => {
      var delim = checkDelimiter(args[0], context);
      if (!context.parser.leftrightDepth) {
        throw new ParseError("\\middle without preceding \\left", delim);
      }
      return {
        type: "middle",
        mode: context.parser.mode,
        delim: delim.text
      };
    },
    htmlBuilder: (group, options) => {
      var middleDelim;
      if (group.delim === ".") {
        middleDelim = makeNullDelimiter(options, []);
      } else {
        middleDelim = delimiter.sizedDelim(group.delim, 1, options, group.mode, []);
        var isMiddle = {
          delim: group.delim,
          options
        };
        middleDelim.isMiddle = isMiddle;
      }
      return middleDelim;
    },
    mathmlBuilder: (group, options) => {
      var textNode = group.delim === "\\vert" || group.delim === "|" ? makeText("|", "text") : makeText(group.delim, group.mode);
      var middleNode = new mathMLTree.MathNode("mo", [textNode]);
      middleNode.setAttribute("fence", "true");
      middleNode.setAttribute("lspace", "0.05em");
      middleNode.setAttribute("rspace", "0.05em");
      return middleNode;
    }
  });
  var htmlBuilder$7 = (group, options) => {
    var inner2 = buildCommon.wrapFragment(buildGroup$1(group.body, options), options);
    var label = group.label.slice(1);
    var scale = options.sizeMultiplier;
    var img;
    var imgShift = 0;
    var isSingleChar = utils.isCharacterBox(group.body);
    if (label === "sout") {
      img = buildCommon.makeSpan(["stretchy", "sout"]);
      img.height = options.fontMetrics().defaultRuleThickness / scale;
      imgShift = -0.5 * options.fontMetrics().xHeight;
    } else if (label === "phase") {
      var lineWeight = calculateSize({
        number: 0.6,
        unit: "pt"
      }, options);
      var clearance = calculateSize({
        number: 0.35,
        unit: "ex"
      }, options);
      var newOptions = options.havingBaseSizing();
      scale = scale / newOptions.sizeMultiplier;
      var angleHeight = inner2.height + inner2.depth + lineWeight + clearance;
      inner2.style.paddingLeft = makeEm(angleHeight / 2 + lineWeight);
      var viewBoxHeight = Math.floor(1e3 * angleHeight * scale);
      var path2 = phasePath(viewBoxHeight);
      var svgNode = new SvgNode([new PathNode("phase", path2)], {
        "width": "400em",
        "height": makeEm(viewBoxHeight / 1e3),
        "viewBox": "0 0 400000 " + viewBoxHeight,
        "preserveAspectRatio": "xMinYMin slice"
      });
      img = buildCommon.makeSvgSpan(["hide-tail"], [svgNode], options);
      img.style.height = makeEm(angleHeight);
      imgShift = inner2.depth + lineWeight + clearance;
    } else {
      if (/cancel/.test(label)) {
        if (!isSingleChar) {
          inner2.classes.push("cancel-pad");
        }
      } else if (label === "angl") {
        inner2.classes.push("anglpad");
      } else {
        inner2.classes.push("boxpad");
      }
      var topPad = 0;
      var bottomPad = 0;
      var ruleThickness = 0;
      if (/box/.test(label)) {
        ruleThickness = Math.max(
          options.fontMetrics().fboxrule,
          // default
          options.minRuleThickness
          // User override.
        );
        topPad = options.fontMetrics().fboxsep + (label === "colorbox" ? 0 : ruleThickness);
        bottomPad = topPad;
      } else if (label === "angl") {
        ruleThickness = Math.max(options.fontMetrics().defaultRuleThickness, options.minRuleThickness);
        topPad = 4 * ruleThickness;
        bottomPad = Math.max(0, 0.25 - inner2.depth);
      } else {
        topPad = isSingleChar ? 0.2 : 0;
        bottomPad = topPad;
      }
      img = stretchy.encloseSpan(inner2, label, topPad, bottomPad, options);
      if (/fbox|boxed|fcolorbox/.test(label)) {
        img.style.borderStyle = "solid";
        img.style.borderWidth = makeEm(ruleThickness);
      } else if (label === "angl" && ruleThickness !== 0.049) {
        img.style.borderTopWidth = makeEm(ruleThickness);
        img.style.borderRightWidth = makeEm(ruleThickness);
      }
      imgShift = inner2.depth + bottomPad;
      if (group.backgroundColor) {
        img.style.backgroundColor = group.backgroundColor;
        if (group.borderColor) {
          img.style.borderColor = group.borderColor;
        }
      }
    }
    var vlist;
    if (group.backgroundColor) {
      vlist = buildCommon.makeVList({
        positionType: "individualShift",
        children: [
          // Put the color background behind inner;
          {
            type: "elem",
            elem: img,
            shift: imgShift
          },
          {
            type: "elem",
            elem: inner2,
            shift: 0
          }
        ]
      }, options);
    } else {
      var classes = /cancel|phase/.test(label) ? ["svg-align"] : [];
      vlist = buildCommon.makeVList({
        positionType: "individualShift",
        children: [
          // Write the \cancel stroke on top of inner.
          {
            type: "elem",
            elem: inner2,
            shift: 0
          },
          {
            type: "elem",
            elem: img,
            shift: imgShift,
            wrapperClasses: classes
          }
        ]
      }, options);
    }
    if (/cancel/.test(label)) {
      vlist.height = inner2.height;
      vlist.depth = inner2.depth;
    }
    if (/cancel/.test(label) && !isSingleChar) {
      return buildCommon.makeSpan(["mord", "cancel-lap"], [vlist], options);
    } else {
      return buildCommon.makeSpan(["mord"], [vlist], options);
    }
  };
  var mathmlBuilder$6 = (group, options) => {
    var fboxsep = 0;
    var node = new mathMLTree.MathNode(group.label.indexOf("colorbox") > -1 ? "mpadded" : "menclose", [buildGroup2(group.body, options)]);
    switch (group.label) {
      case "\\cancel":
        node.setAttribute("notation", "updiagonalstrike");
        break;
      case "\\bcancel":
        node.setAttribute("notation", "downdiagonalstrike");
        break;
      case "\\phase":
        node.setAttribute("notation", "phasorangle");
        break;
      case "\\sout":
        node.setAttribute("notation", "horizontalstrike");
        break;
      case "\\fbox":
        node.setAttribute("notation", "box");
        break;
      case "\\angl":
        node.setAttribute("notation", "actuarial");
        break;
      case "\\fcolorbox":
      case "\\colorbox":
        fboxsep = options.fontMetrics().fboxsep * options.fontMetrics().ptPerEm;
        node.setAttribute("width", "+" + 2 * fboxsep + "pt");
        node.setAttribute("height", "+" + 2 * fboxsep + "pt");
        node.setAttribute("lspace", fboxsep + "pt");
        node.setAttribute("voffset", fboxsep + "pt");
        if (group.label === "\\fcolorbox") {
          var thk = Math.max(
            options.fontMetrics().fboxrule,
            // default
            options.minRuleThickness
            // user override
          );
          node.setAttribute("style", "border: " + thk + "em solid " + String(group.borderColor));
        }
        break;
      case "\\xcancel":
        node.setAttribute("notation", "updiagonalstrike downdiagonalstrike");
        break;
    }
    if (group.backgroundColor) {
      node.setAttribute("mathbackground", group.backgroundColor);
    }
    return node;
  };
  defineFunction({
    type: "enclose",
    names: ["\\colorbox"],
    props: {
      numArgs: 2,
      allowedInText: true,
      argTypes: ["color", "text"]
    },
    handler(_ref, args, optArgs) {
      var {
        parser,
        funcName
      } = _ref;
      var color = assertNodeType(args[0], "color-token").color;
      var body3 = args[1];
      return {
        type: "enclose",
        mode: parser.mode,
        label: funcName,
        backgroundColor: color,
        body: body3
      };
    },
    htmlBuilder: htmlBuilder$7,
    mathmlBuilder: mathmlBuilder$6
  });
  defineFunction({
    type: "enclose",
    names: ["\\fcolorbox"],
    props: {
      numArgs: 3,
      allowedInText: true,
      argTypes: ["color", "color", "text"]
    },
    handler(_ref2, args, optArgs) {
      var {
        parser,
        funcName
      } = _ref2;
      var borderColor = assertNodeType(args[0], "color-token").color;
      var backgroundColor = assertNodeType(args[1], "color-token").color;
      var body3 = args[2];
      return {
        type: "enclose",
        mode: parser.mode,
        label: funcName,
        backgroundColor,
        borderColor,
        body: body3
      };
    },
    htmlBuilder: htmlBuilder$7,
    mathmlBuilder: mathmlBuilder$6
  });
  defineFunction({
    type: "enclose",
    names: ["\\fbox"],
    props: {
      numArgs: 1,
      argTypes: ["hbox"],
      allowedInText: true
    },
    handler(_ref3, args) {
      var {
        parser
      } = _ref3;
      return {
        type: "enclose",
        mode: parser.mode,
        label: "\\fbox",
        body: args[0]
      };
    }
  });
  defineFunction({
    type: "enclose",
    names: ["\\cancel", "\\bcancel", "\\xcancel", "\\sout", "\\phase"],
    props: {
      numArgs: 1
    },
    handler(_ref4, args) {
      var {
        parser,
        funcName
      } = _ref4;
      var body3 = args[0];
      return {
        type: "enclose",
        mode: parser.mode,
        label: funcName,
        body: body3
      };
    },
    htmlBuilder: htmlBuilder$7,
    mathmlBuilder: mathmlBuilder$6
  });
  defineFunction({
    type: "enclose",
    names: ["\\angl"],
    props: {
      numArgs: 1,
      argTypes: ["hbox"],
      allowedInText: false
    },
    handler(_ref5, args) {
      var {
        parser
      } = _ref5;
      return {
        type: "enclose",
        mode: parser.mode,
        label: "\\angl",
        body: args[0]
      };
    }
  });
  var _environments = {};
  function defineEnvironment(_ref) {
    var {
      type,
      names,
      props,
      handler,
      htmlBuilder: htmlBuilder3,
      mathmlBuilder: mathmlBuilder3
    } = _ref;
    var data = {
      type,
      numArgs: props.numArgs || 0,
      allowedInText: false,
      numOptionalArgs: 0,
      handler
    };
    for (var i2 = 0; i2 < names.length; ++i2) {
      _environments[names[i2]] = data;
    }
    if (htmlBuilder3) {
      _htmlGroupBuilders[type] = htmlBuilder3;
    }
    if (mathmlBuilder3) {
      _mathmlGroupBuilders[type] = mathmlBuilder3;
    }
  }
  var _macros = {};
  function defineMacro(name, body3) {
    _macros[name] = body3;
  }
  function getHLines(parser) {
    var hlineInfo = [];
    parser.consumeSpaces();
    var nxt = parser.fetch().text;
    if (nxt === "\\relax") {
      parser.consume();
      parser.consumeSpaces();
      nxt = parser.fetch().text;
    }
    while (nxt === "\\hline" || nxt === "\\hdashline") {
      parser.consume();
      hlineInfo.push(nxt === "\\hdashline");
      parser.consumeSpaces();
      nxt = parser.fetch().text;
    }
    return hlineInfo;
  }
  var validateAmsEnvironmentContext = (context) => {
    var settings = context.parser.settings;
    if (!settings.displayMode) {
      throw new ParseError("{" + context.envName + "} can be used only in display mode.");
    }
  };
  function getAutoTag(name) {
    if (name.indexOf("ed") === -1) {
      return name.indexOf("*") === -1;
    }
  }
  function parseArray(parser, _ref, style) {
    var {
      hskipBeforeAndAfter,
      addJot,
      cols,
      arraystretch,
      colSeparationType,
      autoTag,
      singleRow,
      emptySingleRow,
      maxNumCols,
      leqno
    } = _ref;
    parser.gullet.beginGroup();
    if (!singleRow) {
      parser.gullet.macros.set("\\cr", "\\\\\\relax");
    }
    if (!arraystretch) {
      var stretch = parser.gullet.expandMacroAsText("\\arraystretch");
      if (stretch == null) {
        arraystretch = 1;
      } else {
        arraystretch = parseFloat(stretch);
        if (!arraystretch || arraystretch < 0) {
          throw new ParseError("Invalid \\arraystretch: " + stretch);
        }
      }
    }
    parser.gullet.beginGroup();
    var row = [];
    var body3 = [row];
    var rowGaps = [];
    var hLinesBeforeRow = [];
    var tags = autoTag != null ? [] : void 0;
    function beginRow() {
      if (autoTag) {
        parser.gullet.macros.set("\\@eqnsw", "1", true);
      }
    }
    function endRow() {
      if (tags) {
        if (parser.gullet.macros.get("\\df@tag")) {
          tags.push(parser.subparse([new Token("\\df@tag")]));
          parser.gullet.macros.set("\\df@tag", void 0, true);
        } else {
          tags.push(Boolean(autoTag) && parser.gullet.macros.get("\\@eqnsw") === "1");
        }
      }
    }
    beginRow();
    hLinesBeforeRow.push(getHLines(parser));
    while (true) {
      var cell = parser.parseExpression(false, singleRow ? "\\end" : "\\\\");
      parser.gullet.endGroup();
      parser.gullet.beginGroup();
      cell = {
        type: "ordgroup",
        mode: parser.mode,
        body: cell
      };
      if (style) {
        cell = {
          type: "styling",
          mode: parser.mode,
          style,
          body: [cell]
        };
      }
      row.push(cell);
      var next = parser.fetch().text;
      if (next === "&") {
        if (maxNumCols && row.length === maxNumCols) {
          if (singleRow || colSeparationType) {
            throw new ParseError("Too many tab characters: &", parser.nextToken);
          } else {
            parser.settings.reportNonstrict("textEnv", "Too few columns specified in the {array} column argument.");
          }
        }
        parser.consume();
      } else if (next === "\\end") {
        endRow();
        if (row.length === 1 && cell.type === "styling" && cell.body[0].body.length === 0 && (body3.length > 1 || !emptySingleRow)) {
          body3.pop();
        }
        if (hLinesBeforeRow.length < body3.length + 1) {
          hLinesBeforeRow.push([]);
        }
        break;
      } else if (next === "\\\\") {
        parser.consume();
        var size = void 0;
        if (parser.gullet.future().text !== " ") {
          size = parser.parseSizeGroup(true);
        }
        rowGaps.push(size ? size.value : null);
        endRow();
        hLinesBeforeRow.push(getHLines(parser));
        row = [];
        body3.push(row);
        beginRow();
      } else {
        throw new ParseError("Expected & or \\\\ or \\cr or \\end", parser.nextToken);
      }
    }
    parser.gullet.endGroup();
    parser.gullet.endGroup();
    return {
      type: "array",
      mode: parser.mode,
      addJot,
      arraystretch,
      body: body3,
      cols,
      rowGaps,
      hskipBeforeAndAfter,
      hLinesBeforeRow,
      colSeparationType,
      tags,
      leqno
    };
  }
  function dCellStyle(envName) {
    if (envName.slice(0, 1) === "d") {
      return "display";
    } else {
      return "text";
    }
  }
  var htmlBuilder$6 = function htmlBuilder(group, options) {
    var r4;
    var c;
    var nr = group.body.length;
    var hLinesBeforeRow = group.hLinesBeforeRow;
    var nc = 0;
    var body3 = new Array(nr);
    var hlines = [];
    var ruleThickness = Math.max(
      // From LaTeX \showthe\arrayrulewidth. Equals 0.04 em.
      options.fontMetrics().arrayRuleWidth,
      options.minRuleThickness
      // User override.
    );
    var pt = 1 / options.fontMetrics().ptPerEm;
    var arraycolsep = 5 * pt;
    if (group.colSeparationType && group.colSeparationType === "small") {
      var localMultiplier = options.havingStyle(Style$1.SCRIPT).sizeMultiplier;
      arraycolsep = 0.2778 * (localMultiplier / options.sizeMultiplier);
    }
    var baselineskip = group.colSeparationType === "CD" ? calculateSize({
      number: 3,
      unit: "ex"
    }, options) : 12 * pt;
    var jot = 3 * pt;
    var arrayskip = group.arraystretch * baselineskip;
    var arstrutHeight = 0.7 * arrayskip;
    var arstrutDepth = 0.3 * arrayskip;
    var totalHeight = 0;
    function setHLinePos(hlinesInGap) {
      for (var i2 = 0; i2 < hlinesInGap.length; ++i2) {
        if (i2 > 0) {
          totalHeight += 0.25;
        }
        hlines.push({
          pos: totalHeight,
          isDashed: hlinesInGap[i2]
        });
      }
    }
    setHLinePos(hLinesBeforeRow[0]);
    for (r4 = 0; r4 < group.body.length; ++r4) {
      var inrow = group.body[r4];
      var height = arstrutHeight;
      var depth = arstrutDepth;
      if (nc < inrow.length) {
        nc = inrow.length;
      }
      var outrow = new Array(inrow.length);
      for (c = 0; c < inrow.length; ++c) {
        var elt = buildGroup$1(inrow[c], options);
        if (depth < elt.depth) {
          depth = elt.depth;
        }
        if (height < elt.height) {
          height = elt.height;
        }
        outrow[c] = elt;
      }
      var rowGap = group.rowGaps[r4];
      var gap = 0;
      if (rowGap) {
        gap = calculateSize(rowGap, options);
        if (gap > 0) {
          gap += arstrutDepth;
          if (depth < gap) {
            depth = gap;
          }
          gap = 0;
        }
      }
      if (group.addJot) {
        depth += jot;
      }
      outrow.height = height;
      outrow.depth = depth;
      totalHeight += height;
      outrow.pos = totalHeight;
      totalHeight += depth + gap;
      body3[r4] = outrow;
      setHLinePos(hLinesBeforeRow[r4 + 1]);
    }
    var offset = totalHeight / 2 + options.fontMetrics().axisHeight;
    var colDescriptions = group.cols || [];
    var cols = [];
    var colSep;
    var colDescrNum;
    var tagSpans = [];
    if (group.tags && group.tags.some((tag2) => tag2)) {
      for (r4 = 0; r4 < nr; ++r4) {
        var rw = body3[r4];
        var shift = rw.pos - offset;
        var tag = group.tags[r4];
        var tagSpan = void 0;
        if (tag === true) {
          tagSpan = buildCommon.makeSpan(["eqn-num"], [], options);
        } else if (tag === false) {
          tagSpan = buildCommon.makeSpan([], [], options);
        } else {
          tagSpan = buildCommon.makeSpan([], buildExpression$1(tag, options, true), options);
        }
        tagSpan.depth = rw.depth;
        tagSpan.height = rw.height;
        tagSpans.push({
          type: "elem",
          elem: tagSpan,
          shift
        });
      }
    }
    for (
      c = 0, colDescrNum = 0;
      // Continue while either there are more columns or more column
      // descriptions, so trailing separators don't get lost.
      c < nc || colDescrNum < colDescriptions.length;
      ++c, ++colDescrNum
    ) {
      var colDescr = colDescriptions[colDescrNum] || {};
      var firstSeparator = true;
      while (colDescr.type === "separator") {
        if (!firstSeparator) {
          colSep = buildCommon.makeSpan(["arraycolsep"], []);
          colSep.style.width = makeEm(options.fontMetrics().doubleRuleSep);
          cols.push(colSep);
        }
        if (colDescr.separator === "|" || colDescr.separator === ":") {
          var lineType = colDescr.separator === "|" ? "solid" : "dashed";
          var separator = buildCommon.makeSpan(["vertical-separator"], [], options);
          separator.style.height = makeEm(totalHeight);
          separator.style.borderRightWidth = makeEm(ruleThickness);
          separator.style.borderRightStyle = lineType;
          separator.style.margin = "0 " + makeEm(-ruleThickness / 2);
          var _shift = totalHeight - offset;
          if (_shift) {
            separator.style.verticalAlign = makeEm(-_shift);
          }
          cols.push(separator);
        } else {
          throw new ParseError("Invalid separator type: " + colDescr.separator);
        }
        colDescrNum++;
        colDescr = colDescriptions[colDescrNum] || {};
        firstSeparator = false;
      }
      if (c >= nc) {
        continue;
      }
      var sepwidth = void 0;
      if (c > 0 || group.hskipBeforeAndAfter) {
        sepwidth = utils.deflt(colDescr.pregap, arraycolsep);
        if (sepwidth !== 0) {
          colSep = buildCommon.makeSpan(["arraycolsep"], []);
          colSep.style.width = makeEm(sepwidth);
          cols.push(colSep);
        }
      }
      var col = [];
      for (r4 = 0; r4 < nr; ++r4) {
        var row = body3[r4];
        var elem = row[c];
        if (!elem) {
          continue;
        }
        var _shift2 = row.pos - offset;
        elem.depth = row.depth;
        elem.height = row.height;
        col.push({
          type: "elem",
          elem,
          shift: _shift2
        });
      }
      col = buildCommon.makeVList({
        positionType: "individualShift",
        children: col
      }, options);
      col = buildCommon.makeSpan(["col-align-" + (colDescr.align || "c")], [col]);
      cols.push(col);
      if (c < nc - 1 || group.hskipBeforeAndAfter) {
        sepwidth = utils.deflt(colDescr.postgap, arraycolsep);
        if (sepwidth !== 0) {
          colSep = buildCommon.makeSpan(["arraycolsep"], []);
          colSep.style.width = makeEm(sepwidth);
          cols.push(colSep);
        }
      }
    }
    body3 = buildCommon.makeSpan(["mtable"], cols);
    if (hlines.length > 0) {
      var line = buildCommon.makeLineSpan("hline", options, ruleThickness);
      var dashes = buildCommon.makeLineSpan("hdashline", options, ruleThickness);
      var vListElems = [{
        type: "elem",
        elem: body3,
        shift: 0
      }];
      while (hlines.length > 0) {
        var hline = hlines.pop();
        var lineShift = hline.pos - offset;
        if (hline.isDashed) {
          vListElems.push({
            type: "elem",
            elem: dashes,
            shift: lineShift
          });
        } else {
          vListElems.push({
            type: "elem",
            elem: line,
            shift: lineShift
          });
        }
      }
      body3 = buildCommon.makeVList({
        positionType: "individualShift",
        children: vListElems
      }, options);
    }
    if (tagSpans.length === 0) {
      return buildCommon.makeSpan(["mord"], [body3], options);
    } else {
      var eqnNumCol = buildCommon.makeVList({
        positionType: "individualShift",
        children: tagSpans
      }, options);
      eqnNumCol = buildCommon.makeSpan(["tag"], [eqnNumCol], options);
      return buildCommon.makeFragment([body3, eqnNumCol]);
    }
  };
  var alignMap = {
    c: "center ",
    l: "left ",
    r: "right "
  };
  var mathmlBuilder$5 = function mathmlBuilder(group, options) {
    var tbl = [];
    var glue = new mathMLTree.MathNode("mtd", [], ["mtr-glue"]);
    var tag = new mathMLTree.MathNode("mtd", [], ["mml-eqn-num"]);
    for (var i2 = 0; i2 < group.body.length; i2++) {
      var rw = group.body[i2];
      var row = [];
      for (var j3 = 0; j3 < rw.length; j3++) {
        row.push(new mathMLTree.MathNode("mtd", [buildGroup2(rw[j3], options)]));
      }
      if (group.tags && group.tags[i2]) {
        row.unshift(glue);
        row.push(glue);
        if (group.leqno) {
          row.unshift(tag);
        } else {
          row.push(tag);
        }
      }
      tbl.push(new mathMLTree.MathNode("mtr", row));
    }
    var table = new mathMLTree.MathNode("mtable", tbl);
    var gap = group.arraystretch === 0.5 ? 0.1 : 0.16 + group.arraystretch - 1 + (group.addJot ? 0.09 : 0);
    table.setAttribute("rowspacing", makeEm(gap));
    var menclose = "";
    var align = "";
    if (group.cols && group.cols.length > 0) {
      var cols = group.cols;
      var columnLines = "";
      var prevTypeWasAlign = false;
      var iStart = 0;
      var iEnd = cols.length;
      if (cols[0].type === "separator") {
        menclose += "top ";
        iStart = 1;
      }
      if (cols[cols.length - 1].type === "separator") {
        menclose += "bottom ";
        iEnd -= 1;
      }
      for (var _i = iStart; _i < iEnd; _i++) {
        if (cols[_i].type === "align") {
          align += alignMap[cols[_i].align];
          if (prevTypeWasAlign) {
            columnLines += "none ";
          }
          prevTypeWasAlign = true;
        } else if (cols[_i].type === "separator") {
          if (prevTypeWasAlign) {
            columnLines += cols[_i].separator === "|" ? "solid " : "dashed ";
            prevTypeWasAlign = false;
          }
        }
      }
      table.setAttribute("columnalign", align.trim());
      if (/[sd]/.test(columnLines)) {
        table.setAttribute("columnlines", columnLines.trim());
      }
    }
    if (group.colSeparationType === "align") {
      var _cols = group.cols || [];
      var spacing2 = "";
      for (var _i2 = 1; _i2 < _cols.length; _i2++) {
        spacing2 += _i2 % 2 ? "0em " : "1em ";
      }
      table.setAttribute("columnspacing", spacing2.trim());
    } else if (group.colSeparationType === "alignat" || group.colSeparationType === "gather") {
      table.setAttribute("columnspacing", "0em");
    } else if (group.colSeparationType === "small") {
      table.setAttribute("columnspacing", "0.2778em");
    } else if (group.colSeparationType === "CD") {
      table.setAttribute("columnspacing", "0.5em");
    } else {
      table.setAttribute("columnspacing", "1em");
    }
    var rowLines = "";
    var hlines = group.hLinesBeforeRow;
    menclose += hlines[0].length > 0 ? "left " : "";
    menclose += hlines[hlines.length - 1].length > 0 ? "right " : "";
    for (var _i3 = 1; _i3 < hlines.length - 1; _i3++) {
      rowLines += hlines[_i3].length === 0 ? "none " : hlines[_i3][0] ? "dashed " : "solid ";
    }
    if (/[sd]/.test(rowLines)) {
      table.setAttribute("rowlines", rowLines.trim());
    }
    if (menclose !== "") {
      table = new mathMLTree.MathNode("menclose", [table]);
      table.setAttribute("notation", menclose.trim());
    }
    if (group.arraystretch && group.arraystretch < 1) {
      table = new mathMLTree.MathNode("mstyle", [table]);
      table.setAttribute("scriptlevel", "1");
    }
    return table;
  };
  var alignedHandler = function alignedHandler2(context, args) {
    if (context.envName.indexOf("ed") === -1) {
      validateAmsEnvironmentContext(context);
    }
    var cols = [];
    var separationType = context.envName.indexOf("at") > -1 ? "alignat" : "align";
    var isSplit = context.envName === "split";
    var res = parseArray(context.parser, {
      cols,
      addJot: true,
      autoTag: isSplit ? void 0 : getAutoTag(context.envName),
      emptySingleRow: true,
      colSeparationType: separationType,
      maxNumCols: isSplit ? 2 : void 0,
      leqno: context.parser.settings.leqno
    }, "display");
    var numMaths;
    var numCols = 0;
    var emptyGroup = {
      type: "ordgroup",
      mode: context.mode,
      body: []
    };
    if (args[0] && args[0].type === "ordgroup") {
      var arg0 = "";
      for (var i2 = 0; i2 < args[0].body.length; i2++) {
        var textord2 = assertNodeType(args[0].body[i2], "textord");
        arg0 += textord2.text;
      }
      numMaths = Number(arg0);
      numCols = numMaths * 2;
    }
    var isAligned = !numCols;
    res.body.forEach(function(row) {
      for (var _i4 = 1; _i4 < row.length; _i4 += 2) {
        var styling = assertNodeType(row[_i4], "styling");
        var ordgroup = assertNodeType(styling.body[0], "ordgroup");
        ordgroup.body.unshift(emptyGroup);
      }
      if (!isAligned) {
        var curMaths = row.length / 2;
        if (numMaths < curMaths) {
          throw new ParseError("Too many math in a row: " + ("expected " + numMaths + ", but got " + curMaths), row[0]);
        }
      } else if (numCols < row.length) {
        numCols = row.length;
      }
    });
    for (var _i5 = 0; _i5 < numCols; ++_i5) {
      var align = "r";
      var pregap = 0;
      if (_i5 % 2 === 1) {
        align = "l";
      } else if (_i5 > 0 && isAligned) {
        pregap = 1;
      }
      cols[_i5] = {
        type: "align",
        align,
        pregap,
        postgap: 0
      };
    }
    res.colSeparationType = isAligned ? "align" : "alignat";
    return res;
  };
  defineEnvironment({
    type: "array",
    names: ["array", "darray"],
    props: {
      numArgs: 1
    },
    handler(context, args) {
      var symNode = checkSymbolNodeType(args[0]);
      var colalign = symNode ? [args[0]] : assertNodeType(args[0], "ordgroup").body;
      var cols = colalign.map(function(nde) {
        var node = assertSymbolNodeType(nde);
        var ca = node.text;
        if ("lcr".indexOf(ca) !== -1) {
          return {
            type: "align",
            align: ca
          };
        } else if (ca === "|") {
          return {
            type: "separator",
            separator: "|"
          };
        } else if (ca === ":") {
          return {
            type: "separator",
            separator: ":"
          };
        }
        throw new ParseError("Unknown column alignment: " + ca, nde);
      });
      var res = {
        cols,
        hskipBeforeAndAfter: true,
        // \@preamble in lttab.dtx
        maxNumCols: cols.length
      };
      return parseArray(context.parser, res, dCellStyle(context.envName));
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["matrix", "pmatrix", "bmatrix", "Bmatrix", "vmatrix", "Vmatrix", "matrix*", "pmatrix*", "bmatrix*", "Bmatrix*", "vmatrix*", "Vmatrix*"],
    props: {
      numArgs: 0
    },
    handler(context) {
      var delimiters2 = {
        "matrix": null,
        "pmatrix": ["(", ")"],
        "bmatrix": ["[", "]"],
        "Bmatrix": ["\\{", "\\}"],
        "vmatrix": ["|", "|"],
        "Vmatrix": ["\\Vert", "\\Vert"]
      }[context.envName.replace("*", "")];
      var colAlign = "c";
      var payload = {
        hskipBeforeAndAfter: false,
        cols: [{
          type: "align",
          align: colAlign
        }]
      };
      if (context.envName.charAt(context.envName.length - 1) === "*") {
        var parser = context.parser;
        parser.consumeSpaces();
        if (parser.fetch().text === "[") {
          parser.consume();
          parser.consumeSpaces();
          colAlign = parser.fetch().text;
          if ("lcr".indexOf(colAlign) === -1) {
            throw new ParseError("Expected l or c or r", parser.nextToken);
          }
          parser.consume();
          parser.consumeSpaces();
          parser.expect("]");
          parser.consume();
          payload.cols = [{
            type: "align",
            align: colAlign
          }];
        }
      }
      var res = parseArray(context.parser, payload, dCellStyle(context.envName));
      var numCols = Math.max(0, ...res.body.map((row) => row.length));
      res.cols = new Array(numCols).fill({
        type: "align",
        align: colAlign
      });
      return delimiters2 ? {
        type: "leftright",
        mode: context.mode,
        body: [res],
        left: delimiters2[0],
        right: delimiters2[1],
        rightColor: void 0
        // \right uninfluenced by \color in array
      } : res;
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["smallmatrix"],
    props: {
      numArgs: 0
    },
    handler(context) {
      var payload = {
        arraystretch: 0.5
      };
      var res = parseArray(context.parser, payload, "script");
      res.colSeparationType = "small";
      return res;
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["subarray"],
    props: {
      numArgs: 1
    },
    handler(context, args) {
      var symNode = checkSymbolNodeType(args[0]);
      var colalign = symNode ? [args[0]] : assertNodeType(args[0], "ordgroup").body;
      var cols = colalign.map(function(nde) {
        var node = assertSymbolNodeType(nde);
        var ca = node.text;
        if ("lc".indexOf(ca) !== -1) {
          return {
            type: "align",
            align: ca
          };
        }
        throw new ParseError("Unknown column alignment: " + ca, nde);
      });
      if (cols.length > 1) {
        throw new ParseError("{subarray} can contain only one column");
      }
      var res = {
        cols,
        hskipBeforeAndAfter: false,
        arraystretch: 0.5
      };
      res = parseArray(context.parser, res, "script");
      if (res.body.length > 0 && res.body[0].length > 1) {
        throw new ParseError("{subarray} can contain only one column");
      }
      return res;
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["cases", "dcases", "rcases", "drcases"],
    props: {
      numArgs: 0
    },
    handler(context) {
      var payload = {
        arraystretch: 1.2,
        cols: [{
          type: "align",
          align: "l",
          pregap: 0,
          // TODO(kevinb) get the current style.
          // For now we use the metrics for TEXT style which is what we were
          // doing before.  Before attempting to get the current style we
          // should look at TeX's behavior especially for \over and matrices.
          postgap: 1
          /* 1em quad */
        }, {
          type: "align",
          align: "l",
          pregap: 0,
          postgap: 0
        }]
      };
      var res = parseArray(context.parser, payload, dCellStyle(context.envName));
      return {
        type: "leftright",
        mode: context.mode,
        body: [res],
        left: context.envName.indexOf("r") > -1 ? "." : "\\{",
        right: context.envName.indexOf("r") > -1 ? "\\}" : ".",
        rightColor: void 0
      };
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["align", "align*", "aligned", "split"],
    props: {
      numArgs: 0
    },
    handler: alignedHandler,
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["gathered", "gather", "gather*"],
    props: {
      numArgs: 0
    },
    handler(context) {
      if (["gather", "gather*"].includes(context.envName)) {
        validateAmsEnvironmentContext(context);
      }
      var res = {
        cols: [{
          type: "align",
          align: "c"
        }],
        addJot: true,
        colSeparationType: "gather",
        autoTag: getAutoTag(context.envName),
        emptySingleRow: true,
        leqno: context.parser.settings.leqno
      };
      return parseArray(context.parser, res, "display");
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["alignat", "alignat*", "alignedat"],
    props: {
      numArgs: 1
    },
    handler: alignedHandler,
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["equation", "equation*"],
    props: {
      numArgs: 0
    },
    handler(context) {
      validateAmsEnvironmentContext(context);
      var res = {
        autoTag: getAutoTag(context.envName),
        emptySingleRow: true,
        singleRow: true,
        maxNumCols: 1,
        leqno: context.parser.settings.leqno
      };
      return parseArray(context.parser, res, "display");
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["CD"],
    props: {
      numArgs: 0
    },
    handler(context) {
      validateAmsEnvironmentContext(context);
      return parseCD(context.parser);
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineMacro("\\nonumber", "\\gdef\\@eqnsw{0}");
  defineMacro("\\notag", "\\nonumber");
  defineFunction({
    type: "text",
    // Doesn't matter what this is.
    names: ["\\hline", "\\hdashline"],
    props: {
      numArgs: 0,
      allowedInText: true,
      allowedInMath: true
    },
    handler(context, args) {
      throw new ParseError(context.funcName + " valid only within array environment");
    }
  });
  var environments = _environments;
  defineFunction({
    type: "environment",
    names: ["\\begin", "\\end"],
    props: {
      numArgs: 1,
      argTypes: ["text"]
    },
    handler(_ref, args) {
      var {
        parser,
        funcName
      } = _ref;
      var nameGroup = args[0];
      if (nameGroup.type !== "ordgroup") {
        throw new ParseError("Invalid environment name", nameGroup);
      }
      var envName = "";
      for (var i2 = 0; i2 < nameGroup.body.length; ++i2) {
        envName += assertNodeType(nameGroup.body[i2], "textord").text;
      }
      if (funcName === "\\begin") {
        if (!environments.hasOwnProperty(envName)) {
          throw new ParseError("No such environment: " + envName, nameGroup);
        }
        var env = environments[envName];
        var {
          args: _args,
          optArgs
        } = parser.parseArguments("\\begin{" + envName + "}", env);
        var context = {
          mode: parser.mode,
          envName,
          parser
        };
        var result = env.handler(context, _args, optArgs);
        parser.expect("\\end", false);
        var endNameToken = parser.nextToken;
        var end = assertNodeType(parser.parseFunction(), "environment");
        if (end.name !== envName) {
          throw new ParseError("Mismatch: \\begin{" + envName + "} matched by \\end{" + end.name + "}", endNameToken);
        }
        return result;
      }
      return {
        type: "environment",
        mode: parser.mode,
        name: envName,
        nameGroup
      };
    }
  });
  var htmlBuilder$5 = (group, options) => {
    var font = group.font;
    var newOptions = options.withFont(font);
    return buildGroup$1(group.body, newOptions);
  };
  var mathmlBuilder$4 = (group, options) => {
    var font = group.font;
    var newOptions = options.withFont(font);
    return buildGroup2(group.body, newOptions);
  };
  var fontAliases = {
    "\\Bbb": "\\mathbb",
    "\\bold": "\\mathbf",
    "\\frak": "\\mathfrak",
    "\\bm": "\\boldsymbol"
  };
  defineFunction({
    type: "font",
    names: [
      // styles, except \boldsymbol defined below
      "\\mathrm",
      "\\mathit",
      "\\mathbf",
      "\\mathnormal",
      "\\mathsfit",
      // families
      "\\mathbb",
      "\\mathcal",
      "\\mathfrak",
      "\\mathscr",
      "\\mathsf",
      "\\mathtt",
      // aliases, except \bm defined below
      "\\Bbb",
      "\\bold",
      "\\frak"
    ],
    props: {
      numArgs: 1,
      allowedInArgument: true
    },
    handler: (_ref, args) => {
      var {
        parser,
        funcName
      } = _ref;
      var body3 = normalizeArgument(args[0]);
      var func = funcName;
      if (func in fontAliases) {
        func = fontAliases[func];
      }
      return {
        type: "font",
        mode: parser.mode,
        font: func.slice(1),
        body: body3
      };
    },
    htmlBuilder: htmlBuilder$5,
    mathmlBuilder: mathmlBuilder$4
  });
  defineFunction({
    type: "mclass",
    names: ["\\boldsymbol", "\\bm"],
    props: {
      numArgs: 1
    },
    handler: (_ref2, args) => {
      var {
        parser
      } = _ref2;
      var body3 = args[0];
      var isCharacterBox3 = utils.isCharacterBox(body3);
      return {
        type: "mclass",
        mode: parser.mode,
        mclass: binrelClass(body3),
        body: [{
          type: "font",
          mode: parser.mode,
          font: "boldsymbol",
          body: body3
        }],
        isCharacterBox: isCharacterBox3
      };
    }
  });
  defineFunction({
    type: "font",
    names: ["\\rm", "\\sf", "\\tt", "\\bf", "\\it", "\\cal"],
    props: {
      numArgs: 0,
      allowedInText: true
    },
    handler: (_ref3, args) => {
      var {
        parser,
        funcName,
        breakOnTokenText
      } = _ref3;
      var {
        mode
      } = parser;
      var body3 = parser.parseExpression(true, breakOnTokenText);
      var style = "math" + funcName.slice(1);
      return {
        type: "font",
        mode,
        font: style,
        body: {
          type: "ordgroup",
          mode: parser.mode,
          body: body3
        }
      };
    },
    htmlBuilder: htmlBuilder$5,
    mathmlBuilder: mathmlBuilder$4
  });
  var adjustStyle = (size, originalStyle) => {
    var style = originalStyle;
    if (size === "display") {
      style = style.id >= Style$1.SCRIPT.id ? style.text() : Style$1.DISPLAY;
    } else if (size === "text" && style.size === Style$1.DISPLAY.size) {
      style = Style$1.TEXT;
    } else if (size === "script") {
      style = Style$1.SCRIPT;
    } else if (size === "scriptscript") {
      style = Style$1.SCRIPTSCRIPT;
    }
    return style;
  };
  var htmlBuilder$4 = (group, options) => {
    var style = adjustStyle(group.size, options.style);
    var nstyle = style.fracNum();
    var dstyle = style.fracDen();
    var newOptions;
    newOptions = options.havingStyle(nstyle);
    var numerm = buildGroup$1(group.numer, newOptions, options);
    if (group.continued) {
      var hStrut = 8.5 / options.fontMetrics().ptPerEm;
      var dStrut = 3.5 / options.fontMetrics().ptPerEm;
      numerm.height = numerm.height < hStrut ? hStrut : numerm.height;
      numerm.depth = numerm.depth < dStrut ? dStrut : numerm.depth;
    }
    newOptions = options.havingStyle(dstyle);
    var denomm = buildGroup$1(group.denom, newOptions, options);
    var rule;
    var ruleWidth;
    var ruleSpacing;
    if (group.hasBarLine) {
      if (group.barSize) {
        ruleWidth = calculateSize(group.barSize, options);
        rule = buildCommon.makeLineSpan("frac-line", options, ruleWidth);
      } else {
        rule = buildCommon.makeLineSpan("frac-line", options);
      }
      ruleWidth = rule.height;
      ruleSpacing = rule.height;
    } else {
      rule = null;
      ruleWidth = 0;
      ruleSpacing = options.fontMetrics().defaultRuleThickness;
    }
    var numShift;
    var clearance;
    var denomShift;
    if (style.size === Style$1.DISPLAY.size || group.size === "display") {
      numShift = options.fontMetrics().num1;
      if (ruleWidth > 0) {
        clearance = 3 * ruleSpacing;
      } else {
        clearance = 7 * ruleSpacing;
      }
      denomShift = options.fontMetrics().denom1;
    } else {
      if (ruleWidth > 0) {
        numShift = options.fontMetrics().num2;
        clearance = ruleSpacing;
      } else {
        numShift = options.fontMetrics().num3;
        clearance = 3 * ruleSpacing;
      }
      denomShift = options.fontMetrics().denom2;
    }
    var frac;
    if (!rule) {
      var candidateClearance = numShift - numerm.depth - (denomm.height - denomShift);
      if (candidateClearance < clearance) {
        numShift += 0.5 * (clearance - candidateClearance);
        denomShift += 0.5 * (clearance - candidateClearance);
      }
      frac = buildCommon.makeVList({
        positionType: "individualShift",
        children: [{
          type: "elem",
          elem: denomm,
          shift: denomShift
        }, {
          type: "elem",
          elem: numerm,
          shift: -numShift
        }]
      }, options);
    } else {
      var axisHeight = options.fontMetrics().axisHeight;
      if (numShift - numerm.depth - (axisHeight + 0.5 * ruleWidth) < clearance) {
        numShift += clearance - (numShift - numerm.depth - (axisHeight + 0.5 * ruleWidth));
      }
      if (axisHeight - 0.5 * ruleWidth - (denomm.height - denomShift) < clearance) {
        denomShift += clearance - (axisHeight - 0.5 * ruleWidth - (denomm.height - denomShift));
      }
      var midShift = -(axisHeight - 0.5 * ruleWidth);
      frac = buildCommon.makeVList({
        positionType: "individualShift",
        children: [{
          type: "elem",
          elem: denomm,
          shift: denomShift
        }, {
          type: "elem",
          elem: rule,
          shift: midShift
        }, {
          type: "elem",
          elem: numerm,
          shift: -numShift
        }]
      }, options);
    }
    newOptions = options.havingStyle(style);
    frac.height *= newOptions.sizeMultiplier / options.sizeMultiplier;
    frac.depth *= newOptions.sizeMultiplier / options.sizeMultiplier;
    var delimSize;
    if (style.size === Style$1.DISPLAY.size) {
      delimSize = options.fontMetrics().delim1;
    } else if (style.size === Style$1.SCRIPTSCRIPT.size) {
      delimSize = options.havingStyle(Style$1.SCRIPT).fontMetrics().delim2;
    } else {
      delimSize = options.fontMetrics().delim2;
    }
    var leftDelim;
    var rightDelim;
    if (group.leftDelim == null) {
      leftDelim = makeNullDelimiter(options, ["mopen"]);
    } else {
      leftDelim = delimiter.customSizedDelim(group.leftDelim, delimSize, true, options.havingStyle(style), group.mode, ["mopen"]);
    }
    if (group.continued) {
      rightDelim = buildCommon.makeSpan([]);
    } else if (group.rightDelim == null) {
      rightDelim = makeNullDelimiter(options, ["mclose"]);
    } else {
      rightDelim = delimiter.customSizedDelim(group.rightDelim, delimSize, true, options.havingStyle(style), group.mode, ["mclose"]);
    }
    return buildCommon.makeSpan(["mord"].concat(newOptions.sizingClasses(options)), [leftDelim, buildCommon.makeSpan(["mfrac"], [frac]), rightDelim], options);
  };
  var mathmlBuilder$3 = (group, options) => {
    var node = new mathMLTree.MathNode("mfrac", [buildGroup2(group.numer, options), buildGroup2(group.denom, options)]);
    if (!group.hasBarLine) {
      node.setAttribute("linethickness", "0px");
    } else if (group.barSize) {
      var ruleWidth = calculateSize(group.barSize, options);
      node.setAttribute("linethickness", makeEm(ruleWidth));
    }
    var style = adjustStyle(group.size, options.style);
    if (style.size !== options.style.size) {
      node = new mathMLTree.MathNode("mstyle", [node]);
      var isDisplay = style.size === Style$1.DISPLAY.size ? "true" : "false";
      node.setAttribute("displaystyle", isDisplay);
      node.setAttribute("scriptlevel", "0");
    }
    if (group.leftDelim != null || group.rightDelim != null) {
      var withDelims = [];
      if (group.leftDelim != null) {
        var leftOp = new mathMLTree.MathNode("mo", [new mathMLTree.TextNode(group.leftDelim.replace("\\", ""))]);
        leftOp.setAttribute("fence", "true");
        withDelims.push(leftOp);
      }
      withDelims.push(node);
      if (group.rightDelim != null) {
        var rightOp = new mathMLTree.MathNode("mo", [new mathMLTree.TextNode(group.rightDelim.replace("\\", ""))]);
        rightOp.setAttribute("fence", "true");
        withDelims.push(rightOp);
      }
      return makeRow(withDelims);
    }
    return node;
  };
  defineFunction({
    type: "genfrac",
    names: [
      "\\dfrac",
      "\\frac",
      "\\tfrac",
      "\\dbinom",
      "\\binom",
      "\\tbinom",
      "\\\\atopfrac",
      // can’t be entered directly
      "\\\\bracefrac",
      "\\\\brackfrac"
      // ditto
    ],
    props: {
      numArgs: 2,
      allowedInArgument: true
    },
    handler: (_ref, args) => {
      var {
        parser,
        funcName
      } = _ref;
      var numer = args[0];
      var denom = args[1];
      var hasBarLine;
      var leftDelim = null;
      var rightDelim = null;
      var size = "auto";
      switch (funcName) {
        case "\\dfrac":
        case "\\frac":
        case "\\tfrac":
          hasBarLine = true;
          break;
        case "\\\\atopfrac":
          hasBarLine = false;
          break;
        case "\\dbinom":
        case "\\binom":
        case "\\tbinom":
          hasBarLine = false;
          leftDelim = "(";
          rightDelim = ")";
          break;
        case "\\\\bracefrac":
          hasBarLine = false;
          leftDelim = "\\{";
          rightDelim = "\\}";
          break;
        case "\\\\brackfrac":
          hasBarLine = false;
          leftDelim = "[";
          rightDelim = "]";
          break;
        default:
          throw new Error("Unrecognized genfrac command");
      }
      switch (funcName) {
        case "\\dfrac":
        case "\\dbinom":
          size = "display";
          break;
        case "\\tfrac":
        case "\\tbinom":
          size = "text";
          break;
      }
      return {
        type: "genfrac",
        mode: parser.mode,
        continued: false,
        numer,
        denom,
        hasBarLine,
        leftDelim,
        rightDelim,
        size,
        barSize: null
      };
    },
    htmlBuilder: htmlBuilder$4,
    mathmlBuilder: mathmlBuilder$3
  });
  defineFunction({
    type: "genfrac",
    names: ["\\cfrac"],
    props: {
      numArgs: 2
    },
    handler: (_ref2, args) => {
      var {
        parser,
        funcName
      } = _ref2;
      var numer = args[0];
      var denom = args[1];
      return {
        type: "genfrac",
        mode: parser.mode,
        continued: true,
        numer,
        denom,
        hasBarLine: true,
        leftDelim: null,
        rightDelim: null,
        size: "display",
        barSize: null
      };
    }
  });
  defineFunction({
    type: "infix",
    names: ["\\over", "\\choose", "\\atop", "\\brace", "\\brack"],
    props: {
      numArgs: 0,
      infix: true
    },
    handler(_ref3) {
      var {
        parser,
        funcName,
        token: token2
      } = _ref3;
      var replaceWith;
      switch (funcName) {
        case "\\over":
          replaceWith = "\\frac";
          break;
        case "\\choose":
          replaceWith = "\\binom";
          break;
        case "\\atop":
          replaceWith = "\\\\atopfrac";
          break;
        case "\\brace":
          replaceWith = "\\\\bracefrac";
          break;
        case "\\brack":
          replaceWith = "\\\\brackfrac";
          break;
        default:
          throw new Error("Unrecognized infix genfrac command");
      }
      return {
        type: "infix",
        mode: parser.mode,
        replaceWith,
        token: token2
      };
    }
  });
  var stylArray = ["display", "text", "script", "scriptscript"];
  var delimFromValue = function delimFromValue2(delimString) {
    var delim = null;
    if (delimString.length > 0) {
      delim = delimString;
      delim = delim === "." ? null : delim;
    }
    return delim;
  };
  defineFunction({
    type: "genfrac",
    names: ["\\genfrac"],
    props: {
      numArgs: 6,
      allowedInArgument: true,
      argTypes: ["math", "math", "size", "text", "math", "math"]
    },
    handler(_ref4, args) {
      var {
        parser
      } = _ref4;
      var numer = args[4];
      var denom = args[5];
      var leftNode = normalizeArgument(args[0]);
      var leftDelim = leftNode.type === "atom" && leftNode.family === "open" ? delimFromValue(leftNode.text) : null;
      var rightNode = normalizeArgument(args[1]);
      var rightDelim = rightNode.type === "atom" && rightNode.family === "close" ? delimFromValue(rightNode.text) : null;
      var barNode = assertNodeType(args[2], "size");
      var hasBarLine;
      var barSize = null;
      if (barNode.isBlank) {
        hasBarLine = true;
      } else {
        barSize = barNode.value;
        hasBarLine = barSize.number > 0;
      }
      var size = "auto";
      var styl = args[3];
      if (styl.type === "ordgroup") {
        if (styl.body.length > 0) {
          var textOrd = assertNodeType(styl.body[0], "textord");
          size = stylArray[Number(textOrd.text)];
        }
      } else {
        styl = assertNodeType(styl, "textord");
        size = stylArray[Number(styl.text)];
      }
      return {
        type: "genfrac",
        mode: parser.mode,
        numer,
        denom,
        continued: false,
        hasBarLine,
        barSize,
        leftDelim,
        rightDelim,
        size
      };
    },
    htmlBuilder: htmlBuilder$4,
    mathmlBuilder: mathmlBuilder$3
  });
  defineFunction({
    type: "infix",
    names: ["\\above"],
    props: {
      numArgs: 1,
      argTypes: ["size"],
      infix: true
    },
    handler(_ref5, args) {
      var {
        parser,
        funcName,
        token: token2
      } = _ref5;
      return {
        type: "infix",
        mode: parser.mode,
        replaceWith: "\\\\abovefrac",
        size: assertNodeType(args[0], "size").value,
        token: token2
      };
    }
  });
  defineFunction({
    type: "genfrac",
    names: ["\\\\abovefrac"],
    props: {
      numArgs: 3,
      argTypes: ["math", "size", "math"]
    },
    handler: (_ref6, args) => {
      var {
        parser,
        funcName
      } = _ref6;
      var numer = args[0];
      var barSize = assert(assertNodeType(args[1], "infix").size);
      var denom = args[2];
      var hasBarLine = barSize.number > 0;
      return {
        type: "genfrac",
        mode: parser.mode,
        numer,
        denom,
        continued: false,
        hasBarLine,
        barSize,
        leftDelim: null,
        rightDelim: null,
        size: "auto"
      };
    },
    htmlBuilder: htmlBuilder$4,
    mathmlBuilder: mathmlBuilder$3
  });
  var htmlBuilder$3 = (grp, options) => {
    var style = options.style;
    var supSubGroup;
    var group;
    if (grp.type === "supsub") {
      supSubGroup = grp.sup ? buildGroup$1(grp.sup, options.havingStyle(style.sup()), options) : buildGroup$1(grp.sub, options.havingStyle(style.sub()), options);
      group = assertNodeType(grp.base, "horizBrace");
    } else {
      group = assertNodeType(grp, "horizBrace");
    }
    var body3 = buildGroup$1(group.base, options.havingBaseStyle(Style$1.DISPLAY));
    var braceBody = stretchy.svgSpan(group, options);
    var vlist;
    if (group.isOver) {
      vlist = buildCommon.makeVList({
        positionType: "firstBaseline",
        children: [{
          type: "elem",
          elem: body3
        }, {
          type: "kern",
          size: 0.1
        }, {
          type: "elem",
          elem: braceBody
        }]
      }, options);
      vlist.children[0].children[0].children[1].classes.push("svg-align");
    } else {
      vlist = buildCommon.makeVList({
        positionType: "bottom",
        positionData: body3.depth + 0.1 + braceBody.height,
        children: [{
          type: "elem",
          elem: braceBody
        }, {
          type: "kern",
          size: 0.1
        }, {
          type: "elem",
          elem: body3
        }]
      }, options);
      vlist.children[0].children[0].children[0].classes.push("svg-align");
    }
    if (supSubGroup) {
      var vSpan = buildCommon.makeSpan(["mord", group.isOver ? "mover" : "munder"], [vlist], options);
      if (group.isOver) {
        vlist = buildCommon.makeVList({
          positionType: "firstBaseline",
          children: [{
            type: "elem",
            elem: vSpan
          }, {
            type: "kern",
            size: 0.2
          }, {
            type: "elem",
            elem: supSubGroup
          }]
        }, options);
      } else {
        vlist = buildCommon.makeVList({
          positionType: "bottom",
          positionData: vSpan.depth + 0.2 + supSubGroup.height + supSubGroup.depth,
          children: [{
            type: "elem",
            elem: supSubGroup
          }, {
            type: "kern",
            size: 0.2
          }, {
            type: "elem",
            elem: vSpan
          }]
        }, options);
      }
    }
    return buildCommon.makeSpan(["mord", group.isOver ? "mover" : "munder"], [vlist], options);
  };
  var mathmlBuilder$2 = (group, options) => {
    var accentNode = stretchy.mathMLnode(group.label);
    return new mathMLTree.MathNode(group.isOver ? "mover" : "munder", [buildGroup2(group.base, options), accentNode]);
  };
  defineFunction({
    type: "horizBrace",
    names: ["\\overbrace", "\\underbrace"],
    props: {
      numArgs: 1
    },
    handler(_ref, args) {
      var {
        parser,
        funcName
      } = _ref;
      return {
        type: "horizBrace",
        mode: parser.mode,
        label: funcName,
        isOver: /^\\over/.test(funcName),
        base: args[0]
      };
    },
    htmlBuilder: htmlBuilder$3,
    mathmlBuilder: mathmlBuilder$2
  });
  defineFunction({
    type: "href",
    names: ["\\href"],
    props: {
      numArgs: 2,
      argTypes: ["url", "original"],
      allowedInText: true
    },
    handler: (_ref, args) => {
      var {
        parser
      } = _ref;
      var body3 = args[1];
      var href = assertNodeType(args[0], "url").url;
      if (!parser.settings.isTrusted({
        command: "\\href",
        url: href
      })) {
        return parser.formatUnsupportedCmd("\\href");
      }
      return {
        type: "href",
        mode: parser.mode,
        href,
        body: ordargument(body3)
      };
    },
    htmlBuilder: (group, options) => {
      var elements = buildExpression$1(group.body, options, false);
      return buildCommon.makeAnchor(group.href, [], elements, options);
    },
    mathmlBuilder: (group, options) => {
      var math2 = buildExpressionRow(group.body, options);
      if (!(math2 instanceof MathNode)) {
        math2 = new MathNode("mrow", [math2]);
      }
      math2.setAttribute("href", group.href);
      return math2;
    }
  });
  defineFunction({
    type: "href",
    names: ["\\url"],
    props: {
      numArgs: 1,
      argTypes: ["url"],
      allowedInText: true
    },
    handler: (_ref2, args) => {
      var {
        parser
      } = _ref2;
      var href = assertNodeType(args[0], "url").url;
      if (!parser.settings.isTrusted({
        command: "\\url",
        url: href
      })) {
        return parser.formatUnsupportedCmd("\\url");
      }
      var chars = [];
      for (var i2 = 0; i2 < href.length; i2++) {
        var c = href[i2];
        if (c === "~") {
          c = "\\textasciitilde";
        }
        chars.push({
          type: "textord",
          mode: "text",
          text: c
        });
      }
      var body3 = {
        type: "text",
        mode: parser.mode,
        font: "\\texttt",
        body: chars
      };
      return {
        type: "href",
        mode: parser.mode,
        href,
        body: ordargument(body3)
      };
    }
  });
  defineFunction({
    type: "hbox",
    names: ["\\hbox"],
    props: {
      numArgs: 1,
      argTypes: ["text"],
      allowedInText: true,
      primitive: true
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      return {
        type: "hbox",
        mode: parser.mode,
        body: ordargument(args[0])
      };
    },
    htmlBuilder(group, options) {
      var elements = buildExpression$1(group.body, options, false);
      return buildCommon.makeFragment(elements);
    },
    mathmlBuilder(group, options) {
      return new mathMLTree.MathNode("mrow", buildExpression2(group.body, options));
    }
  });
  defineFunction({
    type: "html",
    names: ["\\htmlClass", "\\htmlId", "\\htmlStyle", "\\htmlData"],
    props: {
      numArgs: 2,
      argTypes: ["raw", "original"],
      allowedInText: true
    },
    handler: (_ref, args) => {
      var {
        parser,
        funcName,
        token: token2
      } = _ref;
      var value = assertNodeType(args[0], "raw").string;
      var body3 = args[1];
      if (parser.settings.strict) {
        parser.settings.reportNonstrict("htmlExtension", "HTML extension is disabled on strict mode");
      }
      var trustContext;
      var attributes = {};
      switch (funcName) {
        case "\\htmlClass":
          attributes.class = value;
          trustContext = {
            command: "\\htmlClass",
            class: value
          };
          break;
        case "\\htmlId":
          attributes.id = value;
          trustContext = {
            command: "\\htmlId",
            id: value
          };
          break;
        case "\\htmlStyle":
          attributes.style = value;
          trustContext = {
            command: "\\htmlStyle",
            style: value
          };
          break;
        case "\\htmlData": {
          var data = value.split(",");
          for (var i2 = 0; i2 < data.length; i2++) {
            var item = data[i2];
            var firstEquals = item.indexOf("=");
            if (firstEquals < 0) {
              throw new ParseError("\\htmlData key/value '" + item + "' missing equals sign");
            }
            var key2 = item.slice(0, firstEquals);
            var _value = item.slice(firstEquals + 1);
            attributes["data-" + key2.trim()] = _value;
          }
          trustContext = {
            command: "\\htmlData",
            attributes
          };
          break;
        }
        default:
          throw new Error("Unrecognized html command");
      }
      if (!parser.settings.isTrusted(trustContext)) {
        return parser.formatUnsupportedCmd(funcName);
      }
      return {
        type: "html",
        mode: parser.mode,
        attributes,
        body: ordargument(body3)
      };
    },
    htmlBuilder: (group, options) => {
      var elements = buildExpression$1(group.body, options, false);
      var classes = ["enclosing"];
      if (group.attributes.class) {
        classes.push(...group.attributes.class.trim().split(/\s+/));
      }
      var span = buildCommon.makeSpan(classes, elements, options);
      for (var attr in group.attributes) {
        if (attr !== "class" && group.attributes.hasOwnProperty(attr)) {
          span.setAttribute(attr, group.attributes[attr]);
        }
      }
      return span;
    },
    mathmlBuilder: (group, options) => {
      return buildExpressionRow(group.body, options);
    }
  });
  defineFunction({
    type: "htmlmathml",
    names: ["\\html@mathml"],
    props: {
      numArgs: 2,
      allowedInText: true
    },
    handler: (_ref, args) => {
      var {
        parser
      } = _ref;
      return {
        type: "htmlmathml",
        mode: parser.mode,
        html: ordargument(args[0]),
        mathml: ordargument(args[1])
      };
    },
    htmlBuilder: (group, options) => {
      var elements = buildExpression$1(group.html, options, false);
      return buildCommon.makeFragment(elements);
    },
    mathmlBuilder: (group, options) => {
      return buildExpressionRow(group.mathml, options);
    }
  });
  var sizeData = function sizeData2(str) {
    if (/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(str)) {
      return {
        number: +str,
        unit: "bp"
      };
    } else {
      var match = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(str);
      if (!match) {
        throw new ParseError("Invalid size: '" + str + "' in \\includegraphics");
      }
      var data = {
        number: +(match[1] + match[2]),
        // sign + magnitude, cast to number
        unit: match[3]
      };
      if (!validUnit(data)) {
        throw new ParseError("Invalid unit: '" + data.unit + "' in \\includegraphics.");
      }
      return data;
    }
  };
  defineFunction({
    type: "includegraphics",
    names: ["\\includegraphics"],
    props: {
      numArgs: 1,
      numOptionalArgs: 1,
      argTypes: ["raw", "url"],
      allowedInText: false
    },
    handler: (_ref, args, optArgs) => {
      var {
        parser
      } = _ref;
      var width = {
        number: 0,
        unit: "em"
      };
      var height = {
        number: 0.9,
        unit: "em"
      };
      var totalheight = {
        number: 0,
        unit: "em"
      };
      var alt = "";
      if (optArgs[0]) {
        var attributeStr = assertNodeType(optArgs[0], "raw").string;
        var attributes = attributeStr.split(",");
        for (var i2 = 0; i2 < attributes.length; i2++) {
          var keyVal = attributes[i2].split("=");
          if (keyVal.length === 2) {
            var str = keyVal[1].trim();
            switch (keyVal[0].trim()) {
              case "alt":
                alt = str;
                break;
              case "width":
                width = sizeData(str);
                break;
              case "height":
                height = sizeData(str);
                break;
              case "totalheight":
                totalheight = sizeData(str);
                break;
              default:
                throw new ParseError("Invalid key: '" + keyVal[0] + "' in \\includegraphics.");
            }
          }
        }
      }
      var src = assertNodeType(args[0], "url").url;
      if (alt === "") {
        alt = src;
        alt = alt.replace(/^.*[\\/]/, "");
        alt = alt.substring(0, alt.lastIndexOf("."));
      }
      if (!parser.settings.isTrusted({
        command: "\\includegraphics",
        url: src
      })) {
        return parser.formatUnsupportedCmd("\\includegraphics");
      }
      return {
        type: "includegraphics",
        mode: parser.mode,
        alt,
        width,
        height,
        totalheight,
        src
      };
    },
    htmlBuilder: (group, options) => {
      var height = calculateSize(group.height, options);
      var depth = 0;
      if (group.totalheight.number > 0) {
        depth = calculateSize(group.totalheight, options) - height;
      }
      var width = 0;
      if (group.width.number > 0) {
        width = calculateSize(group.width, options);
      }
      var style = {
        height: makeEm(height + depth)
      };
      if (width > 0) {
        style.width = makeEm(width);
      }
      if (depth > 0) {
        style.verticalAlign = makeEm(-depth);
      }
      var node = new Img(group.src, group.alt, style);
      node.height = height;
      node.depth = depth;
      return node;
    },
    mathmlBuilder: (group, options) => {
      var node = new mathMLTree.MathNode("mglyph", []);
      node.setAttribute("alt", group.alt);
      var height = calculateSize(group.height, options);
      var depth = 0;
      if (group.totalheight.number > 0) {
        depth = calculateSize(group.totalheight, options) - height;
        node.setAttribute("valign", makeEm(-depth));
      }
      node.setAttribute("height", makeEm(height + depth));
      if (group.width.number > 0) {
        var width = calculateSize(group.width, options);
        node.setAttribute("width", makeEm(width));
      }
      node.setAttribute("src", group.src);
      return node;
    }
  });
  defineFunction({
    type: "kern",
    names: ["\\kern", "\\mkern", "\\hskip", "\\mskip"],
    props: {
      numArgs: 1,
      argTypes: ["size"],
      primitive: true,
      allowedInText: true
    },
    handler(_ref, args) {
      var {
        parser,
        funcName
      } = _ref;
      var size = assertNodeType(args[0], "size");
      if (parser.settings.strict) {
        var mathFunction = funcName[1] === "m";
        var muUnit = size.value.unit === "mu";
        if (mathFunction) {
          if (!muUnit) {
            parser.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + funcName + " supports only mu units, " + ("not " + size.value.unit + " units"));
          }
          if (parser.mode !== "math") {
            parser.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + funcName + " works only in math mode");
          }
        } else {
          if (muUnit) {
            parser.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + funcName + " doesn't support mu units");
          }
        }
      }
      return {
        type: "kern",
        mode: parser.mode,
        dimension: size.value
      };
    },
    htmlBuilder(group, options) {
      return buildCommon.makeGlue(group.dimension, options);
    },
    mathmlBuilder(group, options) {
      var dimension = calculateSize(group.dimension, options);
      return new mathMLTree.SpaceNode(dimension);
    }
  });
  defineFunction({
    type: "lap",
    names: ["\\mathllap", "\\mathrlap", "\\mathclap"],
    props: {
      numArgs: 1,
      allowedInText: true
    },
    handler: (_ref, args) => {
      var {
        parser,
        funcName
      } = _ref;
      var body3 = args[0];
      return {
        type: "lap",
        mode: parser.mode,
        alignment: funcName.slice(5),
        body: body3
      };
    },
    htmlBuilder: (group, options) => {
      var inner2;
      if (group.alignment === "clap") {
        inner2 = buildCommon.makeSpan([], [buildGroup$1(group.body, options)]);
        inner2 = buildCommon.makeSpan(["inner"], [inner2], options);
      } else {
        inner2 = buildCommon.makeSpan(["inner"], [buildGroup$1(group.body, options)]);
      }
      var fix = buildCommon.makeSpan(["fix"], []);
      var node = buildCommon.makeSpan([group.alignment], [inner2, fix], options);
      var strut = buildCommon.makeSpan(["strut"]);
      strut.style.height = makeEm(node.height + node.depth);
      if (node.depth) {
        strut.style.verticalAlign = makeEm(-node.depth);
      }
      node.children.unshift(strut);
      node = buildCommon.makeSpan(["thinbox"], [node], options);
      return buildCommon.makeSpan(["mord", "vbox"], [node], options);
    },
    mathmlBuilder: (group, options) => {
      var node = new mathMLTree.MathNode("mpadded", [buildGroup2(group.body, options)]);
      if (group.alignment !== "rlap") {
        var offset = group.alignment === "llap" ? "-1" : "-0.5";
        node.setAttribute("lspace", offset + "width");
      }
      node.setAttribute("width", "0px");
      return node;
    }
  });
  defineFunction({
    type: "styling",
    names: ["\\(", "$"],
    props: {
      numArgs: 0,
      allowedInText: true,
      allowedInMath: false
    },
    handler(_ref, args) {
      var {
        funcName,
        parser
      } = _ref;
      var outerMode = parser.mode;
      parser.switchMode("math");
      var close2 = funcName === "\\(" ? "\\)" : "$";
      var body3 = parser.parseExpression(false, close2);
      parser.expect(close2);
      parser.switchMode(outerMode);
      return {
        type: "styling",
        mode: parser.mode,
        style: "text",
        body: body3
      };
    }
  });
  defineFunction({
    type: "text",
    // Doesn't matter what this is.
    names: ["\\)", "\\]"],
    props: {
      numArgs: 0,
      allowedInText: true,
      allowedInMath: false
    },
    handler(context, args) {
      throw new ParseError("Mismatched " + context.funcName);
    }
  });
  var chooseMathStyle = (group, options) => {
    switch (options.style.size) {
      case Style$1.DISPLAY.size:
        return group.display;
      case Style$1.TEXT.size:
        return group.text;
      case Style$1.SCRIPT.size:
        return group.script;
      case Style$1.SCRIPTSCRIPT.size:
        return group.scriptscript;
      default:
        return group.text;
    }
  };
  defineFunction({
    type: "mathchoice",
    names: ["\\mathchoice"],
    props: {
      numArgs: 4,
      primitive: true
    },
    handler: (_ref, args) => {
      var {
        parser
      } = _ref;
      return {
        type: "mathchoice",
        mode: parser.mode,
        display: ordargument(args[0]),
        text: ordargument(args[1]),
        script: ordargument(args[2]),
        scriptscript: ordargument(args[3])
      };
    },
    htmlBuilder: (group, options) => {
      var body3 = chooseMathStyle(group, options);
      var elements = buildExpression$1(body3, options, false);
      return buildCommon.makeFragment(elements);
    },
    mathmlBuilder: (group, options) => {
      var body3 = chooseMathStyle(group, options);
      return buildExpressionRow(body3, options);
    }
  });
  var assembleSupSub = (base, supGroup, subGroup, options, style, slant, baseShift) => {
    base = buildCommon.makeSpan([], [base]);
    var subIsSingleCharacter = subGroup && utils.isCharacterBox(subGroup);
    var sub2;
    var sup2;
    if (supGroup) {
      var elem = buildGroup$1(supGroup, options.havingStyle(style.sup()), options);
      sup2 = {
        elem,
        kern: Math.max(options.fontMetrics().bigOpSpacing1, options.fontMetrics().bigOpSpacing3 - elem.depth)
      };
    }
    if (subGroup) {
      var _elem = buildGroup$1(subGroup, options.havingStyle(style.sub()), options);
      sub2 = {
        elem: _elem,
        kern: Math.max(options.fontMetrics().bigOpSpacing2, options.fontMetrics().bigOpSpacing4 - _elem.height)
      };
    }
    var finalGroup;
    if (sup2 && sub2) {
      var bottom = options.fontMetrics().bigOpSpacing5 + sub2.elem.height + sub2.elem.depth + sub2.kern + base.depth + baseShift;
      finalGroup = buildCommon.makeVList({
        positionType: "bottom",
        positionData: bottom,
        children: [{
          type: "kern",
          size: options.fontMetrics().bigOpSpacing5
        }, {
          type: "elem",
          elem: sub2.elem,
          marginLeft: makeEm(-slant)
        }, {
          type: "kern",
          size: sub2.kern
        }, {
          type: "elem",
          elem: base
        }, {
          type: "kern",
          size: sup2.kern
        }, {
          type: "elem",
          elem: sup2.elem,
          marginLeft: makeEm(slant)
        }, {
          type: "kern",
          size: options.fontMetrics().bigOpSpacing5
        }]
      }, options);
    } else if (sub2) {
      var top = base.height - baseShift;
      finalGroup = buildCommon.makeVList({
        positionType: "top",
        positionData: top,
        children: [{
          type: "kern",
          size: options.fontMetrics().bigOpSpacing5
        }, {
          type: "elem",
          elem: sub2.elem,
          marginLeft: makeEm(-slant)
        }, {
          type: "kern",
          size: sub2.kern
        }, {
          type: "elem",
          elem: base
        }]
      }, options);
    } else if (sup2) {
      var _bottom = base.depth + baseShift;
      finalGroup = buildCommon.makeVList({
        positionType: "bottom",
        positionData: _bottom,
        children: [{
          type: "elem",
          elem: base
        }, {
          type: "kern",
          size: sup2.kern
        }, {
          type: "elem",
          elem: sup2.elem,
          marginLeft: makeEm(slant)
        }, {
          type: "kern",
          size: options.fontMetrics().bigOpSpacing5
        }]
      }, options);
    } else {
      return base;
    }
    var parts = [finalGroup];
    if (sub2 && slant !== 0 && !subIsSingleCharacter) {
      var spacer = buildCommon.makeSpan(["mspace"], [], options);
      spacer.style.marginRight = makeEm(slant);
      parts.unshift(spacer);
    }
    return buildCommon.makeSpan(["mop", "op-limits"], parts, options);
  };
  var noSuccessor = ["\\smallint"];
  var htmlBuilder$2 = (grp, options) => {
    var supGroup;
    var subGroup;
    var hasLimits = false;
    var group;
    if (grp.type === "supsub") {
      supGroup = grp.sup;
      subGroup = grp.sub;
      group = assertNodeType(grp.base, "op");
      hasLimits = true;
    } else {
      group = assertNodeType(grp, "op");
    }
    var style = options.style;
    var large = false;
    if (style.size === Style$1.DISPLAY.size && group.symbol && !noSuccessor.includes(group.name)) {
      large = true;
    }
    var base;
    if (group.symbol) {
      var fontName = large ? "Size2-Regular" : "Size1-Regular";
      var stash = "";
      if (group.name === "\\oiint" || group.name === "\\oiiint") {
        stash = group.name.slice(1);
        group.name = stash === "oiint" ? "\\iint" : "\\iiint";
      }
      base = buildCommon.makeSymbol(group.name, fontName, "math", options, ["mop", "op-symbol", large ? "large-op" : "small-op"]);
      if (stash.length > 0) {
        var italic = base.italic;
        var oval = buildCommon.staticSvg(stash + "Size" + (large ? "2" : "1"), options);
        base = buildCommon.makeVList({
          positionType: "individualShift",
          children: [{
            type: "elem",
            elem: base,
            shift: 0
          }, {
            type: "elem",
            elem: oval,
            shift: large ? 0.08 : 0
          }]
        }, options);
        group.name = "\\" + stash;
        base.classes.unshift("mop");
        base.italic = italic;
      }
    } else if (group.body) {
      var inner2 = buildExpression$1(group.body, options, true);
      if (inner2.length === 1 && inner2[0] instanceof SymbolNode) {
        base = inner2[0];
        base.classes[0] = "mop";
      } else {
        base = buildCommon.makeSpan(["mop"], inner2, options);
      }
    } else {
      var output = [];
      for (var i2 = 1; i2 < group.name.length; i2++) {
        output.push(buildCommon.mathsym(group.name[i2], group.mode, options));
      }
      base = buildCommon.makeSpan(["mop"], output, options);
    }
    var baseShift = 0;
    var slant = 0;
    if ((base instanceof SymbolNode || group.name === "\\oiint" || group.name === "\\oiiint") && !group.suppressBaseShift) {
      baseShift = (base.height - base.depth) / 2 - options.fontMetrics().axisHeight;
      slant = base.italic;
    }
    if (hasLimits) {
      return assembleSupSub(base, supGroup, subGroup, options, style, slant, baseShift);
    } else {
      if (baseShift) {
        base.style.position = "relative";
        base.style.top = makeEm(baseShift);
      }
      return base;
    }
  };
  var mathmlBuilder$1 = (group, options) => {
    var node;
    if (group.symbol) {
      node = new MathNode("mo", [makeText(group.name, group.mode)]);
      if (noSuccessor.includes(group.name)) {
        node.setAttribute("largeop", "false");
      }
    } else if (group.body) {
      node = new MathNode("mo", buildExpression2(group.body, options));
    } else {
      node = new MathNode("mi", [new TextNode(group.name.slice(1))]);
      var operator = new MathNode("mo", [makeText("\u2061", "text")]);
      if (group.parentIsSupSub) {
        node = new MathNode("mrow", [node, operator]);
      } else {
        node = newDocumentFragment([node, operator]);
      }
    }
    return node;
  };
  var singleCharBigOps = {
    "\u220F": "\\prod",
    "\u2210": "\\coprod",
    "\u2211": "\\sum",
    "\u22C0": "\\bigwedge",
    "\u22C1": "\\bigvee",
    "\u22C2": "\\bigcap",
    "\u22C3": "\\bigcup",
    "\u2A00": "\\bigodot",
    "\u2A01": "\\bigoplus",
    "\u2A02": "\\bigotimes",
    "\u2A04": "\\biguplus",
    "\u2A06": "\\bigsqcup"
  };
  defineFunction({
    type: "op",
    names: ["\\coprod", "\\bigvee", "\\bigwedge", "\\biguplus", "\\bigcap", "\\bigcup", "\\intop", "\\prod", "\\sum", "\\bigotimes", "\\bigoplus", "\\bigodot", "\\bigsqcup", "\\smallint", "\u220F", "\u2210", "\u2211", "\u22C0", "\u22C1", "\u22C2", "\u22C3", "\u2A00", "\u2A01", "\u2A02", "\u2A04", "\u2A06"],
    props: {
      numArgs: 0
    },
    handler: (_ref, args) => {
      var {
        parser,
        funcName
      } = _ref;
      var fName = funcName;
      if (fName.length === 1) {
        fName = singleCharBigOps[fName];
      }
      return {
        type: "op",
        mode: parser.mode,
        limits: true,
        parentIsSupSub: false,
        symbol: true,
        name: fName
      };
    },
    htmlBuilder: htmlBuilder$2,
    mathmlBuilder: mathmlBuilder$1
  });
  defineFunction({
    type: "op",
    names: ["\\mathop"],
    props: {
      numArgs: 1,
      primitive: true
    },
    handler: (_ref2, args) => {
      var {
        parser
      } = _ref2;
      var body3 = args[0];
      return {
        type: "op",
        mode: parser.mode,
        limits: false,
        parentIsSupSub: false,
        symbol: false,
        body: ordargument(body3)
      };
    },
    htmlBuilder: htmlBuilder$2,
    mathmlBuilder: mathmlBuilder$1
  });
  var singleCharIntegrals = {
    "\u222B": "\\int",
    "\u222C": "\\iint",
    "\u222D": "\\iiint",
    "\u222E": "\\oint",
    "\u222F": "\\oiint",
    "\u2230": "\\oiiint"
  };
  defineFunction({
    type: "op",
    names: ["\\arcsin", "\\arccos", "\\arctan", "\\arctg", "\\arcctg", "\\arg", "\\ch", "\\cos", "\\cosec", "\\cosh", "\\cot", "\\cotg", "\\coth", "\\csc", "\\ctg", "\\cth", "\\deg", "\\dim", "\\exp", "\\hom", "\\ker", "\\lg", "\\ln", "\\log", "\\sec", "\\sin", "\\sinh", "\\sh", "\\tan", "\\tanh", "\\tg", "\\th"],
    props: {
      numArgs: 0
    },
    handler(_ref3) {
      var {
        parser,
        funcName
      } = _ref3;
      return {
        type: "op",
        mode: parser.mode,
        limits: false,
        parentIsSupSub: false,
        symbol: false,
        name: funcName
      };
    },
    htmlBuilder: htmlBuilder$2,
    mathmlBuilder: mathmlBuilder$1
  });
  defineFunction({
    type: "op",
    names: ["\\det", "\\gcd", "\\inf", "\\lim", "\\max", "\\min", "\\Pr", "\\sup"],
    props: {
      numArgs: 0
    },
    handler(_ref4) {
      var {
        parser,
        funcName
      } = _ref4;
      return {
        type: "op",
        mode: parser.mode,
        limits: true,
        parentIsSupSub: false,
        symbol: false,
        name: funcName
      };
    },
    htmlBuilder: htmlBuilder$2,
    mathmlBuilder: mathmlBuilder$1
  });
  defineFunction({
    type: "op",
    names: ["\\int", "\\iint", "\\iiint", "\\oint", "\\oiint", "\\oiiint", "\u222B", "\u222C", "\u222D", "\u222E", "\u222F", "\u2230"],
    props: {
      numArgs: 0,
      allowedInArgument: true
    },
    handler(_ref5) {
      var {
        parser,
        funcName
      } = _ref5;
      var fName = funcName;
      if (fName.length === 1) {
        fName = singleCharIntegrals[fName];
      }
      return {
        type: "op",
        mode: parser.mode,
        limits: false,
        parentIsSupSub: false,
        symbol: true,
        name: fName
      };
    },
    htmlBuilder: htmlBuilder$2,
    mathmlBuilder: mathmlBuilder$1
  });
  var htmlBuilder$1 = (grp, options) => {
    var supGroup;
    var subGroup;
    var hasLimits = false;
    var group;
    if (grp.type === "supsub") {
      supGroup = grp.sup;
      subGroup = grp.sub;
      group = assertNodeType(grp.base, "operatorname");
      hasLimits = true;
    } else {
      group = assertNodeType(grp, "operatorname");
    }
    var base;
    if (group.body.length > 0) {
      var body3 = group.body.map((child2) => {
        var childText = child2.text;
        if (typeof childText === "string") {
          return {
            type: "textord",
            mode: child2.mode,
            text: childText
          };
        } else {
          return child2;
        }
      });
      var expression = buildExpression$1(body3, options.withFont("mathrm"), true);
      for (var i2 = 0; i2 < expression.length; i2++) {
        var child = expression[i2];
        if (child instanceof SymbolNode) {
          child.text = child.text.replace(/\u2212/, "-").replace(/\u2217/, "*");
        }
      }
      base = buildCommon.makeSpan(["mop"], expression, options);
    } else {
      base = buildCommon.makeSpan(["mop"], [], options);
    }
    if (hasLimits) {
      return assembleSupSub(base, supGroup, subGroup, options, options.style, 0, 0);
    } else {
      return base;
    }
  };
  var mathmlBuilder2 = (group, options) => {
    var expression = buildExpression2(group.body, options.withFont("mathrm"));
    var isAllString = true;
    for (var i2 = 0; i2 < expression.length; i2++) {
      var node = expression[i2];
      if (node instanceof mathMLTree.SpaceNode) ;
      else if (node instanceof mathMLTree.MathNode) {
        switch (node.type) {
          case "mi":
          case "mn":
          case "ms":
          case "mspace":
          case "mtext":
            break;
          // Do nothing yet.
          case "mo": {
            var child = node.children[0];
            if (node.children.length === 1 && child instanceof mathMLTree.TextNode) {
              child.text = child.text.replace(/\u2212/, "-").replace(/\u2217/, "*");
            } else {
              isAllString = false;
            }
            break;
          }
          default:
            isAllString = false;
        }
      } else {
        isAllString = false;
      }
    }
    if (isAllString) {
      var word = expression.map((node2) => node2.toText()).join("");
      expression = [new mathMLTree.TextNode(word)];
    }
    var identifier = new mathMLTree.MathNode("mi", expression);
    identifier.setAttribute("mathvariant", "normal");
    var operator = new mathMLTree.MathNode("mo", [makeText("\u2061", "text")]);
    if (group.parentIsSupSub) {
      return new mathMLTree.MathNode("mrow", [identifier, operator]);
    } else {
      return mathMLTree.newDocumentFragment([identifier, operator]);
    }
  };
  defineFunction({
    type: "operatorname",
    names: ["\\operatorname@", "\\operatornamewithlimits"],
    props: {
      numArgs: 1
    },
    handler: (_ref, args) => {
      var {
        parser,
        funcName
      } = _ref;
      var body3 = args[0];
      return {
        type: "operatorname",
        mode: parser.mode,
        body: ordargument(body3),
        alwaysHandleSupSub: funcName === "\\operatornamewithlimits",
        limits: false,
        parentIsSupSub: false
      };
    },
    htmlBuilder: htmlBuilder$1,
    mathmlBuilder: mathmlBuilder2
  });
  defineMacro("\\operatorname", "\\@ifstar\\operatornamewithlimits\\operatorname@");
  defineFunctionBuilders({
    type: "ordgroup",
    htmlBuilder(group, options) {
      if (group.semisimple) {
        return buildCommon.makeFragment(buildExpression$1(group.body, options, false));
      }
      return buildCommon.makeSpan(["mord"], buildExpression$1(group.body, options, true), options);
    },
    mathmlBuilder(group, options) {
      return buildExpressionRow(group.body, options, true);
    }
  });
  defineFunction({
    type: "overline",
    names: ["\\overline"],
    props: {
      numArgs: 1
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      var body3 = args[0];
      return {
        type: "overline",
        mode: parser.mode,
        body: body3
      };
    },
    htmlBuilder(group, options) {
      var innerGroup = buildGroup$1(group.body, options.havingCrampedStyle());
      var line = buildCommon.makeLineSpan("overline-line", options);
      var defaultRuleThickness = options.fontMetrics().defaultRuleThickness;
      var vlist = buildCommon.makeVList({
        positionType: "firstBaseline",
        children: [{
          type: "elem",
          elem: innerGroup
        }, {
          type: "kern",
          size: 3 * defaultRuleThickness
        }, {
          type: "elem",
          elem: line
        }, {
          type: "kern",
          size: defaultRuleThickness
        }]
      }, options);
      return buildCommon.makeSpan(["mord", "overline"], [vlist], options);
    },
    mathmlBuilder(group, options) {
      var operator = new mathMLTree.MathNode("mo", [new mathMLTree.TextNode("\u203E")]);
      operator.setAttribute("stretchy", "true");
      var node = new mathMLTree.MathNode("mover", [buildGroup2(group.body, options), operator]);
      node.setAttribute("accent", "true");
      return node;
    }
  });
  defineFunction({
    type: "phantom",
    names: ["\\phantom"],
    props: {
      numArgs: 1,
      allowedInText: true
    },
    handler: (_ref, args) => {
      var {
        parser
      } = _ref;
      var body3 = args[0];
      return {
        type: "phantom",
        mode: parser.mode,
        body: ordargument(body3)
      };
    },
    htmlBuilder: (group, options) => {
      var elements = buildExpression$1(group.body, options.withPhantom(), false);
      return buildCommon.makeFragment(elements);
    },
    mathmlBuilder: (group, options) => {
      var inner2 = buildExpression2(group.body, options);
      return new mathMLTree.MathNode("mphantom", inner2);
    }
  });
  defineFunction({
    type: "hphantom",
    names: ["\\hphantom"],
    props: {
      numArgs: 1,
      allowedInText: true
    },
    handler: (_ref2, args) => {
      var {
        parser
      } = _ref2;
      var body3 = args[0];
      return {
        type: "hphantom",
        mode: parser.mode,
        body: body3
      };
    },
    htmlBuilder: (group, options) => {
      var node = buildCommon.makeSpan([], [buildGroup$1(group.body, options.withPhantom())]);
      node.height = 0;
      node.depth = 0;
      if (node.children) {
        for (var i2 = 0; i2 < node.children.length; i2++) {
          node.children[i2].height = 0;
          node.children[i2].depth = 0;
        }
      }
      node = buildCommon.makeVList({
        positionType: "firstBaseline",
        children: [{
          type: "elem",
          elem: node
        }]
      }, options);
      return buildCommon.makeSpan(["mord"], [node], options);
    },
    mathmlBuilder: (group, options) => {
      var inner2 = buildExpression2(ordargument(group.body), options);
      var phantom = new mathMLTree.MathNode("mphantom", inner2);
      var node = new mathMLTree.MathNode("mpadded", [phantom]);
      node.setAttribute("height", "0px");
      node.setAttribute("depth", "0px");
      return node;
    }
  });
  defineFunction({
    type: "vphantom",
    names: ["\\vphantom"],
    props: {
      numArgs: 1,
      allowedInText: true
    },
    handler: (_ref3, args) => {
      var {
        parser
      } = _ref3;
      var body3 = args[0];
      return {
        type: "vphantom",
        mode: parser.mode,
        body: body3
      };
    },
    htmlBuilder: (group, options) => {
      var inner2 = buildCommon.makeSpan(["inner"], [buildGroup$1(group.body, options.withPhantom())]);
      var fix = buildCommon.makeSpan(["fix"], []);
      return buildCommon.makeSpan(["mord", "rlap"], [inner2, fix], options);
    },
    mathmlBuilder: (group, options) => {
      var inner2 = buildExpression2(ordargument(group.body), options);
      var phantom = new mathMLTree.MathNode("mphantom", inner2);
      var node = new mathMLTree.MathNode("mpadded", [phantom]);
      node.setAttribute("width", "0px");
      return node;
    }
  });
  defineFunction({
    type: "raisebox",
    names: ["\\raisebox"],
    props: {
      numArgs: 2,
      argTypes: ["size", "hbox"],
      allowedInText: true
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      var amount = assertNodeType(args[0], "size").value;
      var body3 = args[1];
      return {
        type: "raisebox",
        mode: parser.mode,
        dy: amount,
        body: body3
      };
    },
    htmlBuilder(group, options) {
      var body3 = buildGroup$1(group.body, options);
      var dy = calculateSize(group.dy, options);
      return buildCommon.makeVList({
        positionType: "shift",
        positionData: -dy,
        children: [{
          type: "elem",
          elem: body3
        }]
      }, options);
    },
    mathmlBuilder(group, options) {
      var node = new mathMLTree.MathNode("mpadded", [buildGroup2(group.body, options)]);
      var dy = group.dy.number + group.dy.unit;
      node.setAttribute("voffset", dy);
      return node;
    }
  });
  defineFunction({
    type: "internal",
    names: ["\\relax"],
    props: {
      numArgs: 0,
      allowedInText: true,
      allowedInArgument: true
    },
    handler(_ref) {
      var {
        parser
      } = _ref;
      return {
        type: "internal",
        mode: parser.mode
      };
    }
  });
  defineFunction({
    type: "rule",
    names: ["\\rule"],
    props: {
      numArgs: 2,
      numOptionalArgs: 1,
      allowedInText: true,
      allowedInMath: true,
      argTypes: ["size", "size", "size"]
    },
    handler(_ref, args, optArgs) {
      var {
        parser
      } = _ref;
      var shift = optArgs[0];
      var width = assertNodeType(args[0], "size");
      var height = assertNodeType(args[1], "size");
      return {
        type: "rule",
        mode: parser.mode,
        shift: shift && assertNodeType(shift, "size").value,
        width: width.value,
        height: height.value
      };
    },
    htmlBuilder(group, options) {
      var rule = buildCommon.makeSpan(["mord", "rule"], [], options);
      var width = calculateSize(group.width, options);
      var height = calculateSize(group.height, options);
      var shift = group.shift ? calculateSize(group.shift, options) : 0;
      rule.style.borderRightWidth = makeEm(width);
      rule.style.borderTopWidth = makeEm(height);
      rule.style.bottom = makeEm(shift);
      rule.width = width;
      rule.height = height + shift;
      rule.depth = -shift;
      rule.maxFontSize = height * 1.125 * options.sizeMultiplier;
      return rule;
    },
    mathmlBuilder(group, options) {
      var width = calculateSize(group.width, options);
      var height = calculateSize(group.height, options);
      var shift = group.shift ? calculateSize(group.shift, options) : 0;
      var color = options.color && options.getColor() || "black";
      var rule = new mathMLTree.MathNode("mspace");
      rule.setAttribute("mathbackground", color);
      rule.setAttribute("width", makeEm(width));
      rule.setAttribute("height", makeEm(height));
      var wrapper = new mathMLTree.MathNode("mpadded", [rule]);
      if (shift >= 0) {
        wrapper.setAttribute("height", makeEm(shift));
      } else {
        wrapper.setAttribute("height", makeEm(shift));
        wrapper.setAttribute("depth", makeEm(-shift));
      }
      wrapper.setAttribute("voffset", makeEm(shift));
      return wrapper;
    }
  });
  function sizingGroup(value, options, baseOptions) {
    var inner2 = buildExpression$1(value, options, false);
    var multiplier = options.sizeMultiplier / baseOptions.sizeMultiplier;
    for (var i2 = 0; i2 < inner2.length; i2++) {
      var pos = inner2[i2].classes.indexOf("sizing");
      if (pos < 0) {
        Array.prototype.push.apply(inner2[i2].classes, options.sizingClasses(baseOptions));
      } else if (inner2[i2].classes[pos + 1] === "reset-size" + options.size) {
        inner2[i2].classes[pos + 1] = "reset-size" + baseOptions.size;
      }
      inner2[i2].height *= multiplier;
      inner2[i2].depth *= multiplier;
    }
    return buildCommon.makeFragment(inner2);
  }
  var sizeFuncs = ["\\tiny", "\\sixptsize", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"];
  var htmlBuilder2 = (group, options) => {
    var newOptions = options.havingSize(group.size);
    return sizingGroup(group.body, newOptions, options);
  };
  defineFunction({
    type: "sizing",
    names: sizeFuncs,
    props: {
      numArgs: 0,
      allowedInText: true
    },
    handler: (_ref, args) => {
      var {
        breakOnTokenText,
        funcName,
        parser
      } = _ref;
      var body3 = parser.parseExpression(false, breakOnTokenText);
      return {
        type: "sizing",
        mode: parser.mode,
        // Figure out what size to use based on the list of functions above
        size: sizeFuncs.indexOf(funcName) + 1,
        body: body3
      };
    },
    htmlBuilder: htmlBuilder2,
    mathmlBuilder: (group, options) => {
      var newOptions = options.havingSize(group.size);
      var inner2 = buildExpression2(group.body, newOptions);
      var node = new mathMLTree.MathNode("mstyle", inner2);
      node.setAttribute("mathsize", makeEm(newOptions.sizeMultiplier));
      return node;
    }
  });
  defineFunction({
    type: "smash",
    names: ["\\smash"],
    props: {
      numArgs: 1,
      numOptionalArgs: 1,
      allowedInText: true
    },
    handler: (_ref, args, optArgs) => {
      var {
        parser
      } = _ref;
      var smashHeight = false;
      var smashDepth = false;
      var tbArg = optArgs[0] && assertNodeType(optArgs[0], "ordgroup");
      if (tbArg) {
        var letter = "";
        for (var i2 = 0; i2 < tbArg.body.length; ++i2) {
          var node = tbArg.body[i2];
          letter = node.text;
          if (letter === "t") {
            smashHeight = true;
          } else if (letter === "b") {
            smashDepth = true;
          } else {
            smashHeight = false;
            smashDepth = false;
            break;
          }
        }
      } else {
        smashHeight = true;
        smashDepth = true;
      }
      var body3 = args[0];
      return {
        type: "smash",
        mode: parser.mode,
        body: body3,
        smashHeight,
        smashDepth
      };
    },
    htmlBuilder: (group, options) => {
      var node = buildCommon.makeSpan([], [buildGroup$1(group.body, options)]);
      if (!group.smashHeight && !group.smashDepth) {
        return node;
      }
      if (group.smashHeight) {
        node.height = 0;
        if (node.children) {
          for (var i2 = 0; i2 < node.children.length; i2++) {
            node.children[i2].height = 0;
          }
        }
      }
      if (group.smashDepth) {
        node.depth = 0;
        if (node.children) {
          for (var _i = 0; _i < node.children.length; _i++) {
            node.children[_i].depth = 0;
          }
        }
      }
      var smashedNode = buildCommon.makeVList({
        positionType: "firstBaseline",
        children: [{
          type: "elem",
          elem: node
        }]
      }, options);
      return buildCommon.makeSpan(["mord"], [smashedNode], options);
    },
    mathmlBuilder: (group, options) => {
      var node = new mathMLTree.MathNode("mpadded", [buildGroup2(group.body, options)]);
      if (group.smashHeight) {
        node.setAttribute("height", "0px");
      }
      if (group.smashDepth) {
        node.setAttribute("depth", "0px");
      }
      return node;
    }
  });
  defineFunction({
    type: "sqrt",
    names: ["\\sqrt"],
    props: {
      numArgs: 1,
      numOptionalArgs: 1
    },
    handler(_ref, args, optArgs) {
      var {
        parser
      } = _ref;
      var index = optArgs[0];
      var body3 = args[0];
      return {
        type: "sqrt",
        mode: parser.mode,
        body: body3,
        index
      };
    },
    htmlBuilder(group, options) {
      var inner2 = buildGroup$1(group.body, options.havingCrampedStyle());
      if (inner2.height === 0) {
        inner2.height = options.fontMetrics().xHeight;
      }
      inner2 = buildCommon.wrapFragment(inner2, options);
      var metrics = options.fontMetrics();
      var theta = metrics.defaultRuleThickness;
      var phi = theta;
      if (options.style.id < Style$1.TEXT.id) {
        phi = options.fontMetrics().xHeight;
      }
      var lineClearance = theta + phi / 4;
      var minDelimiterHeight = inner2.height + inner2.depth + lineClearance + theta;
      var {
        span: img,
        ruleWidth,
        advanceWidth
      } = delimiter.sqrtImage(minDelimiterHeight, options);
      var delimDepth = img.height - ruleWidth;
      if (delimDepth > inner2.height + inner2.depth + lineClearance) {
        lineClearance = (lineClearance + delimDepth - inner2.height - inner2.depth) / 2;
      }
      var imgShift = img.height - inner2.height - lineClearance - ruleWidth;
      inner2.style.paddingLeft = makeEm(advanceWidth);
      var body3 = buildCommon.makeVList({
        positionType: "firstBaseline",
        children: [{
          type: "elem",
          elem: inner2,
          wrapperClasses: ["svg-align"]
        }, {
          type: "kern",
          size: -(inner2.height + imgShift)
        }, {
          type: "elem",
          elem: img
        }, {
          type: "kern",
          size: ruleWidth
        }]
      }, options);
      if (!group.index) {
        return buildCommon.makeSpan(["mord", "sqrt"], [body3], options);
      } else {
        var newOptions = options.havingStyle(Style$1.SCRIPTSCRIPT);
        var rootm = buildGroup$1(group.index, newOptions, options);
        var toShift = 0.6 * (body3.height - body3.depth);
        var rootVList = buildCommon.makeVList({
          positionType: "shift",
          positionData: -toShift,
          children: [{
            type: "elem",
            elem: rootm
          }]
        }, options);
        var rootVListWrap = buildCommon.makeSpan(["root"], [rootVList]);
        return buildCommon.makeSpan(["mord", "sqrt"], [rootVListWrap, body3], options);
      }
    },
    mathmlBuilder(group, options) {
      var {
        body: body3,
        index
      } = group;
      return index ? new mathMLTree.MathNode("mroot", [buildGroup2(body3, options), buildGroup2(index, options)]) : new mathMLTree.MathNode("msqrt", [buildGroup2(body3, options)]);
    }
  });
  var styleMap = {
    "display": Style$1.DISPLAY,
    "text": Style$1.TEXT,
    "script": Style$1.SCRIPT,
    "scriptscript": Style$1.SCRIPTSCRIPT
  };
  defineFunction({
    type: "styling",
    names: ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"],
    props: {
      numArgs: 0,
      allowedInText: true,
      primitive: true
    },
    handler(_ref, args) {
      var {
        breakOnTokenText,
        funcName,
        parser
      } = _ref;
      var body3 = parser.parseExpression(true, breakOnTokenText);
      var style = funcName.slice(1, funcName.length - 5);
      return {
        type: "styling",
        mode: parser.mode,
        // Figure out what style to use by pulling out the style from
        // the function name
        style,
        body: body3
      };
    },
    htmlBuilder(group, options) {
      var newStyle = styleMap[group.style];
      var newOptions = options.havingStyle(newStyle).withFont("");
      return sizingGroup(group.body, newOptions, options);
    },
    mathmlBuilder(group, options) {
      var newStyle = styleMap[group.style];
      var newOptions = options.havingStyle(newStyle);
      var inner2 = buildExpression2(group.body, newOptions);
      var node = new mathMLTree.MathNode("mstyle", inner2);
      var styleAttributes = {
        "display": ["0", "true"],
        "text": ["0", "false"],
        "script": ["1", "false"],
        "scriptscript": ["2", "false"]
      };
      var attr = styleAttributes[group.style];
      node.setAttribute("scriptlevel", attr[0]);
      node.setAttribute("displaystyle", attr[1]);
      return node;
    }
  });
  var htmlBuilderDelegate = function htmlBuilderDelegate2(group, options) {
    var base = group.base;
    if (!base) {
      return null;
    } else if (base.type === "op") {
      var delegate = base.limits && (options.style.size === Style$1.DISPLAY.size || base.alwaysHandleSupSub);
      return delegate ? htmlBuilder$2 : null;
    } else if (base.type === "operatorname") {
      var _delegate = base.alwaysHandleSupSub && (options.style.size === Style$1.DISPLAY.size || base.limits);
      return _delegate ? htmlBuilder$1 : null;
    } else if (base.type === "accent") {
      return utils.isCharacterBox(base.base) ? htmlBuilder$a : null;
    } else if (base.type === "horizBrace") {
      var isSup = !group.sub;
      return isSup === base.isOver ? htmlBuilder$3 : null;
    } else {
      return null;
    }
  };
  defineFunctionBuilders({
    type: "supsub",
    htmlBuilder(group, options) {
      var builderDelegate = htmlBuilderDelegate(group, options);
      if (builderDelegate) {
        return builderDelegate(group, options);
      }
      var {
        base: valueBase,
        sup: valueSup,
        sub: valueSub
      } = group;
      var base = buildGroup$1(valueBase, options);
      var supm;
      var subm;
      var metrics = options.fontMetrics();
      var supShift = 0;
      var subShift = 0;
      var isCharacterBox3 = valueBase && utils.isCharacterBox(valueBase);
      if (valueSup) {
        var newOptions = options.havingStyle(options.style.sup());
        supm = buildGroup$1(valueSup, newOptions, options);
        if (!isCharacterBox3) {
          supShift = base.height - newOptions.fontMetrics().supDrop * newOptions.sizeMultiplier / options.sizeMultiplier;
        }
      }
      if (valueSub) {
        var _newOptions = options.havingStyle(options.style.sub());
        subm = buildGroup$1(valueSub, _newOptions, options);
        if (!isCharacterBox3) {
          subShift = base.depth + _newOptions.fontMetrics().subDrop * _newOptions.sizeMultiplier / options.sizeMultiplier;
        }
      }
      var minSupShift;
      if (options.style === Style$1.DISPLAY) {
        minSupShift = metrics.sup1;
      } else if (options.style.cramped) {
        minSupShift = metrics.sup3;
      } else {
        minSupShift = metrics.sup2;
      }
      var multiplier = options.sizeMultiplier;
      var marginRight = makeEm(0.5 / metrics.ptPerEm / multiplier);
      var marginLeft = null;
      if (subm) {
        var isOiint = group.base && group.base.type === "op" && group.base.name && (group.base.name === "\\oiint" || group.base.name === "\\oiiint");
        if (base instanceof SymbolNode || isOiint) {
          marginLeft = makeEm(-base.italic);
        }
      }
      var supsub;
      if (supm && subm) {
        supShift = Math.max(supShift, minSupShift, supm.depth + 0.25 * metrics.xHeight);
        subShift = Math.max(subShift, metrics.sub2);
        var ruleWidth = metrics.defaultRuleThickness;
        var maxWidth = 4 * ruleWidth;
        if (supShift - supm.depth - (subm.height - subShift) < maxWidth) {
          subShift = maxWidth - (supShift - supm.depth) + subm.height;
          var psi = 0.8 * metrics.xHeight - (supShift - supm.depth);
          if (psi > 0) {
            supShift += psi;
            subShift -= psi;
          }
        }
        var vlistElem = [{
          type: "elem",
          elem: subm,
          shift: subShift,
          marginRight,
          marginLeft
        }, {
          type: "elem",
          elem: supm,
          shift: -supShift,
          marginRight
        }];
        supsub = buildCommon.makeVList({
          positionType: "individualShift",
          children: vlistElem
        }, options);
      } else if (subm) {
        subShift = Math.max(subShift, metrics.sub1, subm.height - 0.8 * metrics.xHeight);
        var _vlistElem = [{
          type: "elem",
          elem: subm,
          marginLeft,
          marginRight
        }];
        supsub = buildCommon.makeVList({
          positionType: "shift",
          positionData: subShift,
          children: _vlistElem
        }, options);
      } else if (supm) {
        supShift = Math.max(supShift, minSupShift, supm.depth + 0.25 * metrics.xHeight);
        supsub = buildCommon.makeVList({
          positionType: "shift",
          positionData: -supShift,
          children: [{
            type: "elem",
            elem: supm,
            marginRight
          }]
        }, options);
      } else {
        throw new Error("supsub must have either sup or sub.");
      }
      var mclass = getTypeOfDomTree(base, "right") || "mord";
      return buildCommon.makeSpan([mclass], [base, buildCommon.makeSpan(["msupsub"], [supsub])], options);
    },
    mathmlBuilder(group, options) {
      var isBrace = false;
      var isOver;
      var isSup;
      if (group.base && group.base.type === "horizBrace") {
        isSup = !!group.sup;
        if (isSup === group.base.isOver) {
          isBrace = true;
          isOver = group.base.isOver;
        }
      }
      if (group.base && (group.base.type === "op" || group.base.type === "operatorname")) {
        group.base.parentIsSupSub = true;
      }
      var children = [buildGroup2(group.base, options)];
      if (group.sub) {
        children.push(buildGroup2(group.sub, options));
      }
      if (group.sup) {
        children.push(buildGroup2(group.sup, options));
      }
      var nodeType;
      if (isBrace) {
        nodeType = isOver ? "mover" : "munder";
      } else if (!group.sub) {
        var base = group.base;
        if (base && base.type === "op" && base.limits && (options.style === Style$1.DISPLAY || base.alwaysHandleSupSub)) {
          nodeType = "mover";
        } else if (base && base.type === "operatorname" && base.alwaysHandleSupSub && (base.limits || options.style === Style$1.DISPLAY)) {
          nodeType = "mover";
        } else {
          nodeType = "msup";
        }
      } else if (!group.sup) {
        var _base = group.base;
        if (_base && _base.type === "op" && _base.limits && (options.style === Style$1.DISPLAY || _base.alwaysHandleSupSub)) {
          nodeType = "munder";
        } else if (_base && _base.type === "operatorname" && _base.alwaysHandleSupSub && (_base.limits || options.style === Style$1.DISPLAY)) {
          nodeType = "munder";
        } else {
          nodeType = "msub";
        }
      } else {
        var _base2 = group.base;
        if (_base2 && _base2.type === "op" && _base2.limits && options.style === Style$1.DISPLAY) {
          nodeType = "munderover";
        } else if (_base2 && _base2.type === "operatorname" && _base2.alwaysHandleSupSub && (options.style === Style$1.DISPLAY || _base2.limits)) {
          nodeType = "munderover";
        } else {
          nodeType = "msubsup";
        }
      }
      return new mathMLTree.MathNode(nodeType, children);
    }
  });
  defineFunctionBuilders({
    type: "atom",
    htmlBuilder(group, options) {
      return buildCommon.mathsym(group.text, group.mode, options, ["m" + group.family]);
    },
    mathmlBuilder(group, options) {
      var node = new mathMLTree.MathNode("mo", [makeText(group.text, group.mode)]);
      if (group.family === "bin") {
        var variant = getVariant(group, options);
        if (variant === "bold-italic") {
          node.setAttribute("mathvariant", variant);
        }
      } else if (group.family === "punct") {
        node.setAttribute("separator", "true");
      } else if (group.family === "open" || group.family === "close") {
        node.setAttribute("stretchy", "false");
      }
      return node;
    }
  });
  var defaultVariant = {
    "mi": "italic",
    "mn": "normal",
    "mtext": "normal"
  };
  defineFunctionBuilders({
    type: "mathord",
    htmlBuilder(group, options) {
      return buildCommon.makeOrd(group, options, "mathord");
    },
    mathmlBuilder(group, options) {
      var node = new mathMLTree.MathNode("mi", [makeText(group.text, group.mode, options)]);
      var variant = getVariant(group, options) || "italic";
      if (variant !== defaultVariant[node.type]) {
        node.setAttribute("mathvariant", variant);
      }
      return node;
    }
  });
  defineFunctionBuilders({
    type: "textord",
    htmlBuilder(group, options) {
      return buildCommon.makeOrd(group, options, "textord");
    },
    mathmlBuilder(group, options) {
      var text3 = makeText(group.text, group.mode, options);
      var variant = getVariant(group, options) || "normal";
      var node;
      if (group.mode === "text") {
        node = new mathMLTree.MathNode("mtext", [text3]);
      } else if (/[0-9]/.test(group.text)) {
        node = new mathMLTree.MathNode("mn", [text3]);
      } else if (group.text === "\\prime") {
        node = new mathMLTree.MathNode("mo", [text3]);
      } else {
        node = new mathMLTree.MathNode("mi", [text3]);
      }
      if (variant !== defaultVariant[node.type]) {
        node.setAttribute("mathvariant", variant);
      }
      return node;
    }
  });
  var cssSpace = {
    "\\nobreak": "nobreak",
    "\\allowbreak": "allowbreak"
  };
  var regularSpace = {
    " ": {},
    "\\ ": {},
    "~": {
      className: "nobreak"
    },
    "\\space": {},
    "\\nobreakspace": {
      className: "nobreak"
    }
  };
  defineFunctionBuilders({
    type: "spacing",
    htmlBuilder(group, options) {
      if (regularSpace.hasOwnProperty(group.text)) {
        var className = regularSpace[group.text].className || "";
        if (group.mode === "text") {
          var ord = buildCommon.makeOrd(group, options, "textord");
          ord.classes.push(className);
          return ord;
        } else {
          return buildCommon.makeSpan(["mspace", className], [buildCommon.mathsym(group.text, group.mode, options)], options);
        }
      } else if (cssSpace.hasOwnProperty(group.text)) {
        return buildCommon.makeSpan(["mspace", cssSpace[group.text]], [], options);
      } else {
        throw new ParseError('Unknown type of space "' + group.text + '"');
      }
    },
    mathmlBuilder(group, options) {
      var node;
      if (regularSpace.hasOwnProperty(group.text)) {
        node = new mathMLTree.MathNode("mtext", [new mathMLTree.TextNode("\xA0")]);
      } else if (cssSpace.hasOwnProperty(group.text)) {
        return new mathMLTree.MathNode("mspace");
      } else {
        throw new ParseError('Unknown type of space "' + group.text + '"');
      }
      return node;
    }
  });
  var pad = () => {
    var padNode = new mathMLTree.MathNode("mtd", []);
    padNode.setAttribute("width", "50%");
    return padNode;
  };
  defineFunctionBuilders({
    type: "tag",
    mathmlBuilder(group, options) {
      var table = new mathMLTree.MathNode("mtable", [new mathMLTree.MathNode("mtr", [pad(), new mathMLTree.MathNode("mtd", [buildExpressionRow(group.body, options)]), pad(), new mathMLTree.MathNode("mtd", [buildExpressionRow(group.tag, options)])])]);
      table.setAttribute("width", "100%");
      return table;
    }
  });
  var textFontFamilies = {
    "\\text": void 0,
    "\\textrm": "textrm",
    "\\textsf": "textsf",
    "\\texttt": "texttt",
    "\\textnormal": "textrm"
  };
  var textFontWeights = {
    "\\textbf": "textbf",
    "\\textmd": "textmd"
  };
  var textFontShapes = {
    "\\textit": "textit",
    "\\textup": "textup"
  };
  var optionsWithFont = (group, options) => {
    var font = group.font;
    if (!font) {
      return options;
    } else if (textFontFamilies[font]) {
      return options.withTextFontFamily(textFontFamilies[font]);
    } else if (textFontWeights[font]) {
      return options.withTextFontWeight(textFontWeights[font]);
    } else if (font === "\\emph") {
      return options.fontShape === "textit" ? options.withTextFontShape("textup") : options.withTextFontShape("textit");
    }
    return options.withTextFontShape(textFontShapes[font]);
  };
  defineFunction({
    type: "text",
    names: [
      // Font families
      "\\text",
      "\\textrm",
      "\\textsf",
      "\\texttt",
      "\\textnormal",
      // Font weights
      "\\textbf",
      "\\textmd",
      // Font Shapes
      "\\textit",
      "\\textup",
      "\\emph"
    ],
    props: {
      numArgs: 1,
      argTypes: ["text"],
      allowedInArgument: true,
      allowedInText: true
    },
    handler(_ref, args) {
      var {
        parser,
        funcName
      } = _ref;
      var body3 = args[0];
      return {
        type: "text",
        mode: parser.mode,
        body: ordargument(body3),
        font: funcName
      };
    },
    htmlBuilder(group, options) {
      var newOptions = optionsWithFont(group, options);
      var inner2 = buildExpression$1(group.body, newOptions, true);
      return buildCommon.makeSpan(["mord", "text"], inner2, newOptions);
    },
    mathmlBuilder(group, options) {
      var newOptions = optionsWithFont(group, options);
      return buildExpressionRow(group.body, newOptions);
    }
  });
  defineFunction({
    type: "underline",
    names: ["\\underline"],
    props: {
      numArgs: 1,
      allowedInText: true
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      return {
        type: "underline",
        mode: parser.mode,
        body: args[0]
      };
    },
    htmlBuilder(group, options) {
      var innerGroup = buildGroup$1(group.body, options);
      var line = buildCommon.makeLineSpan("underline-line", options);
      var defaultRuleThickness = options.fontMetrics().defaultRuleThickness;
      var vlist = buildCommon.makeVList({
        positionType: "top",
        positionData: innerGroup.height,
        children: [{
          type: "kern",
          size: defaultRuleThickness
        }, {
          type: "elem",
          elem: line
        }, {
          type: "kern",
          size: 3 * defaultRuleThickness
        }, {
          type: "elem",
          elem: innerGroup
        }]
      }, options);
      return buildCommon.makeSpan(["mord", "underline"], [vlist], options);
    },
    mathmlBuilder(group, options) {
      var operator = new mathMLTree.MathNode("mo", [new mathMLTree.TextNode("\u203E")]);
      operator.setAttribute("stretchy", "true");
      var node = new mathMLTree.MathNode("munder", [buildGroup2(group.body, options), operator]);
      node.setAttribute("accentunder", "true");
      return node;
    }
  });
  defineFunction({
    type: "vcenter",
    names: ["\\vcenter"],
    props: {
      numArgs: 1,
      argTypes: ["original"],
      // In LaTeX, \vcenter can act only on a box.
      allowedInText: false
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      return {
        type: "vcenter",
        mode: parser.mode,
        body: args[0]
      };
    },
    htmlBuilder(group, options) {
      var body3 = buildGroup$1(group.body, options);
      var axisHeight = options.fontMetrics().axisHeight;
      var dy = 0.5 * (body3.height - axisHeight - (body3.depth + axisHeight));
      return buildCommon.makeVList({
        positionType: "shift",
        positionData: dy,
        children: [{
          type: "elem",
          elem: body3
        }]
      }, options);
    },
    mathmlBuilder(group, options) {
      return new mathMLTree.MathNode("mpadded", [buildGroup2(group.body, options)], ["vcenter"]);
    }
  });
  defineFunction({
    type: "verb",
    names: ["\\verb"],
    props: {
      numArgs: 0,
      allowedInText: true
    },
    handler(context, args, optArgs) {
      throw new ParseError("\\verb ended by end of line instead of matching delimiter");
    },
    htmlBuilder(group, options) {
      var text3 = makeVerb(group);
      var body3 = [];
      var newOptions = options.havingStyle(options.style.text());
      for (var i2 = 0; i2 < text3.length; i2++) {
        var c = text3[i2];
        if (c === "~") {
          c = "\\textasciitilde";
        }
        body3.push(buildCommon.makeSymbol(c, "Typewriter-Regular", group.mode, newOptions, ["mord", "texttt"]));
      }
      return buildCommon.makeSpan(["mord", "text"].concat(newOptions.sizingClasses(options)), buildCommon.tryCombineChars(body3), newOptions);
    },
    mathmlBuilder(group, options) {
      var text3 = new mathMLTree.TextNode(makeVerb(group));
      var node = new mathMLTree.MathNode("mtext", [text3]);
      node.setAttribute("mathvariant", "monospace");
      return node;
    }
  });
  var makeVerb = (group) => group.body.replace(/ /g, group.star ? "\u2423" : "\xA0");
  var functions = _functions;
  var spaceRegexString = "[ \r\n	]";
  var controlWordRegexString = "\\\\[a-zA-Z@]+";
  var controlSymbolRegexString = "\\\\[^\uD800-\uDFFF]";
  var controlWordWhitespaceRegexString = "(" + controlWordRegexString + ")" + spaceRegexString + "*";
  var controlSpaceRegexString = "\\\\(\n|[ \r	]+\n?)[ \r	]*";
  var combiningDiacriticalMarkString = "[\u0300-\u036F]";
  var combiningDiacriticalMarksEndRegex = new RegExp(combiningDiacriticalMarkString + "+$");
  var tokenRegexString = "(" + spaceRegexString + "+)|" + // whitespace
  (controlSpaceRegexString + "|") + // \whitespace
  "([!-\\[\\]-\u2027\u202A-\uD7FF\uF900-\uFFFF]" + // single codepoint
  (combiningDiacriticalMarkString + "*") + // ...plus accents
  "|[\uD800-\uDBFF][\uDC00-\uDFFF]" + // surrogate pair
  (combiningDiacriticalMarkString + "*") + // ...plus accents
  "|\\\\verb\\*([^]).*?\\4|\\\\verb([^*a-zA-Z]).*?\\5" + // \verb unstarred
  ("|" + controlWordWhitespaceRegexString) + // \macroName + spaces
  ("|" + controlSymbolRegexString + ")");
  var Lexer = class {
    // Category codes. The lexer only supports comment characters (14) for now.
    // MacroExpander additionally distinguishes active (13).
    constructor(input, settings) {
      this.input = void 0;
      this.settings = void 0;
      this.tokenRegex = void 0;
      this.catcodes = void 0;
      this.input = input;
      this.settings = settings;
      this.tokenRegex = new RegExp(tokenRegexString, "g");
      this.catcodes = {
        "%": 14,
        // comment character
        "~": 13
        // active character
      };
    }
    setCatcode(char, code) {
      this.catcodes[char] = code;
    }
    /**
     * This function lexes a single token.
     */
    lex() {
      var input = this.input;
      var pos = this.tokenRegex.lastIndex;
      if (pos === input.length) {
        return new Token("EOF", new SourceLocation(this, pos, pos));
      }
      var match = this.tokenRegex.exec(input);
      if (match === null || match.index !== pos) {
        throw new ParseError("Unexpected character: '" + input[pos] + "'", new Token(input[pos], new SourceLocation(this, pos, pos + 1)));
      }
      var text3 = match[6] || match[3] || (match[2] ? "\\ " : " ");
      if (this.catcodes[text3] === 14) {
        var nlIndex = input.indexOf("\n", this.tokenRegex.lastIndex);
        if (nlIndex === -1) {
          this.tokenRegex.lastIndex = input.length;
          this.settings.reportNonstrict("commentAtEnd", "% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)");
        } else {
          this.tokenRegex.lastIndex = nlIndex + 1;
        }
        return this.lex();
      }
      return new Token(text3, new SourceLocation(this, pos, this.tokenRegex.lastIndex));
    }
  };
  var Namespace = class {
    /**
     * Both arguments are optional.  The first argument is an object of
     * built-in mappings which never change.  The second argument is an object
     * of initial (global-level) mappings, which will constantly change
     * according to any global/top-level `set`s done.
     */
    constructor(builtins, globalMacros) {
      if (builtins === void 0) {
        builtins = {};
      }
      if (globalMacros === void 0) {
        globalMacros = {};
      }
      this.current = void 0;
      this.builtins = void 0;
      this.undefStack = void 0;
      this.current = globalMacros;
      this.builtins = builtins;
      this.undefStack = [];
    }
    /**
     * Start a new nested group, affecting future local `set`s.
     */
    beginGroup() {
      this.undefStack.push({});
    }
    /**
     * End current nested group, restoring values before the group began.
     */
    endGroup() {
      if (this.undefStack.length === 0) {
        throw new ParseError("Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug");
      }
      var undefs = this.undefStack.pop();
      for (var undef in undefs) {
        if (undefs.hasOwnProperty(undef)) {
          if (undefs[undef] == null) {
            delete this.current[undef];
          } else {
            this.current[undef] = undefs[undef];
          }
        }
      }
    }
    /**
     * Ends all currently nested groups (if any), restoring values before the
     * groups began.  Useful in case of an error in the middle of parsing.
     */
    endGroups() {
      while (this.undefStack.length > 0) {
        this.endGroup();
      }
    }
    /**
     * Detect whether `name` has a definition.  Equivalent to
     * `get(name) != null`.
     */
    has(name) {
      return this.current.hasOwnProperty(name) || this.builtins.hasOwnProperty(name);
    }
    /**
     * Get the current value of a name, or `undefined` if there is no value.
     *
     * Note: Do not use `if (namespace.get(...))` to detect whether a macro
     * is defined, as the definition may be the empty string which evaluates
     * to `false` in JavaScript.  Use `if (namespace.get(...) != null)` or
     * `if (namespace.has(...))`.
     */
    get(name) {
      if (this.current.hasOwnProperty(name)) {
        return this.current[name];
      } else {
        return this.builtins[name];
      }
    }
    /**
     * Set the current value of a name, and optionally set it globally too.
     * Local set() sets the current value and (when appropriate) adds an undo
     * operation to the undo stack.  Global set() may change the undo
     * operation at every level, so takes time linear in their number.
     * A value of undefined means to delete existing definitions.
     */
    set(name, value, global) {
      if (global === void 0) {
        global = false;
      }
      if (global) {
        for (var i2 = 0; i2 < this.undefStack.length; i2++) {
          delete this.undefStack[i2][name];
        }
        if (this.undefStack.length > 0) {
          this.undefStack[this.undefStack.length - 1][name] = value;
        }
      } else {
        var top = this.undefStack[this.undefStack.length - 1];
        if (top && !top.hasOwnProperty(name)) {
          top[name] = this.current[name];
        }
      }
      if (value == null) {
        delete this.current[name];
      } else {
        this.current[name] = value;
      }
    }
  };
  var macros = _macros;
  defineMacro("\\noexpand", function(context) {
    var t = context.popToken();
    if (context.isExpandable(t.text)) {
      t.noexpand = true;
      t.treatAsRelax = true;
    }
    return {
      tokens: [t],
      numArgs: 0
    };
  });
  defineMacro("\\expandafter", function(context) {
    var t = context.popToken();
    context.expandOnce(true);
    return {
      tokens: [t],
      numArgs: 0
    };
  });
  defineMacro("\\@firstoftwo", function(context) {
    var args = context.consumeArgs(2);
    return {
      tokens: args[0],
      numArgs: 0
    };
  });
  defineMacro("\\@secondoftwo", function(context) {
    var args = context.consumeArgs(2);
    return {
      tokens: args[1],
      numArgs: 0
    };
  });
  defineMacro("\\@ifnextchar", function(context) {
    var args = context.consumeArgs(3);
    context.consumeSpaces();
    var nextToken = context.future();
    if (args[0].length === 1 && args[0][0].text === nextToken.text) {
      return {
        tokens: args[1],
        numArgs: 0
      };
    } else {
      return {
        tokens: args[2],
        numArgs: 0
      };
    }
  });
  defineMacro("\\@ifstar", "\\@ifnextchar *{\\@firstoftwo{#1}}");
  defineMacro("\\TextOrMath", function(context) {
    var args = context.consumeArgs(2);
    if (context.mode === "text") {
      return {
        tokens: args[0],
        numArgs: 0
      };
    } else {
      return {
        tokens: args[1],
        numArgs: 0
      };
    }
  });
  var digitToNumber = {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "a": 10,
    "A": 10,
    "b": 11,
    "B": 11,
    "c": 12,
    "C": 12,
    "d": 13,
    "D": 13,
    "e": 14,
    "E": 14,
    "f": 15,
    "F": 15
  };
  defineMacro("\\char", function(context) {
    var token2 = context.popToken();
    var base;
    var number2 = "";
    if (token2.text === "'") {
      base = 8;
      token2 = context.popToken();
    } else if (token2.text === '"') {
      base = 16;
      token2 = context.popToken();
    } else if (token2.text === "`") {
      token2 = context.popToken();
      if (token2.text[0] === "\\") {
        number2 = token2.text.charCodeAt(1);
      } else if (token2.text === "EOF") {
        throw new ParseError("\\char` missing argument");
      } else {
        number2 = token2.text.charCodeAt(0);
      }
    } else {
      base = 10;
    }
    if (base) {
      number2 = digitToNumber[token2.text];
      if (number2 == null || number2 >= base) {
        throw new ParseError("Invalid base-" + base + " digit " + token2.text);
      }
      var digit;
      while ((digit = digitToNumber[context.future().text]) != null && digit < base) {
        number2 *= base;
        number2 += digit;
        context.popToken();
      }
    }
    return "\\@char{" + number2 + "}";
  });
  var newcommand = (context, existsOK, nonexistsOK, skipIfExists) => {
    var arg = context.consumeArg().tokens;
    if (arg.length !== 1) {
      throw new ParseError("\\newcommand's first argument must be a macro name");
    }
    var name = arg[0].text;
    var exists = context.isDefined(name);
    if (exists && !existsOK) {
      throw new ParseError("\\newcommand{" + name + "} attempting to redefine " + (name + "; use \\renewcommand"));
    }
    if (!exists && !nonexistsOK) {
      throw new ParseError("\\renewcommand{" + name + "} when command " + name + " does not yet exist; use \\newcommand");
    }
    var numArgs = 0;
    arg = context.consumeArg().tokens;
    if (arg.length === 1 && arg[0].text === "[") {
      var argText = "";
      var token2 = context.expandNextToken();
      while (token2.text !== "]" && token2.text !== "EOF") {
        argText += token2.text;
        token2 = context.expandNextToken();
      }
      if (!argText.match(/^\s*[0-9]+\s*$/)) {
        throw new ParseError("Invalid number of arguments: " + argText);
      }
      numArgs = parseInt(argText);
      arg = context.consumeArg().tokens;
    }
    if (!(exists && skipIfExists)) {
      context.macros.set(name, {
        tokens: arg,
        numArgs
      });
    }
    return "";
  };
  defineMacro("\\newcommand", (context) => newcommand(context, false, true, false));
  defineMacro("\\renewcommand", (context) => newcommand(context, true, false, false));
  defineMacro("\\providecommand", (context) => newcommand(context, true, true, true));
  defineMacro("\\message", (context) => {
    var arg = context.consumeArgs(1)[0];
    console.log(arg.reverse().map((token2) => token2.text).join(""));
    return "";
  });
  defineMacro("\\errmessage", (context) => {
    var arg = context.consumeArgs(1)[0];
    console.error(arg.reverse().map((token2) => token2.text).join(""));
    return "";
  });
  defineMacro("\\show", (context) => {
    var tok = context.popToken();
    var name = tok.text;
    console.log(tok, context.macros.get(name), functions[name], symbols.math[name], symbols.text[name]);
    return "";
  });
  defineMacro("\\bgroup", "{");
  defineMacro("\\egroup", "}");
  defineMacro("~", "\\nobreakspace");
  defineMacro("\\lq", "`");
  defineMacro("\\rq", "'");
  defineMacro("\\aa", "\\r a");
  defineMacro("\\AA", "\\r A");
  defineMacro("\\textcopyright", "\\html@mathml{\\textcircled{c}}{\\char`\xA9}");
  defineMacro("\\copyright", "\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}");
  defineMacro("\\textregistered", "\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`\xAE}");
  defineMacro("\u212C", "\\mathscr{B}");
  defineMacro("\u2130", "\\mathscr{E}");
  defineMacro("\u2131", "\\mathscr{F}");
  defineMacro("\u210B", "\\mathscr{H}");
  defineMacro("\u2110", "\\mathscr{I}");
  defineMacro("\u2112", "\\mathscr{L}");
  defineMacro("\u2133", "\\mathscr{M}");
  defineMacro("\u211B", "\\mathscr{R}");
  defineMacro("\u212D", "\\mathfrak{C}");
  defineMacro("\u210C", "\\mathfrak{H}");
  defineMacro("\u2128", "\\mathfrak{Z}");
  defineMacro("\\Bbbk", "\\Bbb{k}");
  defineMacro("\xB7", "\\cdotp");
  defineMacro("\\llap", "\\mathllap{\\textrm{#1}}");
  defineMacro("\\rlap", "\\mathrlap{\\textrm{#1}}");
  defineMacro("\\clap", "\\mathclap{\\textrm{#1}}");
  defineMacro("\\mathstrut", "\\vphantom{(}");
  defineMacro("\\underbar", "\\underline{\\text{#1}}");
  defineMacro("\\not", '\\html@mathml{\\mathrel{\\mathrlap\\@not}}{\\char"338}');
  defineMacro("\\neq", "\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`\u2260}}");
  defineMacro("\\ne", "\\neq");
  defineMacro("\u2260", "\\neq");
  defineMacro("\\notin", "\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`\u2209}}");
  defineMacro("\u2209", "\\notin");
  defineMacro("\u2258", "\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`\u2258}}");
  defineMacro("\u2259", "\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`\u2258}}");
  defineMacro("\u225A", "\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`\u225A}}");
  defineMacro("\u225B", "\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`\u225B}}");
  defineMacro("\u225D", "\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`\u225D}}");
  defineMacro("\u225E", "\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`\u225E}}");
  defineMacro("\u225F", "\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`\u225F}}");
  defineMacro("\u27C2", "\\perp");
  defineMacro("\u203C", "\\mathclose{!\\mkern-0.8mu!}");
  defineMacro("\u220C", "\\notni");
  defineMacro("\u231C", "\\ulcorner");
  defineMacro("\u231D", "\\urcorner");
  defineMacro("\u231E", "\\llcorner");
  defineMacro("\u231F", "\\lrcorner");
  defineMacro("\xA9", "\\copyright");
  defineMacro("\xAE", "\\textregistered");
  defineMacro("\uFE0F", "\\textregistered");
  defineMacro("\\ulcorner", '\\html@mathml{\\@ulcorner}{\\mathop{\\char"231c}}');
  defineMacro("\\urcorner", '\\html@mathml{\\@urcorner}{\\mathop{\\char"231d}}');
  defineMacro("\\llcorner", '\\html@mathml{\\@llcorner}{\\mathop{\\char"231e}}');
  defineMacro("\\lrcorner", '\\html@mathml{\\@lrcorner}{\\mathop{\\char"231f}}');
  defineMacro("\\vdots", "{\\varvdots\\rule{0pt}{15pt}}");
  defineMacro("\u22EE", "\\vdots");
  defineMacro("\\varGamma", "\\mathit{\\Gamma}");
  defineMacro("\\varDelta", "\\mathit{\\Delta}");
  defineMacro("\\varTheta", "\\mathit{\\Theta}");
  defineMacro("\\varLambda", "\\mathit{\\Lambda}");
  defineMacro("\\varXi", "\\mathit{\\Xi}");
  defineMacro("\\varPi", "\\mathit{\\Pi}");
  defineMacro("\\varSigma", "\\mathit{\\Sigma}");
  defineMacro("\\varUpsilon", "\\mathit{\\Upsilon}");
  defineMacro("\\varPhi", "\\mathit{\\Phi}");
  defineMacro("\\varPsi", "\\mathit{\\Psi}");
  defineMacro("\\varOmega", "\\mathit{\\Omega}");
  defineMacro("\\substack", "\\begin{subarray}{c}#1\\end{subarray}");
  defineMacro("\\colon", "\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu\\relax");
  defineMacro("\\boxed", "\\fbox{$\\displaystyle{#1}$}");
  defineMacro("\\iff", "\\DOTSB\\;\\Longleftrightarrow\\;");
  defineMacro("\\implies", "\\DOTSB\\;\\Longrightarrow\\;");
  defineMacro("\\impliedby", "\\DOTSB\\;\\Longleftarrow\\;");
  defineMacro("\\dddot", "{\\overset{\\raisebox{-0.1ex}{\\normalsize ...}}{#1}}");
  defineMacro("\\ddddot", "{\\overset{\\raisebox{-0.1ex}{\\normalsize ....}}{#1}}");
  var dotsByToken = {
    ",": "\\dotsc",
    "\\not": "\\dotsb",
    // \keybin@ checks for the following:
    "+": "\\dotsb",
    "=": "\\dotsb",
    "<": "\\dotsb",
    ">": "\\dotsb",
    "-": "\\dotsb",
    "*": "\\dotsb",
    ":": "\\dotsb",
    // Symbols whose definition starts with \DOTSB:
    "\\DOTSB": "\\dotsb",
    "\\coprod": "\\dotsb",
    "\\bigvee": "\\dotsb",
    "\\bigwedge": "\\dotsb",
    "\\biguplus": "\\dotsb",
    "\\bigcap": "\\dotsb",
    "\\bigcup": "\\dotsb",
    "\\prod": "\\dotsb",
    "\\sum": "\\dotsb",
    "\\bigotimes": "\\dotsb",
    "\\bigoplus": "\\dotsb",
    "\\bigodot": "\\dotsb",
    "\\bigsqcup": "\\dotsb",
    "\\And": "\\dotsb",
    "\\longrightarrow": "\\dotsb",
    "\\Longrightarrow": "\\dotsb",
    "\\longleftarrow": "\\dotsb",
    "\\Longleftarrow": "\\dotsb",
    "\\longleftrightarrow": "\\dotsb",
    "\\Longleftrightarrow": "\\dotsb",
    "\\mapsto": "\\dotsb",
    "\\longmapsto": "\\dotsb",
    "\\hookrightarrow": "\\dotsb",
    "\\doteq": "\\dotsb",
    // Symbols whose definition starts with \mathbin:
    "\\mathbin": "\\dotsb",
    // Symbols whose definition starts with \mathrel:
    "\\mathrel": "\\dotsb",
    "\\relbar": "\\dotsb",
    "\\Relbar": "\\dotsb",
    "\\xrightarrow": "\\dotsb",
    "\\xleftarrow": "\\dotsb",
    // Symbols whose definition starts with \DOTSI:
    "\\DOTSI": "\\dotsi",
    "\\int": "\\dotsi",
    "\\oint": "\\dotsi",
    "\\iint": "\\dotsi",
    "\\iiint": "\\dotsi",
    "\\iiiint": "\\dotsi",
    "\\idotsint": "\\dotsi",
    // Symbols whose definition starts with \DOTSX:
    "\\DOTSX": "\\dotsx"
  };
  defineMacro("\\dots", function(context) {
    var thedots = "\\dotso";
    var next = context.expandAfterFuture().text;
    if (next in dotsByToken) {
      thedots = dotsByToken[next];
    } else if (next.slice(0, 4) === "\\not") {
      thedots = "\\dotsb";
    } else if (next in symbols.math) {
      if (["bin", "rel"].includes(symbols.math[next].group)) {
        thedots = "\\dotsb";
      }
    }
    return thedots;
  });
  var spaceAfterDots = {
    // \rightdelim@ checks for the following:
    ")": true,
    "]": true,
    "\\rbrack": true,
    "\\}": true,
    "\\rbrace": true,
    "\\rangle": true,
    "\\rceil": true,
    "\\rfloor": true,
    "\\rgroup": true,
    "\\rmoustache": true,
    "\\right": true,
    "\\bigr": true,
    "\\biggr": true,
    "\\Bigr": true,
    "\\Biggr": true,
    // \extra@ also tests for the following:
    "$": true,
    // \extrap@ checks for the following:
    ";": true,
    ".": true,
    ",": true
  };
  defineMacro("\\dotso", function(context) {
    var next = context.future().text;
    if (next in spaceAfterDots) {
      return "\\ldots\\,";
    } else {
      return "\\ldots";
    }
  });
  defineMacro("\\dotsc", function(context) {
    var next = context.future().text;
    if (next in spaceAfterDots && next !== ",") {
      return "\\ldots\\,";
    } else {
      return "\\ldots";
    }
  });
  defineMacro("\\cdots", function(context) {
    var next = context.future().text;
    if (next in spaceAfterDots) {
      return "\\@cdots\\,";
    } else {
      return "\\@cdots";
    }
  });
  defineMacro("\\dotsb", "\\cdots");
  defineMacro("\\dotsm", "\\cdots");
  defineMacro("\\dotsi", "\\!\\cdots");
  defineMacro("\\dotsx", "\\ldots\\,");
  defineMacro("\\DOTSI", "\\relax");
  defineMacro("\\DOTSB", "\\relax");
  defineMacro("\\DOTSX", "\\relax");
  defineMacro("\\tmspace", "\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax");
  defineMacro("\\,", "\\tmspace+{3mu}{.1667em}");
  defineMacro("\\thinspace", "\\,");
  defineMacro("\\>", "\\mskip{4mu}");
  defineMacro("\\:", "\\tmspace+{4mu}{.2222em}");
  defineMacro("\\medspace", "\\:");
  defineMacro("\\;", "\\tmspace+{5mu}{.2777em}");
  defineMacro("\\thickspace", "\\;");
  defineMacro("\\!", "\\tmspace-{3mu}{.1667em}");
  defineMacro("\\negthinspace", "\\!");
  defineMacro("\\negmedspace", "\\tmspace-{4mu}{.2222em}");
  defineMacro("\\negthickspace", "\\tmspace-{5mu}{.277em}");
  defineMacro("\\enspace", "\\kern.5em ");
  defineMacro("\\enskip", "\\hskip.5em\\relax");
  defineMacro("\\quad", "\\hskip1em\\relax");
  defineMacro("\\qquad", "\\hskip2em\\relax");
  defineMacro("\\tag", "\\@ifstar\\tag@literal\\tag@paren");
  defineMacro("\\tag@paren", "\\tag@literal{({#1})}");
  defineMacro("\\tag@literal", (context) => {
    if (context.macros.get("\\df@tag")) {
      throw new ParseError("Multiple \\tag");
    }
    return "\\gdef\\df@tag{\\text{#1}}";
  });
  defineMacro("\\bmod", "\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}");
  defineMacro("\\pod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)");
  defineMacro("\\pmod", "\\pod{{\\rm mod}\\mkern6mu#1}");
  defineMacro("\\mod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1");
  defineMacro("\\newline", "\\\\\\relax");
  defineMacro("\\TeX", "\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}");
  var latexRaiseA = makeEm(fontMetricsData["Main-Regular"]["T".charCodeAt(0)][1] - 0.7 * fontMetricsData["Main-Regular"]["A".charCodeAt(0)][1]);
  defineMacro("\\LaTeX", "\\textrm{\\html@mathml{" + ("L\\kern-.36em\\raisebox{" + latexRaiseA + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{LaTeX}}");
  defineMacro("\\KaTeX", "\\textrm{\\html@mathml{" + ("K\\kern-.17em\\raisebox{" + latexRaiseA + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{KaTeX}}");
  defineMacro("\\hspace", "\\@ifstar\\@hspacer\\@hspace");
  defineMacro("\\@hspace", "\\hskip #1\\relax");
  defineMacro("\\@hspacer", "\\rule{0pt}{0pt}\\hskip #1\\relax");
  defineMacro("\\ordinarycolon", ":");
  defineMacro("\\vcentcolon", "\\mathrel{\\mathop\\ordinarycolon}");
  defineMacro("\\dblcolon", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}}{\\mathop{\\char"2237}}');
  defineMacro("\\coloneqq", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2254}}');
  defineMacro("\\Coloneqq", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2237\\char"3d}}');
  defineMacro("\\coloneq", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"3a\\char"2212}}');
  defineMacro("\\Coloneq", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"2237\\char"2212}}');
  defineMacro("\\eqqcolon", '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2255}}');
  defineMacro("\\Eqqcolon", '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"3d\\char"2237}}');
  defineMacro("\\eqcolon", '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2239}}');
  defineMacro("\\Eqcolon", '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"2212\\char"2237}}');
  defineMacro("\\colonapprox", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"3a\\char"2248}}');
  defineMacro("\\Colonapprox", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"2237\\char"2248}}');
  defineMacro("\\colonsim", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"3a\\char"223c}}');
  defineMacro("\\Colonsim", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"2237\\char"223c}}');
  defineMacro("\u2237", "\\dblcolon");
  defineMacro("\u2239", "\\eqcolon");
  defineMacro("\u2254", "\\coloneqq");
  defineMacro("\u2255", "\\eqqcolon");
  defineMacro("\u2A74", "\\Coloneqq");
  defineMacro("\\ratio", "\\vcentcolon");
  defineMacro("\\coloncolon", "\\dblcolon");
  defineMacro("\\colonequals", "\\coloneqq");
  defineMacro("\\coloncolonequals", "\\Coloneqq");
  defineMacro("\\equalscolon", "\\eqqcolon");
  defineMacro("\\equalscoloncolon", "\\Eqqcolon");
  defineMacro("\\colonminus", "\\coloneq");
  defineMacro("\\coloncolonminus", "\\Coloneq");
  defineMacro("\\minuscolon", "\\eqcolon");
  defineMacro("\\minuscoloncolon", "\\Eqcolon");
  defineMacro("\\coloncolonapprox", "\\Colonapprox");
  defineMacro("\\coloncolonsim", "\\Colonsim");
  defineMacro("\\simcolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
  defineMacro("\\simcoloncolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}");
  defineMacro("\\approxcolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
  defineMacro("\\approxcoloncolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}");
  defineMacro("\\notni", "\\html@mathml{\\not\\ni}{\\mathrel{\\char`\u220C}}");
  defineMacro("\\limsup", "\\DOTSB\\operatorname*{lim\\,sup}");
  defineMacro("\\liminf", "\\DOTSB\\operatorname*{lim\\,inf}");
  defineMacro("\\injlim", "\\DOTSB\\operatorname*{inj\\,lim}");
  defineMacro("\\projlim", "\\DOTSB\\operatorname*{proj\\,lim}");
  defineMacro("\\varlimsup", "\\DOTSB\\operatorname*{\\overline{lim}}");
  defineMacro("\\varliminf", "\\DOTSB\\operatorname*{\\underline{lim}}");
  defineMacro("\\varinjlim", "\\DOTSB\\operatorname*{\\underrightarrow{lim}}");
  defineMacro("\\varprojlim", "\\DOTSB\\operatorname*{\\underleftarrow{lim}}");
  defineMacro("\\gvertneqq", "\\html@mathml{\\@gvertneqq}{\u2269}");
  defineMacro("\\lvertneqq", "\\html@mathml{\\@lvertneqq}{\u2268}");
  defineMacro("\\ngeqq", "\\html@mathml{\\@ngeqq}{\u2271}");
  defineMacro("\\ngeqslant", "\\html@mathml{\\@ngeqslant}{\u2271}");
  defineMacro("\\nleqq", "\\html@mathml{\\@nleqq}{\u2270}");
  defineMacro("\\nleqslant", "\\html@mathml{\\@nleqslant}{\u2270}");
  defineMacro("\\nshortmid", "\\html@mathml{\\@nshortmid}{\u2224}");
  defineMacro("\\nshortparallel", "\\html@mathml{\\@nshortparallel}{\u2226}");
  defineMacro("\\nsubseteqq", "\\html@mathml{\\@nsubseteqq}{\u2288}");
  defineMacro("\\nsupseteqq", "\\html@mathml{\\@nsupseteqq}{\u2289}");
  defineMacro("\\varsubsetneq", "\\html@mathml{\\@varsubsetneq}{\u228A}");
  defineMacro("\\varsubsetneqq", "\\html@mathml{\\@varsubsetneqq}{\u2ACB}");
  defineMacro("\\varsupsetneq", "\\html@mathml{\\@varsupsetneq}{\u228B}");
  defineMacro("\\varsupsetneqq", "\\html@mathml{\\@varsupsetneqq}{\u2ACC}");
  defineMacro("\\imath", "\\html@mathml{\\@imath}{\u0131}");
  defineMacro("\\jmath", "\\html@mathml{\\@jmath}{\u0237}");
  defineMacro("\\llbracket", "\\html@mathml{\\mathopen{[\\mkern-3.2mu[}}{\\mathopen{\\char`\u27E6}}");
  defineMacro("\\rrbracket", "\\html@mathml{\\mathclose{]\\mkern-3.2mu]}}{\\mathclose{\\char`\u27E7}}");
  defineMacro("\u27E6", "\\llbracket");
  defineMacro("\u27E7", "\\rrbracket");
  defineMacro("\\lBrace", "\\html@mathml{\\mathopen{\\{\\mkern-3.2mu[}}{\\mathopen{\\char`\u2983}}");
  defineMacro("\\rBrace", "\\html@mathml{\\mathclose{]\\mkern-3.2mu\\}}}{\\mathclose{\\char`\u2984}}");
  defineMacro("\u2983", "\\lBrace");
  defineMacro("\u2984", "\\rBrace");
  defineMacro("\\minuso", "\\mathbin{\\html@mathml{{\\mathrlap{\\mathchoice{\\kern{0.145em}}{\\kern{0.145em}}{\\kern{0.1015em}}{\\kern{0.0725em}}\\circ}{-}}}{\\char`\u29B5}}");
  defineMacro("\u29B5", "\\minuso");
  defineMacro("\\darr", "\\downarrow");
  defineMacro("\\dArr", "\\Downarrow");
  defineMacro("\\Darr", "\\Downarrow");
  defineMacro("\\lang", "\\langle");
  defineMacro("\\rang", "\\rangle");
  defineMacro("\\uarr", "\\uparrow");
  defineMacro("\\uArr", "\\Uparrow");
  defineMacro("\\Uarr", "\\Uparrow");
  defineMacro("\\N", "\\mathbb{N}");
  defineMacro("\\R", "\\mathbb{R}");
  defineMacro("\\Z", "\\mathbb{Z}");
  defineMacro("\\alef", "\\aleph");
  defineMacro("\\alefsym", "\\aleph");
  defineMacro("\\Alpha", "\\mathrm{A}");
  defineMacro("\\Beta", "\\mathrm{B}");
  defineMacro("\\bull", "\\bullet");
  defineMacro("\\Chi", "\\mathrm{X}");
  defineMacro("\\clubs", "\\clubsuit");
  defineMacro("\\cnums", "\\mathbb{C}");
  defineMacro("\\Complex", "\\mathbb{C}");
  defineMacro("\\Dagger", "\\ddagger");
  defineMacro("\\diamonds", "\\diamondsuit");
  defineMacro("\\empty", "\\emptyset");
  defineMacro("\\Epsilon", "\\mathrm{E}");
  defineMacro("\\Eta", "\\mathrm{H}");
  defineMacro("\\exist", "\\exists");
  defineMacro("\\harr", "\\leftrightarrow");
  defineMacro("\\hArr", "\\Leftrightarrow");
  defineMacro("\\Harr", "\\Leftrightarrow");
  defineMacro("\\hearts", "\\heartsuit");
  defineMacro("\\image", "\\Im");
  defineMacro("\\infin", "\\infty");
  defineMacro("\\Iota", "\\mathrm{I}");
  defineMacro("\\isin", "\\in");
  defineMacro("\\Kappa", "\\mathrm{K}");
  defineMacro("\\larr", "\\leftarrow");
  defineMacro("\\lArr", "\\Leftarrow");
  defineMacro("\\Larr", "\\Leftarrow");
  defineMacro("\\lrarr", "\\leftrightarrow");
  defineMacro("\\lrArr", "\\Leftrightarrow");
  defineMacro("\\Lrarr", "\\Leftrightarrow");
  defineMacro("\\Mu", "\\mathrm{M}");
  defineMacro("\\natnums", "\\mathbb{N}");
  defineMacro("\\Nu", "\\mathrm{N}");
  defineMacro("\\Omicron", "\\mathrm{O}");
  defineMacro("\\plusmn", "\\pm");
  defineMacro("\\rarr", "\\rightarrow");
  defineMacro("\\rArr", "\\Rightarrow");
  defineMacro("\\Rarr", "\\Rightarrow");
  defineMacro("\\real", "\\Re");
  defineMacro("\\reals", "\\mathbb{R}");
  defineMacro("\\Reals", "\\mathbb{R}");
  defineMacro("\\Rho", "\\mathrm{P}");
  defineMacro("\\sdot", "\\cdot");
  defineMacro("\\sect", "\\S");
  defineMacro("\\spades", "\\spadesuit");
  defineMacro("\\sub", "\\subset");
  defineMacro("\\sube", "\\subseteq");
  defineMacro("\\supe", "\\supseteq");
  defineMacro("\\Tau", "\\mathrm{T}");
  defineMacro("\\thetasym", "\\vartheta");
  defineMacro("\\weierp", "\\wp");
  defineMacro("\\Zeta", "\\mathrm{Z}");
  defineMacro("\\argmin", "\\DOTSB\\operatorname*{arg\\,min}");
  defineMacro("\\argmax", "\\DOTSB\\operatorname*{arg\\,max}");
  defineMacro("\\plim", "\\DOTSB\\mathop{\\operatorname{plim}}\\limits");
  defineMacro("\\bra", "\\mathinner{\\langle{#1}|}");
  defineMacro("\\ket", "\\mathinner{|{#1}\\rangle}");
  defineMacro("\\braket", "\\mathinner{\\langle{#1}\\rangle}");
  defineMacro("\\Bra", "\\left\\langle#1\\right|");
  defineMacro("\\Ket", "\\left|#1\\right\\rangle");
  var braketHelper = (one2) => (context) => {
    var left = context.consumeArg().tokens;
    var middle = context.consumeArg().tokens;
    var middleDouble = context.consumeArg().tokens;
    var right = context.consumeArg().tokens;
    var oldMiddle = context.macros.get("|");
    var oldMiddleDouble = context.macros.get("\\|");
    context.macros.beginGroup();
    var midMacro = (double) => (context2) => {
      if (one2) {
        context2.macros.set("|", oldMiddle);
        if (middleDouble.length) {
          context2.macros.set("\\|", oldMiddleDouble);
        }
      }
      var doubled = double;
      if (!double && middleDouble.length) {
        var nextToken = context2.future();
        if (nextToken.text === "|") {
          context2.popToken();
          doubled = true;
        }
      }
      return {
        tokens: doubled ? middleDouble : middle,
        numArgs: 0
      };
    };
    context.macros.set("|", midMacro(false));
    if (middleDouble.length) {
      context.macros.set("\\|", midMacro(true));
    }
    var arg = context.consumeArg().tokens;
    var expanded = context.expandTokens([
      ...right,
      ...arg,
      ...left
      // reversed
    ]);
    context.macros.endGroup();
    return {
      tokens: expanded.reverse(),
      numArgs: 0
    };
  };
  defineMacro("\\bra@ket", braketHelper(false));
  defineMacro("\\bra@set", braketHelper(true));
  defineMacro("\\Braket", "\\bra@ket{\\left\\langle}{\\,\\middle\\vert\\,}{\\,\\middle\\vert\\,}{\\right\\rangle}");
  defineMacro("\\Set", "\\bra@set{\\left\\{\\:}{\\;\\middle\\vert\\;}{\\;\\middle\\Vert\\;}{\\:\\right\\}}");
  defineMacro("\\set", "\\bra@set{\\{\\,}{\\mid}{}{\\,\\}}");
  defineMacro("\\angln", "{\\angl n}");
  defineMacro("\\blue", "\\textcolor{##6495ed}{#1}");
  defineMacro("\\orange", "\\textcolor{##ffa500}{#1}");
  defineMacro("\\pink", "\\textcolor{##ff00af}{#1}");
  defineMacro("\\red", "\\textcolor{##df0030}{#1}");
  defineMacro("\\green", "\\textcolor{##28ae7b}{#1}");
  defineMacro("\\gray", "\\textcolor{gray}{#1}");
  defineMacro("\\purple", "\\textcolor{##9d38bd}{#1}");
  defineMacro("\\blueA", "\\textcolor{##ccfaff}{#1}");
  defineMacro("\\blueB", "\\textcolor{##80f6ff}{#1}");
  defineMacro("\\blueC", "\\textcolor{##63d9ea}{#1}");
  defineMacro("\\blueD", "\\textcolor{##11accd}{#1}");
  defineMacro("\\blueE", "\\textcolor{##0c7f99}{#1}");
  defineMacro("\\tealA", "\\textcolor{##94fff5}{#1}");
  defineMacro("\\tealB", "\\textcolor{##26edd5}{#1}");
  defineMacro("\\tealC", "\\textcolor{##01d1c1}{#1}");
  defineMacro("\\tealD", "\\textcolor{##01a995}{#1}");
  defineMacro("\\tealE", "\\textcolor{##208170}{#1}");
  defineMacro("\\greenA", "\\textcolor{##b6ffb0}{#1}");
  defineMacro("\\greenB", "\\textcolor{##8af281}{#1}");
  defineMacro("\\greenC", "\\textcolor{##74cf70}{#1}");
  defineMacro("\\greenD", "\\textcolor{##1fab54}{#1}");
  defineMacro("\\greenE", "\\textcolor{##0d923f}{#1}");
  defineMacro("\\goldA", "\\textcolor{##ffd0a9}{#1}");
  defineMacro("\\goldB", "\\textcolor{##ffbb71}{#1}");
  defineMacro("\\goldC", "\\textcolor{##ff9c39}{#1}");
  defineMacro("\\goldD", "\\textcolor{##e07d10}{#1}");
  defineMacro("\\goldE", "\\textcolor{##a75a05}{#1}");
  defineMacro("\\redA", "\\textcolor{##fca9a9}{#1}");
  defineMacro("\\redB", "\\textcolor{##ff8482}{#1}");
  defineMacro("\\redC", "\\textcolor{##f9685d}{#1}");
  defineMacro("\\redD", "\\textcolor{##e84d39}{#1}");
  defineMacro("\\redE", "\\textcolor{##bc2612}{#1}");
  defineMacro("\\maroonA", "\\textcolor{##ffbde0}{#1}");
  defineMacro("\\maroonB", "\\textcolor{##ff92c6}{#1}");
  defineMacro("\\maroonC", "\\textcolor{##ed5fa6}{#1}");
  defineMacro("\\maroonD", "\\textcolor{##ca337c}{#1}");
  defineMacro("\\maroonE", "\\textcolor{##9e034e}{#1}");
  defineMacro("\\purpleA", "\\textcolor{##ddd7ff}{#1}");
  defineMacro("\\purpleB", "\\textcolor{##c6b9fc}{#1}");
  defineMacro("\\purpleC", "\\textcolor{##aa87ff}{#1}");
  defineMacro("\\purpleD", "\\textcolor{##7854ab}{#1}");
  defineMacro("\\purpleE", "\\textcolor{##543b78}{#1}");
  defineMacro("\\mintA", "\\textcolor{##f5f9e8}{#1}");
  defineMacro("\\mintB", "\\textcolor{##edf2df}{#1}");
  defineMacro("\\mintC", "\\textcolor{##e0e5cc}{#1}");
  defineMacro("\\grayA", "\\textcolor{##f6f7f7}{#1}");
  defineMacro("\\grayB", "\\textcolor{##f0f1f2}{#1}");
  defineMacro("\\grayC", "\\textcolor{##e3e5e6}{#1}");
  defineMacro("\\grayD", "\\textcolor{##d6d8da}{#1}");
  defineMacro("\\grayE", "\\textcolor{##babec2}{#1}");
  defineMacro("\\grayF", "\\textcolor{##888d93}{#1}");
  defineMacro("\\grayG", "\\textcolor{##626569}{#1}");
  defineMacro("\\grayH", "\\textcolor{##3b3e40}{#1}");
  defineMacro("\\grayI", "\\textcolor{##21242c}{#1}");
  defineMacro("\\kaBlue", "\\textcolor{##314453}{#1}");
  defineMacro("\\kaGreen", "\\textcolor{##71B307}{#1}");
  var implicitCommands = {
    "^": true,
    // Parser.js
    "_": true,
    // Parser.js
    "\\limits": true,
    // Parser.js
    "\\nolimits": true
    // Parser.js
  };
  var MacroExpander = class {
    constructor(input, settings, mode) {
      this.settings = void 0;
      this.expansionCount = void 0;
      this.lexer = void 0;
      this.macros = void 0;
      this.stack = void 0;
      this.mode = void 0;
      this.settings = settings;
      this.expansionCount = 0;
      this.feed(input);
      this.macros = new Namespace(macros, settings.macros);
      this.mode = mode;
      this.stack = [];
    }
    /**
     * Feed a new input string to the same MacroExpander
     * (with existing macros etc.).
     */
    feed(input) {
      this.lexer = new Lexer(input, this.settings);
    }
    /**
     * Switches between "text" and "math" modes.
     */
    switchMode(newMode) {
      this.mode = newMode;
    }
    /**
     * Start a new group nesting within all namespaces.
     */
    beginGroup() {
      this.macros.beginGroup();
    }
    /**
     * End current group nesting within all namespaces.
     */
    endGroup() {
      this.macros.endGroup();
    }
    /**
     * Ends all currently nested groups (if any), restoring values before the
     * groups began.  Useful in case of an error in the middle of parsing.
     */
    endGroups() {
      this.macros.endGroups();
    }
    /**
     * Returns the topmost token on the stack, without expanding it.
     * Similar in behavior to TeX's `\futurelet`.
     */
    future() {
      if (this.stack.length === 0) {
        this.pushToken(this.lexer.lex());
      }
      return this.stack[this.stack.length - 1];
    }
    /**
     * Remove and return the next unexpanded token.
     */
    popToken() {
      this.future();
      return this.stack.pop();
    }
    /**
     * Add a given token to the token stack.  In particular, this get be used
     * to put back a token returned from one of the other methods.
     */
    pushToken(token2) {
      this.stack.push(token2);
    }
    /**
     * Append an array of tokens to the token stack.
     */
    pushTokens(tokens) {
      this.stack.push(...tokens);
    }
    /**
     * Find an macro argument without expanding tokens and append the array of
     * tokens to the token stack. Uses Token as a container for the result.
     */
    scanArgument(isOptional) {
      var start;
      var end;
      var tokens;
      if (isOptional) {
        this.consumeSpaces();
        if (this.future().text !== "[") {
          return null;
        }
        start = this.popToken();
        ({
          tokens,
          end
        } = this.consumeArg(["]"]));
      } else {
        ({
          tokens,
          start,
          end
        } = this.consumeArg());
      }
      this.pushToken(new Token("EOF", end.loc));
      this.pushTokens(tokens);
      return new Token("", SourceLocation.range(start, end));
    }
    /**
     * Consume all following space tokens, without expansion.
     */
    consumeSpaces() {
      for (; ; ) {
        var token2 = this.future();
        if (token2.text === " ") {
          this.stack.pop();
        } else {
          break;
        }
      }
    }
    /**
     * Consume an argument from the token stream, and return the resulting array
     * of tokens and start/end token.
     */
    consumeArg(delims) {
      var tokens = [];
      var isDelimited = delims && delims.length > 0;
      if (!isDelimited) {
        this.consumeSpaces();
      }
      var start = this.future();
      var tok;
      var depth = 0;
      var match = 0;
      do {
        tok = this.popToken();
        tokens.push(tok);
        if (tok.text === "{") {
          ++depth;
        } else if (tok.text === "}") {
          --depth;
          if (depth === -1) {
            throw new ParseError("Extra }", tok);
          }
        } else if (tok.text === "EOF") {
          throw new ParseError("Unexpected end of input in a macro argument, expected '" + (delims && isDelimited ? delims[match] : "}") + "'", tok);
        }
        if (delims && isDelimited) {
          if ((depth === 0 || depth === 1 && delims[match] === "{") && tok.text === delims[match]) {
            ++match;
            if (match === delims.length) {
              tokens.splice(-match, match);
              break;
            }
          } else {
            match = 0;
          }
        }
      } while (depth !== 0 || isDelimited);
      if (start.text === "{" && tokens[tokens.length - 1].text === "}") {
        tokens.pop();
        tokens.shift();
      }
      tokens.reverse();
      return {
        tokens,
        start,
        end: tok
      };
    }
    /**
     * Consume the specified number of (delimited) arguments from the token
     * stream and return the resulting array of arguments.
     */
    consumeArgs(numArgs, delimiters2) {
      if (delimiters2) {
        if (delimiters2.length !== numArgs + 1) {
          throw new ParseError("The length of delimiters doesn't match the number of args!");
        }
        var delims = delimiters2[0];
        for (var i2 = 0; i2 < delims.length; i2++) {
          var tok = this.popToken();
          if (delims[i2] !== tok.text) {
            throw new ParseError("Use of the macro doesn't match its definition", tok);
          }
        }
      }
      var args = [];
      for (var _i = 0; _i < numArgs; _i++) {
        args.push(this.consumeArg(delimiters2 && delimiters2[_i + 1]).tokens);
      }
      return args;
    }
    /**
     * Increment `expansionCount` by the specified amount.
     * Throw an error if it exceeds `maxExpand`.
     */
    countExpansion(amount) {
      this.expansionCount += amount;
      if (this.expansionCount > this.settings.maxExpand) {
        throw new ParseError("Too many expansions: infinite loop or need to increase maxExpand setting");
      }
    }
    /**
     * Expand the next token only once if possible.
     *
     * If the token is expanded, the resulting tokens will be pushed onto
     * the stack in reverse order, and the number of such tokens will be
     * returned.  This number might be zero or positive.
     *
     * If not, the return value is `false`, and the next token remains at the
     * top of the stack.
     *
     * In either case, the next token will be on the top of the stack,
     * or the stack will be empty (in case of empty expansion
     * and no other tokens).
     *
     * Used to implement `expandAfterFuture` and `expandNextToken`.
     *
     * If expandableOnly, only expandable tokens are expanded and
     * an undefined control sequence results in an error.
     */
    expandOnce(expandableOnly) {
      var topToken = this.popToken();
      var name = topToken.text;
      var expansion = !topToken.noexpand ? this._getExpansion(name) : null;
      if (expansion == null || expandableOnly && expansion.unexpandable) {
        if (expandableOnly && expansion == null && name[0] === "\\" && !this.isDefined(name)) {
          throw new ParseError("Undefined control sequence: " + name);
        }
        this.pushToken(topToken);
        return false;
      }
      this.countExpansion(1);
      var tokens = expansion.tokens;
      var args = this.consumeArgs(expansion.numArgs, expansion.delimiters);
      if (expansion.numArgs) {
        tokens = tokens.slice();
        for (var i2 = tokens.length - 1; i2 >= 0; --i2) {
          var tok = tokens[i2];
          if (tok.text === "#") {
            if (i2 === 0) {
              throw new ParseError("Incomplete placeholder at end of macro body", tok);
            }
            tok = tokens[--i2];
            if (tok.text === "#") {
              tokens.splice(i2 + 1, 1);
            } else if (/^[1-9]$/.test(tok.text)) {
              tokens.splice(i2, 2, ...args[+tok.text - 1]);
            } else {
              throw new ParseError("Not a valid argument number", tok);
            }
          }
        }
      }
      this.pushTokens(tokens);
      return tokens.length;
    }
    /**
     * Expand the next token only once (if possible), and return the resulting
     * top token on the stack (without removing anything from the stack).
     * Similar in behavior to TeX's `\expandafter\futurelet`.
     * Equivalent to expandOnce() followed by future().
     */
    expandAfterFuture() {
      this.expandOnce();
      return this.future();
    }
    /**
     * Recursively expand first token, then return first non-expandable token.
     */
    expandNextToken() {
      for (; ; ) {
        if (this.expandOnce() === false) {
          var token2 = this.stack.pop();
          if (token2.treatAsRelax) {
            token2.text = "\\relax";
          }
          return token2;
        }
      }
      throw new Error();
    }
    /**
     * Fully expand the given macro name and return the resulting list of
     * tokens, or return `undefined` if no such macro is defined.
     */
    expandMacro(name) {
      return this.macros.has(name) ? this.expandTokens([new Token(name)]) : void 0;
    }
    /**
     * Fully expand the given token stream and return the resulting list of
     * tokens.  Note that the input tokens are in reverse order, but the
     * output tokens are in forward order.
     */
    expandTokens(tokens) {
      var output = [];
      var oldStackLength = this.stack.length;
      this.pushTokens(tokens);
      while (this.stack.length > oldStackLength) {
        if (this.expandOnce(true) === false) {
          var token2 = this.stack.pop();
          if (token2.treatAsRelax) {
            token2.noexpand = false;
            token2.treatAsRelax = false;
          }
          output.push(token2);
        }
      }
      this.countExpansion(output.length);
      return output;
    }
    /**
     * Fully expand the given macro name and return the result as a string,
     * or return `undefined` if no such macro is defined.
     */
    expandMacroAsText(name) {
      var tokens = this.expandMacro(name);
      if (tokens) {
        return tokens.map((token2) => token2.text).join("");
      } else {
        return tokens;
      }
    }
    /**
     * Returns the expanded macro as a reversed array of tokens and a macro
     * argument count.  Or returns `null` if no such macro.
     */
    _getExpansion(name) {
      var definition = this.macros.get(name);
      if (definition == null) {
        return definition;
      }
      if (name.length === 1) {
        var catcode = this.lexer.catcodes[name];
        if (catcode != null && catcode !== 13) {
          return;
        }
      }
      var expansion = typeof definition === "function" ? definition(this) : definition;
      if (typeof expansion === "string") {
        var numArgs = 0;
        if (expansion.indexOf("#") !== -1) {
          var stripped = expansion.replace(/##/g, "");
          while (stripped.indexOf("#" + (numArgs + 1)) !== -1) {
            ++numArgs;
          }
        }
        var bodyLexer = new Lexer(expansion, this.settings);
        var tokens = [];
        var tok = bodyLexer.lex();
        while (tok.text !== "EOF") {
          tokens.push(tok);
          tok = bodyLexer.lex();
        }
        tokens.reverse();
        var expanded = {
          tokens,
          numArgs
        };
        return expanded;
      }
      return expansion;
    }
    /**
     * Determine whether a command is currently "defined" (has some
     * functionality), meaning that it's a macro (in the current group),
     * a function, a symbol, or one of the special commands listed in
     * `implicitCommands`.
     */
    isDefined(name) {
      return this.macros.has(name) || functions.hasOwnProperty(name) || symbols.math.hasOwnProperty(name) || symbols.text.hasOwnProperty(name) || implicitCommands.hasOwnProperty(name);
    }
    /**
     * Determine whether a command is expandable.
     */
    isExpandable(name) {
      var macro = this.macros.get(name);
      return macro != null ? typeof macro === "string" || typeof macro === "function" || !macro.unexpandable : functions.hasOwnProperty(name) && !functions[name].primitive;
    }
  };
  var unicodeSubRegEx = /^[₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ]/;
  var uSubsAndSups = Object.freeze({
    "\u208A": "+",
    "\u208B": "-",
    "\u208C": "=",
    "\u208D": "(",
    "\u208E": ")",
    "\u2080": "0",
    "\u2081": "1",
    "\u2082": "2",
    "\u2083": "3",
    "\u2084": "4",
    "\u2085": "5",
    "\u2086": "6",
    "\u2087": "7",
    "\u2088": "8",
    "\u2089": "9",
    "\u2090": "a",
    "\u2091": "e",
    "\u2095": "h",
    "\u1D62": "i",
    "\u2C7C": "j",
    "\u2096": "k",
    "\u2097": "l",
    "\u2098": "m",
    "\u2099": "n",
    "\u2092": "o",
    "\u209A": "p",
    "\u1D63": "r",
    "\u209B": "s",
    "\u209C": "t",
    "\u1D64": "u",
    "\u1D65": "v",
    "\u2093": "x",
    "\u1D66": "\u03B2",
    "\u1D67": "\u03B3",
    "\u1D68": "\u03C1",
    "\u1D69": "\u03D5",
    "\u1D6A": "\u03C7",
    "\u207A": "+",
    "\u207B": "-",
    "\u207C": "=",
    "\u207D": "(",
    "\u207E": ")",
    "\u2070": "0",
    "\xB9": "1",
    "\xB2": "2",
    "\xB3": "3",
    "\u2074": "4",
    "\u2075": "5",
    "\u2076": "6",
    "\u2077": "7",
    "\u2078": "8",
    "\u2079": "9",
    "\u1D2C": "A",
    "\u1D2E": "B",
    "\u1D30": "D",
    "\u1D31": "E",
    "\u1D33": "G",
    "\u1D34": "H",
    "\u1D35": "I",
    "\u1D36": "J",
    "\u1D37": "K",
    "\u1D38": "L",
    "\u1D39": "M",
    "\u1D3A": "N",
    "\u1D3C": "O",
    "\u1D3E": "P",
    "\u1D3F": "R",
    "\u1D40": "T",
    "\u1D41": "U",
    "\u2C7D": "V",
    "\u1D42": "W",
    "\u1D43": "a",
    "\u1D47": "b",
    "\u1D9C": "c",
    "\u1D48": "d",
    "\u1D49": "e",
    "\u1DA0": "f",
    "\u1D4D": "g",
    "\u02B0": "h",
    "\u2071": "i",
    "\u02B2": "j",
    "\u1D4F": "k",
    "\u02E1": "l",
    "\u1D50": "m",
    "\u207F": "n",
    "\u1D52": "o",
    "\u1D56": "p",
    "\u02B3": "r",
    "\u02E2": "s",
    "\u1D57": "t",
    "\u1D58": "u",
    "\u1D5B": "v",
    "\u02B7": "w",
    "\u02E3": "x",
    "\u02B8": "y",
    "\u1DBB": "z",
    "\u1D5D": "\u03B2",
    "\u1D5E": "\u03B3",
    "\u1D5F": "\u03B4",
    "\u1D60": "\u03D5",
    "\u1D61": "\u03C7",
    "\u1DBF": "\u03B8"
  });
  var unicodeAccents = {
    "\u0301": {
      "text": "\\'",
      "math": "\\acute"
    },
    "\u0300": {
      "text": "\\`",
      "math": "\\grave"
    },
    "\u0308": {
      "text": '\\"',
      "math": "\\ddot"
    },
    "\u0303": {
      "text": "\\~",
      "math": "\\tilde"
    },
    "\u0304": {
      "text": "\\=",
      "math": "\\bar"
    },
    "\u0306": {
      "text": "\\u",
      "math": "\\breve"
    },
    "\u030C": {
      "text": "\\v",
      "math": "\\check"
    },
    "\u0302": {
      "text": "\\^",
      "math": "\\hat"
    },
    "\u0307": {
      "text": "\\.",
      "math": "\\dot"
    },
    "\u030A": {
      "text": "\\r",
      "math": "\\mathring"
    },
    "\u030B": {
      "text": "\\H"
    },
    "\u0327": {
      "text": "\\c"
    }
  };
  var unicodeSymbols = {
    "\xE1": "a\u0301",
    "\xE0": "a\u0300",
    "\xE4": "a\u0308",
    "\u01DF": "a\u0308\u0304",
    "\xE3": "a\u0303",
    "\u0101": "a\u0304",
    "\u0103": "a\u0306",
    "\u1EAF": "a\u0306\u0301",
    "\u1EB1": "a\u0306\u0300",
    "\u1EB5": "a\u0306\u0303",
    "\u01CE": "a\u030C",
    "\xE2": "a\u0302",
    "\u1EA5": "a\u0302\u0301",
    "\u1EA7": "a\u0302\u0300",
    "\u1EAB": "a\u0302\u0303",
    "\u0227": "a\u0307",
    "\u01E1": "a\u0307\u0304",
    "\xE5": "a\u030A",
    "\u01FB": "a\u030A\u0301",
    "\u1E03": "b\u0307",
    "\u0107": "c\u0301",
    "\u1E09": "c\u0327\u0301",
    "\u010D": "c\u030C",
    "\u0109": "c\u0302",
    "\u010B": "c\u0307",
    "\xE7": "c\u0327",
    "\u010F": "d\u030C",
    "\u1E0B": "d\u0307",
    "\u1E11": "d\u0327",
    "\xE9": "e\u0301",
    "\xE8": "e\u0300",
    "\xEB": "e\u0308",
    "\u1EBD": "e\u0303",
    "\u0113": "e\u0304",
    "\u1E17": "e\u0304\u0301",
    "\u1E15": "e\u0304\u0300",
    "\u0115": "e\u0306",
    "\u1E1D": "e\u0327\u0306",
    "\u011B": "e\u030C",
    "\xEA": "e\u0302",
    "\u1EBF": "e\u0302\u0301",
    "\u1EC1": "e\u0302\u0300",
    "\u1EC5": "e\u0302\u0303",
    "\u0117": "e\u0307",
    "\u0229": "e\u0327",
    "\u1E1F": "f\u0307",
    "\u01F5": "g\u0301",
    "\u1E21": "g\u0304",
    "\u011F": "g\u0306",
    "\u01E7": "g\u030C",
    "\u011D": "g\u0302",
    "\u0121": "g\u0307",
    "\u0123": "g\u0327",
    "\u1E27": "h\u0308",
    "\u021F": "h\u030C",
    "\u0125": "h\u0302",
    "\u1E23": "h\u0307",
    "\u1E29": "h\u0327",
    "\xED": "i\u0301",
    "\xEC": "i\u0300",
    "\xEF": "i\u0308",
    "\u1E2F": "i\u0308\u0301",
    "\u0129": "i\u0303",
    "\u012B": "i\u0304",
    "\u012D": "i\u0306",
    "\u01D0": "i\u030C",
    "\xEE": "i\u0302",
    "\u01F0": "j\u030C",
    "\u0135": "j\u0302",
    "\u1E31": "k\u0301",
    "\u01E9": "k\u030C",
    "\u0137": "k\u0327",
    "\u013A": "l\u0301",
    "\u013E": "l\u030C",
    "\u013C": "l\u0327",
    "\u1E3F": "m\u0301",
    "\u1E41": "m\u0307",
    "\u0144": "n\u0301",
    "\u01F9": "n\u0300",
    "\xF1": "n\u0303",
    "\u0148": "n\u030C",
    "\u1E45": "n\u0307",
    "\u0146": "n\u0327",
    "\xF3": "o\u0301",
    "\xF2": "o\u0300",
    "\xF6": "o\u0308",
    "\u022B": "o\u0308\u0304",
    "\xF5": "o\u0303",
    "\u1E4D": "o\u0303\u0301",
    "\u1E4F": "o\u0303\u0308",
    "\u022D": "o\u0303\u0304",
    "\u014D": "o\u0304",
    "\u1E53": "o\u0304\u0301",
    "\u1E51": "o\u0304\u0300",
    "\u014F": "o\u0306",
    "\u01D2": "o\u030C",
    "\xF4": "o\u0302",
    "\u1ED1": "o\u0302\u0301",
    "\u1ED3": "o\u0302\u0300",
    "\u1ED7": "o\u0302\u0303",
    "\u022F": "o\u0307",
    "\u0231": "o\u0307\u0304",
    "\u0151": "o\u030B",
    "\u1E55": "p\u0301",
    "\u1E57": "p\u0307",
    "\u0155": "r\u0301",
    "\u0159": "r\u030C",
    "\u1E59": "r\u0307",
    "\u0157": "r\u0327",
    "\u015B": "s\u0301",
    "\u1E65": "s\u0301\u0307",
    "\u0161": "s\u030C",
    "\u1E67": "s\u030C\u0307",
    "\u015D": "s\u0302",
    "\u1E61": "s\u0307",
    "\u015F": "s\u0327",
    "\u1E97": "t\u0308",
    "\u0165": "t\u030C",
    "\u1E6B": "t\u0307",
    "\u0163": "t\u0327",
    "\xFA": "u\u0301",
    "\xF9": "u\u0300",
    "\xFC": "u\u0308",
    "\u01D8": "u\u0308\u0301",
    "\u01DC": "u\u0308\u0300",
    "\u01D6": "u\u0308\u0304",
    "\u01DA": "u\u0308\u030C",
    "\u0169": "u\u0303",
    "\u1E79": "u\u0303\u0301",
    "\u016B": "u\u0304",
    "\u1E7B": "u\u0304\u0308",
    "\u016D": "u\u0306",
    "\u01D4": "u\u030C",
    "\xFB": "u\u0302",
    "\u016F": "u\u030A",
    "\u0171": "u\u030B",
    "\u1E7D": "v\u0303",
    "\u1E83": "w\u0301",
    "\u1E81": "w\u0300",
    "\u1E85": "w\u0308",
    "\u0175": "w\u0302",
    "\u1E87": "w\u0307",
    "\u1E98": "w\u030A",
    "\u1E8D": "x\u0308",
    "\u1E8B": "x\u0307",
    "\xFD": "y\u0301",
    "\u1EF3": "y\u0300",
    "\xFF": "y\u0308",
    "\u1EF9": "y\u0303",
    "\u0233": "y\u0304",
    "\u0177": "y\u0302",
    "\u1E8F": "y\u0307",
    "\u1E99": "y\u030A",
    "\u017A": "z\u0301",
    "\u017E": "z\u030C",
    "\u1E91": "z\u0302",
    "\u017C": "z\u0307",
    "\xC1": "A\u0301",
    "\xC0": "A\u0300",
    "\xC4": "A\u0308",
    "\u01DE": "A\u0308\u0304",
    "\xC3": "A\u0303",
    "\u0100": "A\u0304",
    "\u0102": "A\u0306",
    "\u1EAE": "A\u0306\u0301",
    "\u1EB0": "A\u0306\u0300",
    "\u1EB4": "A\u0306\u0303",
    "\u01CD": "A\u030C",
    "\xC2": "A\u0302",
    "\u1EA4": "A\u0302\u0301",
    "\u1EA6": "A\u0302\u0300",
    "\u1EAA": "A\u0302\u0303",
    "\u0226": "A\u0307",
    "\u01E0": "A\u0307\u0304",
    "\xC5": "A\u030A",
    "\u01FA": "A\u030A\u0301",
    "\u1E02": "B\u0307",
    "\u0106": "C\u0301",
    "\u1E08": "C\u0327\u0301",
    "\u010C": "C\u030C",
    "\u0108": "C\u0302",
    "\u010A": "C\u0307",
    "\xC7": "C\u0327",
    "\u010E": "D\u030C",
    "\u1E0A": "D\u0307",
    "\u1E10": "D\u0327",
    "\xC9": "E\u0301",
    "\xC8": "E\u0300",
    "\xCB": "E\u0308",
    "\u1EBC": "E\u0303",
    "\u0112": "E\u0304",
    "\u1E16": "E\u0304\u0301",
    "\u1E14": "E\u0304\u0300",
    "\u0114": "E\u0306",
    "\u1E1C": "E\u0327\u0306",
    "\u011A": "E\u030C",
    "\xCA": "E\u0302",
    "\u1EBE": "E\u0302\u0301",
    "\u1EC0": "E\u0302\u0300",
    "\u1EC4": "E\u0302\u0303",
    "\u0116": "E\u0307",
    "\u0228": "E\u0327",
    "\u1E1E": "F\u0307",
    "\u01F4": "G\u0301",
    "\u1E20": "G\u0304",
    "\u011E": "G\u0306",
    "\u01E6": "G\u030C",
    "\u011C": "G\u0302",
    "\u0120": "G\u0307",
    "\u0122": "G\u0327",
    "\u1E26": "H\u0308",
    "\u021E": "H\u030C",
    "\u0124": "H\u0302",
    "\u1E22": "H\u0307",
    "\u1E28": "H\u0327",
    "\xCD": "I\u0301",
    "\xCC": "I\u0300",
    "\xCF": "I\u0308",
    "\u1E2E": "I\u0308\u0301",
    "\u0128": "I\u0303",
    "\u012A": "I\u0304",
    "\u012C": "I\u0306",
    "\u01CF": "I\u030C",
    "\xCE": "I\u0302",
    "\u0130": "I\u0307",
    "\u0134": "J\u0302",
    "\u1E30": "K\u0301",
    "\u01E8": "K\u030C",
    "\u0136": "K\u0327",
    "\u0139": "L\u0301",
    "\u013D": "L\u030C",
    "\u013B": "L\u0327",
    "\u1E3E": "M\u0301",
    "\u1E40": "M\u0307",
    "\u0143": "N\u0301",
    "\u01F8": "N\u0300",
    "\xD1": "N\u0303",
    "\u0147": "N\u030C",
    "\u1E44": "N\u0307",
    "\u0145": "N\u0327",
    "\xD3": "O\u0301",
    "\xD2": "O\u0300",
    "\xD6": "O\u0308",
    "\u022A": "O\u0308\u0304",
    "\xD5": "O\u0303",
    "\u1E4C": "O\u0303\u0301",
    "\u1E4E": "O\u0303\u0308",
    "\u022C": "O\u0303\u0304",
    "\u014C": "O\u0304",
    "\u1E52": "O\u0304\u0301",
    "\u1E50": "O\u0304\u0300",
    "\u014E": "O\u0306",
    "\u01D1": "O\u030C",
    "\xD4": "O\u0302",
    "\u1ED0": "O\u0302\u0301",
    "\u1ED2": "O\u0302\u0300",
    "\u1ED6": "O\u0302\u0303",
    "\u022E": "O\u0307",
    "\u0230": "O\u0307\u0304",
    "\u0150": "O\u030B",
    "\u1E54": "P\u0301",
    "\u1E56": "P\u0307",
    "\u0154": "R\u0301",
    "\u0158": "R\u030C",
    "\u1E58": "R\u0307",
    "\u0156": "R\u0327",
    "\u015A": "S\u0301",
    "\u1E64": "S\u0301\u0307",
    "\u0160": "S\u030C",
    "\u1E66": "S\u030C\u0307",
    "\u015C": "S\u0302",
    "\u1E60": "S\u0307",
    "\u015E": "S\u0327",
    "\u0164": "T\u030C",
    "\u1E6A": "T\u0307",
    "\u0162": "T\u0327",
    "\xDA": "U\u0301",
    "\xD9": "U\u0300",
    "\xDC": "U\u0308",
    "\u01D7": "U\u0308\u0301",
    "\u01DB": "U\u0308\u0300",
    "\u01D5": "U\u0308\u0304",
    "\u01D9": "U\u0308\u030C",
    "\u0168": "U\u0303",
    "\u1E78": "U\u0303\u0301",
    "\u016A": "U\u0304",
    "\u1E7A": "U\u0304\u0308",
    "\u016C": "U\u0306",
    "\u01D3": "U\u030C",
    "\xDB": "U\u0302",
    "\u016E": "U\u030A",
    "\u0170": "U\u030B",
    "\u1E7C": "V\u0303",
    "\u1E82": "W\u0301",
    "\u1E80": "W\u0300",
    "\u1E84": "W\u0308",
    "\u0174": "W\u0302",
    "\u1E86": "W\u0307",
    "\u1E8C": "X\u0308",
    "\u1E8A": "X\u0307",
    "\xDD": "Y\u0301",
    "\u1EF2": "Y\u0300",
    "\u0178": "Y\u0308",
    "\u1EF8": "Y\u0303",
    "\u0232": "Y\u0304",
    "\u0176": "Y\u0302",
    "\u1E8E": "Y\u0307",
    "\u0179": "Z\u0301",
    "\u017D": "Z\u030C",
    "\u1E90": "Z\u0302",
    "\u017B": "Z\u0307",
    "\u03AC": "\u03B1\u0301",
    "\u1F70": "\u03B1\u0300",
    "\u1FB1": "\u03B1\u0304",
    "\u1FB0": "\u03B1\u0306",
    "\u03AD": "\u03B5\u0301",
    "\u1F72": "\u03B5\u0300",
    "\u03AE": "\u03B7\u0301",
    "\u1F74": "\u03B7\u0300",
    "\u03AF": "\u03B9\u0301",
    "\u1F76": "\u03B9\u0300",
    "\u03CA": "\u03B9\u0308",
    "\u0390": "\u03B9\u0308\u0301",
    "\u1FD2": "\u03B9\u0308\u0300",
    "\u1FD1": "\u03B9\u0304",
    "\u1FD0": "\u03B9\u0306",
    "\u03CC": "\u03BF\u0301",
    "\u1F78": "\u03BF\u0300",
    "\u03CD": "\u03C5\u0301",
    "\u1F7A": "\u03C5\u0300",
    "\u03CB": "\u03C5\u0308",
    "\u03B0": "\u03C5\u0308\u0301",
    "\u1FE2": "\u03C5\u0308\u0300",
    "\u1FE1": "\u03C5\u0304",
    "\u1FE0": "\u03C5\u0306",
    "\u03CE": "\u03C9\u0301",
    "\u1F7C": "\u03C9\u0300",
    "\u038E": "\u03A5\u0301",
    "\u1FEA": "\u03A5\u0300",
    "\u03AB": "\u03A5\u0308",
    "\u1FE9": "\u03A5\u0304",
    "\u1FE8": "\u03A5\u0306",
    "\u038F": "\u03A9\u0301",
    "\u1FFA": "\u03A9\u0300"
  };
  var Parser = class _Parser {
    constructor(input, settings) {
      this.mode = void 0;
      this.gullet = void 0;
      this.settings = void 0;
      this.leftrightDepth = void 0;
      this.nextToken = void 0;
      this.mode = "math";
      this.gullet = new MacroExpander(input, settings, this.mode);
      this.settings = settings;
      this.leftrightDepth = 0;
    }
    /**
     * Checks a result to make sure it has the right type, and throws an
     * appropriate error otherwise.
     */
    expect(text3, consume) {
      if (consume === void 0) {
        consume = true;
      }
      if (this.fetch().text !== text3) {
        throw new ParseError("Expected '" + text3 + "', got '" + this.fetch().text + "'", this.fetch());
      }
      if (consume) {
        this.consume();
      }
    }
    /**
     * Discards the current lookahead token, considering it consumed.
     */
    consume() {
      this.nextToken = null;
    }
    /**
     * Return the current lookahead token, or if there isn't one (at the
     * beginning, or if the previous lookahead token was consume()d),
     * fetch the next token as the new lookahead token and return it.
     */
    fetch() {
      if (this.nextToken == null) {
        this.nextToken = this.gullet.expandNextToken();
      }
      return this.nextToken;
    }
    /**
     * Switches between "text" and "math" modes.
     */
    switchMode(newMode) {
      this.mode = newMode;
      this.gullet.switchMode(newMode);
    }
    /**
     * Main parsing function, which parses an entire input.
     */
    parse() {
      if (!this.settings.globalGroup) {
        this.gullet.beginGroup();
      }
      if (this.settings.colorIsTextColor) {
        this.gullet.macros.set("\\color", "\\textcolor");
      }
      try {
        var parse = this.parseExpression(false);
        this.expect("EOF");
        if (!this.settings.globalGroup) {
          this.gullet.endGroup();
        }
        return parse;
      } finally {
        this.gullet.endGroups();
      }
    }
    /**
     * Fully parse a separate sequence of tokens as a separate job.
     * Tokens should be specified in reverse order, as in a MacroDefinition.
     */
    subparse(tokens) {
      var oldToken = this.nextToken;
      this.consume();
      this.gullet.pushToken(new Token("}"));
      this.gullet.pushTokens(tokens);
      var parse = this.parseExpression(false);
      this.expect("}");
      this.nextToken = oldToken;
      return parse;
    }
    /**
     * Parses an "expression", which is a list of atoms.
     *
     * `breakOnInfix`: Should the parsing stop when we hit infix nodes? This
     *                 happens when functions have higher precedence than infix
     *                 nodes in implicit parses.
     *
     * `breakOnTokenText`: The text of the token that the expression should end
     *                     with, or `null` if something else should end the
     *                     expression.
     */
    parseExpression(breakOnInfix, breakOnTokenText) {
      var body3 = [];
      while (true) {
        if (this.mode === "math") {
          this.consumeSpaces();
        }
        var lex = this.fetch();
        if (_Parser.endOfExpression.indexOf(lex.text) !== -1) {
          break;
        }
        if (breakOnTokenText && lex.text === breakOnTokenText) {
          break;
        }
        if (breakOnInfix && functions[lex.text] && functions[lex.text].infix) {
          break;
        }
        var atom = this.parseAtom(breakOnTokenText);
        if (!atom) {
          break;
        } else if (atom.type === "internal") {
          continue;
        }
        body3.push(atom);
      }
      if (this.mode === "text") {
        this.formLigatures(body3);
      }
      return this.handleInfixNodes(body3);
    }
    /**
     * Rewrites infix operators such as \over with corresponding commands such
     * as \frac.
     *
     * There can only be one infix operator per group.  If there's more than one
     * then the expression is ambiguous.  This can be resolved by adding {}.
     */
    handleInfixNodes(body3) {
      var overIndex = -1;
      var funcName;
      for (var i2 = 0; i2 < body3.length; i2++) {
        if (body3[i2].type === "infix") {
          if (overIndex !== -1) {
            throw new ParseError("only one infix operator per group", body3[i2].token);
          }
          overIndex = i2;
          funcName = body3[i2].replaceWith;
        }
      }
      if (overIndex !== -1 && funcName) {
        var numerNode;
        var denomNode;
        var numerBody = body3.slice(0, overIndex);
        var denomBody = body3.slice(overIndex + 1);
        if (numerBody.length === 1 && numerBody[0].type === "ordgroup") {
          numerNode = numerBody[0];
        } else {
          numerNode = {
            type: "ordgroup",
            mode: this.mode,
            body: numerBody
          };
        }
        if (denomBody.length === 1 && denomBody[0].type === "ordgroup") {
          denomNode = denomBody[0];
        } else {
          denomNode = {
            type: "ordgroup",
            mode: this.mode,
            body: denomBody
          };
        }
        var node;
        if (funcName === "\\\\abovefrac") {
          node = this.callFunction(funcName, [numerNode, body3[overIndex], denomNode], []);
        } else {
          node = this.callFunction(funcName, [numerNode, denomNode], []);
        }
        return [node];
      } else {
        return body3;
      }
    }
    /**
     * Handle a subscript or superscript with nice errors.
     */
    handleSupSubscript(name) {
      var symbolToken = this.fetch();
      var symbol = symbolToken.text;
      this.consume();
      this.consumeSpaces();
      var group;
      do {
        var _group;
        group = this.parseGroup(name);
      } while (((_group = group) == null ? void 0 : _group.type) === "internal");
      if (!group) {
        throw new ParseError("Expected group after '" + symbol + "'", symbolToken);
      }
      return group;
    }
    /**
     * Converts the textual input of an unsupported command into a text node
     * contained within a color node whose color is determined by errorColor
     */
    formatUnsupportedCmd(text3) {
      var textordArray = [];
      for (var i2 = 0; i2 < text3.length; i2++) {
        textordArray.push({
          type: "textord",
          mode: "text",
          text: text3[i2]
        });
      }
      var textNode = {
        type: "text",
        mode: this.mode,
        body: textordArray
      };
      var colorNode = {
        type: "color",
        mode: this.mode,
        color: this.settings.errorColor,
        body: [textNode]
      };
      return colorNode;
    }
    /**
     * Parses a group with optional super/subscripts.
     */
    parseAtom(breakOnTokenText) {
      var base = this.parseGroup("atom", breakOnTokenText);
      if ((base == null ? void 0 : base.type) === "internal") {
        return base;
      }
      if (this.mode === "text") {
        return base;
      }
      var superscript;
      var subscript;
      while (true) {
        this.consumeSpaces();
        var lex = this.fetch();
        if (lex.text === "\\limits" || lex.text === "\\nolimits") {
          if (base && base.type === "op") {
            var limits = lex.text === "\\limits";
            base.limits = limits;
            base.alwaysHandleSupSub = true;
          } else if (base && base.type === "operatorname") {
            if (base.alwaysHandleSupSub) {
              base.limits = lex.text === "\\limits";
            }
          } else {
            throw new ParseError("Limit controls must follow a math operator", lex);
          }
          this.consume();
        } else if (lex.text === "^") {
          if (superscript) {
            throw new ParseError("Double superscript", lex);
          }
          superscript = this.handleSupSubscript("superscript");
        } else if (lex.text === "_") {
          if (subscript) {
            throw new ParseError("Double subscript", lex);
          }
          subscript = this.handleSupSubscript("subscript");
        } else if (lex.text === "'") {
          if (superscript) {
            throw new ParseError("Double superscript", lex);
          }
          var prime = {
            type: "textord",
            mode: this.mode,
            text: "\\prime"
          };
          var primes = [prime];
          this.consume();
          while (this.fetch().text === "'") {
            primes.push(prime);
            this.consume();
          }
          if (this.fetch().text === "^") {
            primes.push(this.handleSupSubscript("superscript"));
          }
          superscript = {
            type: "ordgroup",
            mode: this.mode,
            body: primes
          };
        } else if (uSubsAndSups[lex.text]) {
          var isSub = unicodeSubRegEx.test(lex.text);
          var subsupTokens = [];
          subsupTokens.push(new Token(uSubsAndSups[lex.text]));
          this.consume();
          while (true) {
            var token2 = this.fetch().text;
            if (!uSubsAndSups[token2]) {
              break;
            }
            if (unicodeSubRegEx.test(token2) !== isSub) {
              break;
            }
            subsupTokens.unshift(new Token(uSubsAndSups[token2]));
            this.consume();
          }
          var body3 = this.subparse(subsupTokens);
          if (isSub) {
            subscript = {
              type: "ordgroup",
              mode: "math",
              body: body3
            };
          } else {
            superscript = {
              type: "ordgroup",
              mode: "math",
              body: body3
            };
          }
        } else {
          break;
        }
      }
      if (superscript || subscript) {
        return {
          type: "supsub",
          mode: this.mode,
          base,
          sup: superscript,
          sub: subscript
        };
      } else {
        return base;
      }
    }
    /**
     * Parses an entire function, including its base and all of its arguments.
     */
    parseFunction(breakOnTokenText, name) {
      var token2 = this.fetch();
      var func = token2.text;
      var funcData = functions[func];
      if (!funcData) {
        return null;
      }
      this.consume();
      if (name && name !== "atom" && !funcData.allowedInArgument) {
        throw new ParseError("Got function '" + func + "' with no arguments" + (name ? " as " + name : ""), token2);
      } else if (this.mode === "text" && !funcData.allowedInText) {
        throw new ParseError("Can't use function '" + func + "' in text mode", token2);
      } else if (this.mode === "math" && funcData.allowedInMath === false) {
        throw new ParseError("Can't use function '" + func + "' in math mode", token2);
      }
      var {
        args,
        optArgs
      } = this.parseArguments(func, funcData);
      return this.callFunction(func, args, optArgs, token2, breakOnTokenText);
    }
    /**
     * Call a function handler with a suitable context and arguments.
     */
    callFunction(name, args, optArgs, token2, breakOnTokenText) {
      var context = {
        funcName: name,
        parser: this,
        token: token2,
        breakOnTokenText
      };
      var func = functions[name];
      if (func && func.handler) {
        return func.handler(context, args, optArgs);
      } else {
        throw new ParseError("No function handler for " + name);
      }
    }
    /**
     * Parses the arguments of a function or environment
     */
    parseArguments(func, funcData) {
      var totalArgs = funcData.numArgs + funcData.numOptionalArgs;
      if (totalArgs === 0) {
        return {
          args: [],
          optArgs: []
        };
      }
      var args = [];
      var optArgs = [];
      for (var i2 = 0; i2 < totalArgs; i2++) {
        var argType = funcData.argTypes && funcData.argTypes[i2];
        var isOptional = i2 < funcData.numOptionalArgs;
        if (funcData.primitive && argType == null || // \sqrt expands into primitive if optional argument doesn't exist
        funcData.type === "sqrt" && i2 === 1 && optArgs[0] == null) {
          argType = "primitive";
        }
        var arg = this.parseGroupOfType("argument to '" + func + "'", argType, isOptional);
        if (isOptional) {
          optArgs.push(arg);
        } else if (arg != null) {
          args.push(arg);
        } else {
          throw new ParseError("Null argument, please report this as a bug");
        }
      }
      return {
        args,
        optArgs
      };
    }
    /**
     * Parses a group when the mode is changing.
     */
    parseGroupOfType(name, type, optional) {
      switch (type) {
        case "color":
          return this.parseColorGroup(optional);
        case "size":
          return this.parseSizeGroup(optional);
        case "url":
          return this.parseUrlGroup(optional);
        case "math":
        case "text":
          return this.parseArgumentGroup(optional, type);
        case "hbox": {
          var group = this.parseArgumentGroup(optional, "text");
          return group != null ? {
            type: "styling",
            mode: group.mode,
            body: [group],
            style: "text"
            // simulate \textstyle
          } : null;
        }
        case "raw": {
          var token2 = this.parseStringGroup("raw", optional);
          return token2 != null ? {
            type: "raw",
            mode: "text",
            string: token2.text
          } : null;
        }
        case "primitive": {
          if (optional) {
            throw new ParseError("A primitive argument cannot be optional");
          }
          var _group2 = this.parseGroup(name);
          if (_group2 == null) {
            throw new ParseError("Expected group as " + name, this.fetch());
          }
          return _group2;
        }
        case "original":
        case null:
        case void 0:
          return this.parseArgumentGroup(optional);
        default:
          throw new ParseError("Unknown group type as " + name, this.fetch());
      }
    }
    /**
     * Discard any space tokens, fetching the next non-space token.
     */
    consumeSpaces() {
      while (this.fetch().text === " ") {
        this.consume();
      }
    }
    /**
     * Parses a group, essentially returning the string formed by the
     * brace-enclosed tokens plus some position information.
     */
    parseStringGroup(modeName, optional) {
      var argToken = this.gullet.scanArgument(optional);
      if (argToken == null) {
        return null;
      }
      var str = "";
      var nextToken;
      while ((nextToken = this.fetch()).text !== "EOF") {
        str += nextToken.text;
        this.consume();
      }
      this.consume();
      argToken.text = str;
      return argToken;
    }
    /**
     * Parses a regex-delimited group: the largest sequence of tokens
     * whose concatenated strings match `regex`. Returns the string
     * formed by the tokens plus some position information.
     */
    parseRegexGroup(regex, modeName) {
      var firstToken = this.fetch();
      var lastToken = firstToken;
      var str = "";
      var nextToken;
      while ((nextToken = this.fetch()).text !== "EOF" && regex.test(str + nextToken.text)) {
        lastToken = nextToken;
        str += lastToken.text;
        this.consume();
      }
      if (str === "") {
        throw new ParseError("Invalid " + modeName + ": '" + firstToken.text + "'", firstToken);
      }
      return firstToken.range(lastToken, str);
    }
    /**
     * Parses a color description.
     */
    parseColorGroup(optional) {
      var res = this.parseStringGroup("color", optional);
      if (res == null) {
        return null;
      }
      var match = /^(#[a-f0-9]{3,4}|#[a-f0-9]{6}|#[a-f0-9]{8}|[a-f0-9]{6}|[a-z]+)$/i.exec(res.text);
      if (!match) {
        throw new ParseError("Invalid color: '" + res.text + "'", res);
      }
      var color = match[0];
      if (/^[0-9a-f]{6}$/i.test(color)) {
        color = "#" + color;
      }
      return {
        type: "color-token",
        mode: this.mode,
        color
      };
    }
    /**
     * Parses a size specification, consisting of magnitude and unit.
     */
    parseSizeGroup(optional) {
      var res;
      var isBlank = false;
      this.gullet.consumeSpaces();
      if (!optional && this.gullet.future().text !== "{") {
        res = this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/, "size");
      } else {
        res = this.parseStringGroup("size", optional);
      }
      if (!res) {
        return null;
      }
      if (!optional && res.text.length === 0) {
        res.text = "0pt";
        isBlank = true;
      }
      var match = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(res.text);
      if (!match) {
        throw new ParseError("Invalid size: '" + res.text + "'", res);
      }
      var data = {
        number: +(match[1] + match[2]),
        // sign + magnitude, cast to number
        unit: match[3]
      };
      if (!validUnit(data)) {
        throw new ParseError("Invalid unit: '" + data.unit + "'", res);
      }
      return {
        type: "size",
        mode: this.mode,
        value: data,
        isBlank
      };
    }
    /**
     * Parses an URL, checking escaped letters and allowed protocols,
     * and setting the catcode of % as an active character (as in \hyperref).
     */
    parseUrlGroup(optional) {
      this.gullet.lexer.setCatcode("%", 13);
      this.gullet.lexer.setCatcode("~", 12);
      var res = this.parseStringGroup("url", optional);
      this.gullet.lexer.setCatcode("%", 14);
      this.gullet.lexer.setCatcode("~", 13);
      if (res == null) {
        return null;
      }
      var url = res.text.replace(/\\([#$%&~_^{}])/g, "$1");
      return {
        type: "url",
        mode: this.mode,
        url
      };
    }
    /**
     * Parses an argument with the mode specified.
     */
    parseArgumentGroup(optional, mode) {
      var argToken = this.gullet.scanArgument(optional);
      if (argToken == null) {
        return null;
      }
      var outerMode = this.mode;
      if (mode) {
        this.switchMode(mode);
      }
      this.gullet.beginGroup();
      var expression = this.parseExpression(false, "EOF");
      this.expect("EOF");
      this.gullet.endGroup();
      var result = {
        type: "ordgroup",
        mode: this.mode,
        loc: argToken.loc,
        body: expression
      };
      if (mode) {
        this.switchMode(outerMode);
      }
      return result;
    }
    /**
     * Parses an ordinary group, which is either a single nucleus (like "x")
     * or an expression in braces (like "{x+y}") or an implicit group, a group
     * that starts at the current position, and ends right before a higher explicit
     * group ends, or at EOF.
     */
    parseGroup(name, breakOnTokenText) {
      var firstToken = this.fetch();
      var text3 = firstToken.text;
      var result;
      if (text3 === "{" || text3 === "\\begingroup") {
        this.consume();
        var groupEnd = text3 === "{" ? "}" : "\\endgroup";
        this.gullet.beginGroup();
        var expression = this.parseExpression(false, groupEnd);
        var lastToken = this.fetch();
        this.expect(groupEnd);
        this.gullet.endGroup();
        result = {
          type: "ordgroup",
          mode: this.mode,
          loc: SourceLocation.range(firstToken, lastToken),
          body: expression,
          // A group formed by \begingroup...\endgroup is a semi-simple group
          // which doesn't affect spacing in math mode, i.e., is transparent.
          // https://tex.stackexchange.com/questions/1930/when-should-one-
          // use-begingroup-instead-of-bgroup
          semisimple: text3 === "\\begingroup" || void 0
        };
      } else {
        result = this.parseFunction(breakOnTokenText, name) || this.parseSymbol();
        if (result == null && text3[0] === "\\" && !implicitCommands.hasOwnProperty(text3)) {
          if (this.settings.throwOnError) {
            throw new ParseError("Undefined control sequence: " + text3, firstToken);
          }
          result = this.formatUnsupportedCmd(text3);
          this.consume();
        }
      }
      return result;
    }
    /**
     * Form ligature-like combinations of characters for text mode.
     * This includes inputs like "--", "---", "``" and "''".
     * The result will simply replace multiple textord nodes with a single
     * character in each value by a single textord node having multiple
     * characters in its value.  The representation is still ASCII source.
     * The group will be modified in place.
     */
    formLigatures(group) {
      var n = group.length - 1;
      for (var i2 = 0; i2 < n; ++i2) {
        var a2 = group[i2];
        var v3 = a2.text;
        if (v3 === "-" && group[i2 + 1].text === "-") {
          if (i2 + 1 < n && group[i2 + 2].text === "-") {
            group.splice(i2, 3, {
              type: "textord",
              mode: "text",
              loc: SourceLocation.range(a2, group[i2 + 2]),
              text: "---"
            });
            n -= 2;
          } else {
            group.splice(i2, 2, {
              type: "textord",
              mode: "text",
              loc: SourceLocation.range(a2, group[i2 + 1]),
              text: "--"
            });
            n -= 1;
          }
        }
        if ((v3 === "'" || v3 === "`") && group[i2 + 1].text === v3) {
          group.splice(i2, 2, {
            type: "textord",
            mode: "text",
            loc: SourceLocation.range(a2, group[i2 + 1]),
            text: v3 + v3
          });
          n -= 1;
        }
      }
    }
    /**
     * Parse a single symbol out of the string. Here, we handle single character
     * symbols and special functions like \verb.
     */
    parseSymbol() {
      var nucleus = this.fetch();
      var text3 = nucleus.text;
      if (/^\\verb[^a-zA-Z]/.test(text3)) {
        this.consume();
        var arg = text3.slice(5);
        var star = arg.charAt(0) === "*";
        if (star) {
          arg = arg.slice(1);
        }
        if (arg.length < 2 || arg.charAt(0) !== arg.slice(-1)) {
          throw new ParseError("\\verb assertion failed --\n                    please report what input caused this bug");
        }
        arg = arg.slice(1, -1);
        return {
          type: "verb",
          mode: "text",
          body: arg,
          star
        };
      }
      if (unicodeSymbols.hasOwnProperty(text3[0]) && !symbols[this.mode][text3[0]]) {
        if (this.settings.strict && this.mode === "math") {
          this.settings.reportNonstrict("unicodeTextInMathMode", 'Accented Unicode text character "' + text3[0] + '" used in math mode', nucleus);
        }
        text3 = unicodeSymbols[text3[0]] + text3.slice(1);
      }
      var match = combiningDiacriticalMarksEndRegex.exec(text3);
      if (match) {
        text3 = text3.substring(0, match.index);
        if (text3 === "i") {
          text3 = "\u0131";
        } else if (text3 === "j") {
          text3 = "\u0237";
        }
      }
      var symbol;
      if (symbols[this.mode][text3]) {
        if (this.settings.strict && this.mode === "math" && extraLatin.indexOf(text3) >= 0) {
          this.settings.reportNonstrict("unicodeTextInMathMode", 'Latin-1/Unicode text character "' + text3[0] + '" used in math mode', nucleus);
        }
        var group = symbols[this.mode][text3].group;
        var loc = SourceLocation.range(nucleus);
        var s2;
        if (ATOMS.hasOwnProperty(group)) {
          var family = group;
          s2 = {
            type: "atom",
            mode: this.mode,
            family,
            loc,
            text: text3
          };
        } else {
          s2 = {
            type: group,
            mode: this.mode,
            loc,
            text: text3
          };
        }
        symbol = s2;
      } else if (text3.charCodeAt(0) >= 128) {
        if (this.settings.strict) {
          if (!supportedCodepoint(text3.charCodeAt(0))) {
            this.settings.reportNonstrict("unknownSymbol", 'Unrecognized Unicode character "' + text3[0] + '"' + (" (" + text3.charCodeAt(0) + ")"), nucleus);
          } else if (this.mode === "math") {
            this.settings.reportNonstrict("unicodeTextInMathMode", 'Unicode text character "' + text3[0] + '" used in math mode', nucleus);
          }
        }
        symbol = {
          type: "textord",
          mode: "text",
          loc: SourceLocation.range(nucleus),
          text: text3
        };
      } else {
        return null;
      }
      this.consume();
      if (match) {
        for (var i2 = 0; i2 < match[0].length; i2++) {
          var accent2 = match[0][i2];
          if (!unicodeAccents[accent2]) {
            throw new ParseError("Unknown accent ' " + accent2 + "'", nucleus);
          }
          var command = unicodeAccents[accent2][this.mode] || unicodeAccents[accent2].text;
          if (!command) {
            throw new ParseError("Accent " + accent2 + " unsupported in " + this.mode + " mode", nucleus);
          }
          symbol = {
            type: "accent",
            mode: this.mode,
            loc: SourceLocation.range(nucleus),
            label: command,
            isStretchy: false,
            isShifty: true,
            // $FlowFixMe
            base: symbol
          };
        }
      }
      return symbol;
    }
  };
  Parser.endOfExpression = ["}", "\\endgroup", "\\end", "\\right", "&"];
  var parseTree = function parseTree2(toParse, settings) {
    if (!(typeof toParse === "string" || toParse instanceof String)) {
      throw new TypeError("KaTeX can only parse string typed expression");
    }
    var parser = new Parser(toParse, settings);
    delete parser.gullet.macros.current["\\df@tag"];
    var tree = parser.parse();
    delete parser.gullet.macros.current["\\current@color"];
    delete parser.gullet.macros.current["\\color"];
    if (parser.gullet.macros.get("\\df@tag")) {
      if (!settings.displayMode) {
        throw new ParseError("\\tag works only in display equations");
      }
      tree = [{
        type: "tag",
        mode: "text",
        body: tree,
        tag: parser.subparse([new Token("\\df@tag")])
      }];
    }
    return tree;
  };
  var render = function render2(expression, baseNode, options) {
    baseNode.textContent = "";
    var node = renderToDomTree(expression, options).toNode();
    baseNode.appendChild(node);
  };
  if (typeof document !== "undefined") {
    if (document.compatMode !== "CSS1Compat") {
      typeof console !== "undefined" && console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype.");
      render = function render3() {
        throw new ParseError("KaTeX doesn't work in quirks mode.");
      };
    }
  }
  var renderToString = function renderToString2(expression, options) {
    var markup = renderToDomTree(expression, options).toMarkup();
    return markup;
  };
  var generateParseTree = function generateParseTree2(expression, options) {
    var settings = new Settings(options);
    return parseTree(expression, settings);
  };
  var renderError = function renderError2(error, expression, options) {
    if (options.throwOnError || !(error instanceof ParseError)) {
      throw error;
    }
    var node = buildCommon.makeSpan(["katex-error"], [new SymbolNode(expression)]);
    node.setAttribute("title", error.toString());
    node.setAttribute("style", "color:" + options.errorColor);
    return node;
  };
  var renderToDomTree = function renderToDomTree2(expression, options) {
    var settings = new Settings(options);
    try {
      var tree = parseTree(expression, settings);
      return buildTree(tree, expression, settings);
    } catch (error) {
      return renderError(error, expression, settings);
    }
  };
  var renderToHTMLTree = function renderToHTMLTree2(expression, options) {
    var settings = new Settings(options);
    try {
      var tree = parseTree(expression, settings);
      return buildHTMLTree(tree, expression, settings);
    } catch (error) {
      return renderError(error, expression, settings);
    }
  };
  var version = "0.16.28";
  var __domTree = {
    Span,
    Anchor,
    SymbolNode,
    SvgNode,
    PathNode,
    LineNode
  };
  var katex = {
    /**
     * Current KaTeX version
     */
    version,
    /**
     * Renders the given LaTeX into an HTML+MathML combination, and adds
     * it as a child to the specified DOM node.
     */
    render,
    /**
     * Renders the given LaTeX into an HTML+MathML combination string,
     * for sending to the client.
     */
    renderToString,
    /**
     * KaTeX error, usually during parsing.
     */
    ParseError,
    /**
     * The schema of Settings
     */
    SETTINGS_SCHEMA,
    /**
     * Parses the given LaTeX into KaTeX's internal parse tree structure,
     * without rendering to HTML or MathML.
     *
     * NOTE: This method is not currently recommended for public use.
     * The internal tree representation is unstable and is very likely
     * to change. Use at your own risk.
     */
    __parse: generateParseTree,
    /**
     * Renders the given LaTeX into an HTML+MathML internal DOM tree
     * representation, without flattening that representation to a string.
     *
     * NOTE: This method is not currently recommended for public use.
     * The internal tree representation is unstable and is very likely
     * to change. Use at your own risk.
     */
    __renderToDomTree: renderToDomTree,
    /**
     * Renders the given LaTeX into an HTML internal DOM tree representation,
     * without MathML and without flattening that representation to a string.
     *
     * NOTE: This method is not currently recommended for public use.
     * The internal tree representation is unstable and is very likely
     * to change. Use at your own risk.
     */
    __renderToHTMLTree: renderToHTMLTree,
    /**
     * extends internal font metrics object with a new object
     * each key in the new object represents a font name
    */
    __setFontMetrics: setFontMetrics,
    /**
     * adds a new symbol to builtin symbols table
     */
    __defineSymbol: defineSymbol,
    /**
     * adds a new function to builtin function list,
     * which directly produce parse tree elements
     * and have their own html/mathml builders
     */
    __defineFunction: defineFunction,
    /**
     * adds a new macro to builtin macro list
     */
    __defineMacro: defineMacro,
    /**
     * Expose the dom tree node types, which can be useful for type checking nodes.
     *
     * NOTE: These methods are not currently recommended for public use.
     * The internal tree representation is unstable and is very likely
     * to change. Use at your own risk.
     */
    __domTree
  };

  // node_modules/@shikijs/types/dist/index.mjs
  var ShikiError = class extends Error {
    constructor(message) {
      super(message);
      this.name = "ShikiError";
    }
  };

  // node_modules/@shikijs/vscode-textmate/dist/index.js
  function clone(something) {
    return doClone(something);
  }
  function doClone(something) {
    if (Array.isArray(something)) {
      return cloneArray(something);
    }
    if (something instanceof RegExp) {
      return something;
    }
    if (typeof something === "object") {
      return cloneObj(something);
    }
    return something;
  }
  function cloneArray(arr) {
    let r4 = [];
    for (let i2 = 0, len = arr.length; i2 < len; i2++) {
      r4[i2] = doClone(arr[i2]);
    }
    return r4;
  }
  function cloneObj(obj) {
    let r4 = {};
    for (let key2 in obj) {
      r4[key2] = doClone(obj[key2]);
    }
    return r4;
  }
  function mergeObjects(target, ...sources) {
    sources.forEach((source) => {
      for (let key2 in source) {
        target[key2] = source[key2];
      }
    });
    return target;
  }
  function basename(path2) {
    const idx = ~path2.lastIndexOf("/") || ~path2.lastIndexOf("\\");
    if (idx === 0) {
      return path2;
    } else if (~idx === path2.length - 1) {
      return basename(path2.substring(0, path2.length - 1));
    } else {
      return path2.substr(~idx + 1);
    }
  }
  var CAPTURING_REGEX_SOURCE = /\$(\d+)|\${(\d+):\/(downcase|upcase)}/g;
  var RegexSource = class {
    static hasCaptures(regexSource) {
      if (regexSource === null) {
        return false;
      }
      CAPTURING_REGEX_SOURCE.lastIndex = 0;
      return CAPTURING_REGEX_SOURCE.test(regexSource);
    }
    static replaceCaptures(regexSource, captureSource, captureIndices) {
      return regexSource.replace(CAPTURING_REGEX_SOURCE, (match, index, commandIndex, command) => {
        let capture = captureIndices[parseInt(index || commandIndex, 10)];
        if (capture) {
          let result = captureSource.substring(capture.start, capture.end);
          while (result[0] === ".") {
            result = result.substring(1);
          }
          switch (command) {
            case "downcase":
              return result.toLowerCase();
            case "upcase":
              return result.toUpperCase();
            default:
              return result;
          }
        } else {
          return match;
        }
      });
    }
  };
  function strcmp(a2, b4) {
    if (a2 < b4) {
      return -1;
    }
    if (a2 > b4) {
      return 1;
    }
    return 0;
  }
  function strArrCmp(a2, b4) {
    if (a2 === null && b4 === null) {
      return 0;
    }
    if (!a2) {
      return -1;
    }
    if (!b4) {
      return 1;
    }
    let len1 = a2.length;
    let len2 = b4.length;
    if (len1 === len2) {
      for (let i2 = 0; i2 < len1; i2++) {
        let res = strcmp(a2[i2], b4[i2]);
        if (res !== 0) {
          return res;
        }
      }
      return 0;
    }
    return len1 - len2;
  }
  function isValidHexColor(hex) {
    if (/^#[0-9a-f]{6}$/i.test(hex)) {
      return true;
    }
    if (/^#[0-9a-f]{8}$/i.test(hex)) {
      return true;
    }
    if (/^#[0-9a-f]{3}$/i.test(hex)) {
      return true;
    }
    if (/^#[0-9a-f]{4}$/i.test(hex)) {
      return true;
    }
    return false;
  }
  function escapeRegExpCharacters(value) {
    return value.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
  }
  var CachedFn = class {
    constructor(fn) {
      this.fn = fn;
    }
    fn;
    cache = /* @__PURE__ */ new Map();
    get(key2) {
      if (this.cache.has(key2)) {
        return this.cache.get(key2);
      }
      const value = this.fn(key2);
      this.cache.set(key2, value);
      return value;
    }
  };
  var Theme = class {
    constructor(_colorMap, _defaults, _root) {
      this._colorMap = _colorMap;
      this._defaults = _defaults;
      this._root = _root;
    }
    _colorMap;
    _defaults;
    _root;
    static createFromRawTheme(source, colorMap) {
      return this.createFromParsedTheme(parseTheme(source), colorMap);
    }
    static createFromParsedTheme(source, colorMap) {
      return resolveParsedThemeRules(source, colorMap);
    }
    _cachedMatchRoot = new CachedFn(
      (scopeName) => this._root.match(scopeName)
    );
    getColorMap() {
      return this._colorMap.getColorMap();
    }
    getDefaults() {
      return this._defaults;
    }
    match(scopePath) {
      if (scopePath === null) {
        return this._defaults;
      }
      const scopeName = scopePath.scopeName;
      const matchingTrieElements = this._cachedMatchRoot.get(scopeName);
      const effectiveRule = matchingTrieElements.find(
        (v3) => _scopePathMatchesParentScopes(scopePath.parent, v3.parentScopes)
      );
      if (!effectiveRule) {
        return null;
      }
      return new StyleAttributes(
        effectiveRule.fontStyle,
        effectiveRule.foreground,
        effectiveRule.background
      );
    }
  };
  var ScopeStack = class _ScopeStack {
    constructor(parent, scopeName) {
      this.parent = parent;
      this.scopeName = scopeName;
    }
    parent;
    scopeName;
    static push(path2, scopeNames) {
      for (const name of scopeNames) {
        path2 = new _ScopeStack(path2, name);
      }
      return path2;
    }
    static from(...segments) {
      let result = null;
      for (let i2 = 0; i2 < segments.length; i2++) {
        result = new _ScopeStack(result, segments[i2]);
      }
      return result;
    }
    push(scopeName) {
      return new _ScopeStack(this, scopeName);
    }
    getSegments() {
      let item = this;
      const result = [];
      while (item) {
        result.push(item.scopeName);
        item = item.parent;
      }
      result.reverse();
      return result;
    }
    toString() {
      return this.getSegments().join(" ");
    }
    extends(other) {
      if (this === other) {
        return true;
      }
      if (this.parent === null) {
        return false;
      }
      return this.parent.extends(other);
    }
    getExtensionIfDefined(base) {
      const result = [];
      let item = this;
      while (item && item !== base) {
        result.push(item.scopeName);
        item = item.parent;
      }
      return item === base ? result.reverse() : void 0;
    }
  };
  function _scopePathMatchesParentScopes(scopePath, parentScopes) {
    if (parentScopes.length === 0) {
      return true;
    }
    for (let index = 0; index < parentScopes.length; index++) {
      let scopePattern = parentScopes[index];
      let scopeMustMatch = false;
      if (scopePattern === ">") {
        if (index === parentScopes.length - 1) {
          return false;
        }
        scopePattern = parentScopes[++index];
        scopeMustMatch = true;
      }
      while (scopePath) {
        if (_matchesScope(scopePath.scopeName, scopePattern)) {
          break;
        }
        if (scopeMustMatch) {
          return false;
        }
        scopePath = scopePath.parent;
      }
      if (!scopePath) {
        return false;
      }
      scopePath = scopePath.parent;
    }
    return true;
  }
  function _matchesScope(scopeName, scopePattern) {
    return scopePattern === scopeName || scopeName.startsWith(scopePattern) && scopeName[scopePattern.length] === ".";
  }
  var StyleAttributes = class {
    constructor(fontStyle, foregroundId, backgroundId) {
      this.fontStyle = fontStyle;
      this.foregroundId = foregroundId;
      this.backgroundId = backgroundId;
    }
    fontStyle;
    foregroundId;
    backgroundId;
  };
  function parseTheme(source) {
    if (!source) {
      return [];
    }
    if (!source.settings || !Array.isArray(source.settings)) {
      return [];
    }
    let settings = source.settings;
    let result = [], resultLen = 0;
    for (let i2 = 0, len = settings.length; i2 < len; i2++) {
      let entry = settings[i2];
      if (!entry.settings) {
        continue;
      }
      let scopes;
      if (typeof entry.scope === "string") {
        let _scope = entry.scope;
        _scope = _scope.replace(/^[,]+/, "");
        _scope = _scope.replace(/[,]+$/, "");
        scopes = _scope.split(",");
      } else if (Array.isArray(entry.scope)) {
        scopes = entry.scope;
      } else {
        scopes = [""];
      }
      let fontStyle = -1;
      if (typeof entry.settings.fontStyle === "string") {
        fontStyle = 0;
        let segments = entry.settings.fontStyle.split(" ");
        for (let j3 = 0, lenJ = segments.length; j3 < lenJ; j3++) {
          let segment = segments[j3];
          switch (segment) {
            case "italic":
              fontStyle = fontStyle | 1;
              break;
            case "bold":
              fontStyle = fontStyle | 2;
              break;
            case "underline":
              fontStyle = fontStyle | 4;
              break;
            case "strikethrough":
              fontStyle = fontStyle | 8;
              break;
          }
        }
      }
      let foreground = null;
      if (typeof entry.settings.foreground === "string" && isValidHexColor(entry.settings.foreground)) {
        foreground = entry.settings.foreground;
      }
      let background = null;
      if (typeof entry.settings.background === "string" && isValidHexColor(entry.settings.background)) {
        background = entry.settings.background;
      }
      for (let j3 = 0, lenJ = scopes.length; j3 < lenJ; j3++) {
        let _scope = scopes[j3].trim();
        let segments = _scope.split(" ");
        let scope = segments[segments.length - 1];
        let parentScopes = null;
        if (segments.length > 1) {
          parentScopes = segments.slice(0, segments.length - 1);
          parentScopes.reverse();
        }
        result[resultLen++] = new ParsedThemeRule(
          scope,
          parentScopes,
          i2,
          fontStyle,
          foreground,
          background
        );
      }
    }
    return result;
  }
  var ParsedThemeRule = class {
    constructor(scope, parentScopes, index, fontStyle, foreground, background) {
      this.scope = scope;
      this.parentScopes = parentScopes;
      this.index = index;
      this.fontStyle = fontStyle;
      this.foreground = foreground;
      this.background = background;
    }
    scope;
    parentScopes;
    index;
    fontStyle;
    foreground;
    background;
  };
  var FontStyle = /* @__PURE__ */ ((FontStyle2) => {
    FontStyle2[FontStyle2["NotSet"] = -1] = "NotSet";
    FontStyle2[FontStyle2["None"] = 0] = "None";
    FontStyle2[FontStyle2["Italic"] = 1] = "Italic";
    FontStyle2[FontStyle2["Bold"] = 2] = "Bold";
    FontStyle2[FontStyle2["Underline"] = 4] = "Underline";
    FontStyle2[FontStyle2["Strikethrough"] = 8] = "Strikethrough";
    return FontStyle2;
  })(FontStyle || {});
  function resolveParsedThemeRules(parsedThemeRules, _colorMap) {
    parsedThemeRules.sort((a2, b4) => {
      let r4 = strcmp(a2.scope, b4.scope);
      if (r4 !== 0) {
        return r4;
      }
      r4 = strArrCmp(a2.parentScopes, b4.parentScopes);
      if (r4 !== 0) {
        return r4;
      }
      return a2.index - b4.index;
    });
    let defaultFontStyle = 0;
    let defaultForeground = "#000000";
    let defaultBackground = "#ffffff";
    while (parsedThemeRules.length >= 1 && parsedThemeRules[0].scope === "") {
      let incomingDefaults = parsedThemeRules.shift();
      if (incomingDefaults.fontStyle !== -1) {
        defaultFontStyle = incomingDefaults.fontStyle;
      }
      if (incomingDefaults.foreground !== null) {
        defaultForeground = incomingDefaults.foreground;
      }
      if (incomingDefaults.background !== null) {
        defaultBackground = incomingDefaults.background;
      }
    }
    let colorMap = new ColorMap(_colorMap);
    let defaults = new StyleAttributes(defaultFontStyle, colorMap.getId(defaultForeground), colorMap.getId(defaultBackground));
    let root2 = new ThemeTrieElement(new ThemeTrieElementRule(0, null, -1, 0, 0), []);
    for (let i2 = 0, len = parsedThemeRules.length; i2 < len; i2++) {
      let rule = parsedThemeRules[i2];
      root2.insert(0, rule.scope, rule.parentScopes, rule.fontStyle, colorMap.getId(rule.foreground), colorMap.getId(rule.background));
    }
    return new Theme(colorMap, defaults, root2);
  }
  var ColorMap = class {
    _isFrozen;
    _lastColorId;
    _id2color;
    _color2id;
    constructor(_colorMap) {
      this._lastColorId = 0;
      this._id2color = [];
      this._color2id = /* @__PURE__ */ Object.create(null);
      if (Array.isArray(_colorMap)) {
        this._isFrozen = true;
        for (let i2 = 0, len = _colorMap.length; i2 < len; i2++) {
          this._color2id[_colorMap[i2]] = i2;
          this._id2color[i2] = _colorMap[i2];
        }
      } else {
        this._isFrozen = false;
      }
    }
    getId(color) {
      if (color === null) {
        return 0;
      }
      color = color.toUpperCase();
      let value = this._color2id[color];
      if (value) {
        return value;
      }
      if (this._isFrozen) {
        throw new Error(`Missing color in color map - ${color}`);
      }
      value = ++this._lastColorId;
      this._color2id[color] = value;
      this._id2color[value] = color;
      return value;
    }
    getColorMap() {
      return this._id2color.slice(0);
    }
  };
  var emptyParentScopes = Object.freeze([]);
  var ThemeTrieElementRule = class _ThemeTrieElementRule {
    scopeDepth;
    parentScopes;
    fontStyle;
    foreground;
    background;
    constructor(scopeDepth, parentScopes, fontStyle, foreground, background) {
      this.scopeDepth = scopeDepth;
      this.parentScopes = parentScopes || emptyParentScopes;
      this.fontStyle = fontStyle;
      this.foreground = foreground;
      this.background = background;
    }
    clone() {
      return new _ThemeTrieElementRule(this.scopeDepth, this.parentScopes, this.fontStyle, this.foreground, this.background);
    }
    static cloneArr(arr) {
      let r4 = [];
      for (let i2 = 0, len = arr.length; i2 < len; i2++) {
        r4[i2] = arr[i2].clone();
      }
      return r4;
    }
    acceptOverwrite(scopeDepth, fontStyle, foreground, background) {
      if (this.scopeDepth > scopeDepth) {
        console.log("how did this happen?");
      } else {
        this.scopeDepth = scopeDepth;
      }
      if (fontStyle !== -1) {
        this.fontStyle = fontStyle;
      }
      if (foreground !== 0) {
        this.foreground = foreground;
      }
      if (background !== 0) {
        this.background = background;
      }
    }
  };
  var ThemeTrieElement = class _ThemeTrieElement {
    constructor(_mainRule, rulesWithParentScopes = [], _children = {}) {
      this._mainRule = _mainRule;
      this._children = _children;
      this._rulesWithParentScopes = rulesWithParentScopes;
    }
    _mainRule;
    _children;
    _rulesWithParentScopes;
    static _cmpBySpecificity(a2, b4) {
      if (a2.scopeDepth !== b4.scopeDepth) {
        return b4.scopeDepth - a2.scopeDepth;
      }
      let aParentIndex = 0;
      let bParentIndex = 0;
      while (true) {
        if (a2.parentScopes[aParentIndex] === ">") {
          aParentIndex++;
        }
        if (b4.parentScopes[bParentIndex] === ">") {
          bParentIndex++;
        }
        if (aParentIndex >= a2.parentScopes.length || bParentIndex >= b4.parentScopes.length) {
          break;
        }
        const parentScopeLengthDiff = b4.parentScopes[bParentIndex].length - a2.parentScopes[aParentIndex].length;
        if (parentScopeLengthDiff !== 0) {
          return parentScopeLengthDiff;
        }
        aParentIndex++;
        bParentIndex++;
      }
      return b4.parentScopes.length - a2.parentScopes.length;
    }
    match(scope) {
      if (scope !== "") {
        let dotIndex = scope.indexOf(".");
        let head2;
        let tail;
        if (dotIndex === -1) {
          head2 = scope;
          tail = "";
        } else {
          head2 = scope.substring(0, dotIndex);
          tail = scope.substring(dotIndex + 1);
        }
        if (this._children.hasOwnProperty(head2)) {
          return this._children[head2].match(tail);
        }
      }
      const rules = this._rulesWithParentScopes.concat(this._mainRule);
      rules.sort(_ThemeTrieElement._cmpBySpecificity);
      return rules;
    }
    insert(scopeDepth, scope, parentScopes, fontStyle, foreground, background) {
      if (scope === "") {
        this._doInsertHere(scopeDepth, parentScopes, fontStyle, foreground, background);
        return;
      }
      let dotIndex = scope.indexOf(".");
      let head2;
      let tail;
      if (dotIndex === -1) {
        head2 = scope;
        tail = "";
      } else {
        head2 = scope.substring(0, dotIndex);
        tail = scope.substring(dotIndex + 1);
      }
      let child;
      if (this._children.hasOwnProperty(head2)) {
        child = this._children[head2];
      } else {
        child = new _ThemeTrieElement(this._mainRule.clone(), ThemeTrieElementRule.cloneArr(this._rulesWithParentScopes));
        this._children[head2] = child;
      }
      child.insert(scopeDepth + 1, tail, parentScopes, fontStyle, foreground, background);
    }
    _doInsertHere(scopeDepth, parentScopes, fontStyle, foreground, background) {
      if (parentScopes === null) {
        this._mainRule.acceptOverwrite(scopeDepth, fontStyle, foreground, background);
        return;
      }
      for (let i2 = 0, len = this._rulesWithParentScopes.length; i2 < len; i2++) {
        let rule = this._rulesWithParentScopes[i2];
        if (strArrCmp(rule.parentScopes, parentScopes) === 0) {
          rule.acceptOverwrite(scopeDepth, fontStyle, foreground, background);
          return;
        }
      }
      if (fontStyle === -1) {
        fontStyle = this._mainRule.fontStyle;
      }
      if (foreground === 0) {
        foreground = this._mainRule.foreground;
      }
      if (background === 0) {
        background = this._mainRule.background;
      }
      this._rulesWithParentScopes.push(new ThemeTrieElementRule(scopeDepth, parentScopes, fontStyle, foreground, background));
    }
  };
  var EncodedTokenMetadata = class _EncodedTokenMetadata {
    static toBinaryStr(encodedTokenAttributes) {
      return encodedTokenAttributes.toString(2).padStart(32, "0");
    }
    static print(encodedTokenAttributes) {
      const languageId = _EncodedTokenMetadata.getLanguageId(encodedTokenAttributes);
      const tokenType = _EncodedTokenMetadata.getTokenType(encodedTokenAttributes);
      const fontStyle = _EncodedTokenMetadata.getFontStyle(encodedTokenAttributes);
      const foreground = _EncodedTokenMetadata.getForeground(encodedTokenAttributes);
      const background = _EncodedTokenMetadata.getBackground(encodedTokenAttributes);
      console.log({
        languageId,
        tokenType,
        fontStyle,
        foreground,
        background
      });
    }
    static getLanguageId(encodedTokenAttributes) {
      return (encodedTokenAttributes & 255) >>> 0;
    }
    static getTokenType(encodedTokenAttributes) {
      return (encodedTokenAttributes & 768) >>> 8;
    }
    static containsBalancedBrackets(encodedTokenAttributes) {
      return (encodedTokenAttributes & 1024) !== 0;
    }
    static getFontStyle(encodedTokenAttributes) {
      return (encodedTokenAttributes & 30720) >>> 11;
    }
    static getForeground(encodedTokenAttributes) {
      return (encodedTokenAttributes & 16744448) >>> 15;
    }
    static getBackground(encodedTokenAttributes) {
      return (encodedTokenAttributes & 4278190080) >>> 24;
    }
    /**
     * Updates the fields in `metadata`.
     * A value of `0`, `NotSet` or `null` indicates that the corresponding field should be left as is.
     */
    static set(encodedTokenAttributes, languageId, tokenType, containsBalancedBrackets, fontStyle, foreground, background) {
      let _languageId = _EncodedTokenMetadata.getLanguageId(encodedTokenAttributes);
      let _tokenType = _EncodedTokenMetadata.getTokenType(encodedTokenAttributes);
      let _containsBalancedBracketsBit = _EncodedTokenMetadata.containsBalancedBrackets(encodedTokenAttributes) ? 1 : 0;
      let _fontStyle = _EncodedTokenMetadata.getFontStyle(encodedTokenAttributes);
      let _foreground = _EncodedTokenMetadata.getForeground(encodedTokenAttributes);
      let _background = _EncodedTokenMetadata.getBackground(encodedTokenAttributes);
      if (languageId !== 0) {
        _languageId = languageId;
      }
      if (tokenType !== 8) {
        _tokenType = fromOptionalTokenType(tokenType);
      }
      if (containsBalancedBrackets !== null) {
        _containsBalancedBracketsBit = containsBalancedBrackets ? 1 : 0;
      }
      if (fontStyle !== -1) {
        _fontStyle = fontStyle;
      }
      if (foreground !== 0) {
        _foreground = foreground;
      }
      if (background !== 0) {
        _background = background;
      }
      return (_languageId << 0 | _tokenType << 8 | _containsBalancedBracketsBit << 10 | _fontStyle << 11 | _foreground << 15 | _background << 24) >>> 0;
    }
  };
  function toOptionalTokenType(standardType) {
    return standardType;
  }
  function fromOptionalTokenType(standardType) {
    return standardType;
  }
  function createMatchers(selector, matchesName) {
    const results = [];
    const tokenizer = newTokenizer(selector);
    let token2 = tokenizer.next();
    while (token2 !== null) {
      let priority = 0;
      if (token2.length === 2 && token2.charAt(1) === ":") {
        switch (token2.charAt(0)) {
          case "R":
            priority = 1;
            break;
          case "L":
            priority = -1;
            break;
          default:
            console.log(`Unknown priority ${token2} in scope selector`);
        }
        token2 = tokenizer.next();
      }
      let matcher = parseConjunction();
      results.push({ matcher, priority });
      if (token2 !== ",") {
        break;
      }
      token2 = tokenizer.next();
    }
    return results;
    function parseOperand() {
      if (token2 === "-") {
        token2 = tokenizer.next();
        const expressionToNegate = parseOperand();
        return (matcherInput) => !!expressionToNegate && !expressionToNegate(matcherInput);
      }
      if (token2 === "(") {
        token2 = tokenizer.next();
        const expressionInParents = parseInnerExpression();
        if (token2 === ")") {
          token2 = tokenizer.next();
        }
        return expressionInParents;
      }
      if (isIdentifier(token2)) {
        const identifiers = [];
        do {
          identifiers.push(token2);
          token2 = tokenizer.next();
        } while (isIdentifier(token2));
        return (matcherInput) => matchesName(identifiers, matcherInput);
      }
      return null;
    }
    function parseConjunction() {
      const matchers = [];
      let matcher = parseOperand();
      while (matcher) {
        matchers.push(matcher);
        matcher = parseOperand();
      }
      return (matcherInput) => matchers.every((matcher2) => matcher2(matcherInput));
    }
    function parseInnerExpression() {
      const matchers = [];
      let matcher = parseConjunction();
      while (matcher) {
        matchers.push(matcher);
        if (token2 === "|" || token2 === ",") {
          do {
            token2 = tokenizer.next();
          } while (token2 === "|" || token2 === ",");
        } else {
          break;
        }
        matcher = parseConjunction();
      }
      return (matcherInput) => matchers.some((matcher2) => matcher2(matcherInput));
    }
  }
  function isIdentifier(token2) {
    return !!token2 && !!token2.match(/[\w\.:]+/);
  }
  function newTokenizer(input) {
    let regex = /([LR]:|[\w\.:][\w\.:\-]*|[\,\|\-\(\)])/g;
    let match = regex.exec(input);
    return {
      next: () => {
        if (!match) {
          return null;
        }
        const res = match[0];
        match = regex.exec(input);
        return res;
      }
    };
  }
  function disposeOnigString(str) {
    if (typeof str.dispose === "function") {
      str.dispose();
    }
  }
  var TopLevelRuleReference = class {
    constructor(scopeName) {
      this.scopeName = scopeName;
    }
    scopeName;
    toKey() {
      return this.scopeName;
    }
  };
  var TopLevelRepositoryRuleReference = class {
    constructor(scopeName, ruleName) {
      this.scopeName = scopeName;
      this.ruleName = ruleName;
    }
    scopeName;
    ruleName;
    toKey() {
      return `${this.scopeName}#${this.ruleName}`;
    }
  };
  var ExternalReferenceCollector = class {
    _references = [];
    _seenReferenceKeys = /* @__PURE__ */ new Set();
    get references() {
      return this._references;
    }
    visitedRule = /* @__PURE__ */ new Set();
    add(reference) {
      const key2 = reference.toKey();
      if (this._seenReferenceKeys.has(key2)) {
        return;
      }
      this._seenReferenceKeys.add(key2);
      this._references.push(reference);
    }
  };
  var ScopeDependencyProcessor = class {
    constructor(repo, initialScopeName) {
      this.repo = repo;
      this.initialScopeName = initialScopeName;
      this.seenFullScopeRequests.add(this.initialScopeName);
      this.Q = [new TopLevelRuleReference(this.initialScopeName)];
    }
    repo;
    initialScopeName;
    seenFullScopeRequests = /* @__PURE__ */ new Set();
    seenPartialScopeRequests = /* @__PURE__ */ new Set();
    Q;
    processQueue() {
      const q3 = this.Q;
      this.Q = [];
      const deps = new ExternalReferenceCollector();
      for (const dep of q3) {
        collectReferencesOfReference(dep, this.initialScopeName, this.repo, deps);
      }
      for (const dep of deps.references) {
        if (dep instanceof TopLevelRuleReference) {
          if (this.seenFullScopeRequests.has(dep.scopeName)) {
            continue;
          }
          this.seenFullScopeRequests.add(dep.scopeName);
          this.Q.push(dep);
        } else {
          if (this.seenFullScopeRequests.has(dep.scopeName)) {
            continue;
          }
          if (this.seenPartialScopeRequests.has(dep.toKey())) {
            continue;
          }
          this.seenPartialScopeRequests.add(dep.toKey());
          this.Q.push(dep);
        }
      }
    }
  };
  function collectReferencesOfReference(reference, baseGrammarScopeName, repo, result) {
    const selfGrammar = repo.lookup(reference.scopeName);
    if (!selfGrammar) {
      if (reference.scopeName === baseGrammarScopeName) {
        throw new Error(`No grammar provided for <${baseGrammarScopeName}>`);
      }
      return;
    }
    const baseGrammar = repo.lookup(baseGrammarScopeName);
    if (reference instanceof TopLevelRuleReference) {
      collectExternalReferencesInTopLevelRule({ baseGrammar, selfGrammar }, result);
    } else {
      collectExternalReferencesInTopLevelRepositoryRule(
        reference.ruleName,
        { baseGrammar, selfGrammar, repository: selfGrammar.repository },
        result
      );
    }
    const injections = repo.injections(reference.scopeName);
    if (injections) {
      for (const injection of injections) {
        result.add(new TopLevelRuleReference(injection));
      }
    }
  }
  function collectExternalReferencesInTopLevelRepositoryRule(ruleName, context, result) {
    if (context.repository && context.repository[ruleName]) {
      const rule = context.repository[ruleName];
      collectExternalReferencesInRules([rule], context, result);
    }
  }
  function collectExternalReferencesInTopLevelRule(context, result) {
    if (context.selfGrammar.patterns && Array.isArray(context.selfGrammar.patterns)) {
      collectExternalReferencesInRules(
        context.selfGrammar.patterns,
        { ...context, repository: context.selfGrammar.repository },
        result
      );
    }
    if (context.selfGrammar.injections) {
      collectExternalReferencesInRules(
        Object.values(context.selfGrammar.injections),
        { ...context, repository: context.selfGrammar.repository },
        result
      );
    }
  }
  function collectExternalReferencesInRules(rules, context, result) {
    for (const rule of rules) {
      if (result.visitedRule.has(rule)) {
        continue;
      }
      result.visitedRule.add(rule);
      const patternRepository = rule.repository ? mergeObjects({}, context.repository, rule.repository) : context.repository;
      if (Array.isArray(rule.patterns)) {
        collectExternalReferencesInRules(rule.patterns, { ...context, repository: patternRepository }, result);
      }
      const include = rule.include;
      if (!include) {
        continue;
      }
      const reference = parseInclude(include);
      switch (reference.kind) {
        case 0:
          collectExternalReferencesInTopLevelRule({ ...context, selfGrammar: context.baseGrammar }, result);
          break;
        case 1:
          collectExternalReferencesInTopLevelRule(context, result);
          break;
        case 2:
          collectExternalReferencesInTopLevelRepositoryRule(reference.ruleName, { ...context, repository: patternRepository }, result);
          break;
        case 3:
        case 4:
          const selfGrammar = reference.scopeName === context.selfGrammar.scopeName ? context.selfGrammar : reference.scopeName === context.baseGrammar.scopeName ? context.baseGrammar : void 0;
          if (selfGrammar) {
            const newContext = { baseGrammar: context.baseGrammar, selfGrammar, repository: patternRepository };
            if (reference.kind === 4) {
              collectExternalReferencesInTopLevelRepositoryRule(reference.ruleName, newContext, result);
            } else {
              collectExternalReferencesInTopLevelRule(newContext, result);
            }
          } else {
            if (reference.kind === 4) {
              result.add(new TopLevelRepositoryRuleReference(reference.scopeName, reference.ruleName));
            } else {
              result.add(new TopLevelRuleReference(reference.scopeName));
            }
          }
          break;
      }
    }
  }
  var BaseReference = class {
    kind = 0;
  };
  var SelfReference = class {
    kind = 1;
  };
  var RelativeReference = class {
    constructor(ruleName) {
      this.ruleName = ruleName;
    }
    ruleName;
    kind = 2;
  };
  var TopLevelReference = class {
    constructor(scopeName) {
      this.scopeName = scopeName;
    }
    scopeName;
    kind = 3;
  };
  var TopLevelRepositoryReference = class {
    constructor(scopeName, ruleName) {
      this.scopeName = scopeName;
      this.ruleName = ruleName;
    }
    scopeName;
    ruleName;
    kind = 4;
  };
  function parseInclude(include) {
    if (include === "$base") {
      return new BaseReference();
    } else if (include === "$self") {
      return new SelfReference();
    }
    const indexOfSharp = include.indexOf("#");
    if (indexOfSharp === -1) {
      return new TopLevelReference(include);
    } else if (indexOfSharp === 0) {
      return new RelativeReference(include.substring(1));
    } else {
      const scopeName = include.substring(0, indexOfSharp);
      const ruleName = include.substring(indexOfSharp + 1);
      return new TopLevelRepositoryReference(scopeName, ruleName);
    }
  }
  var HAS_BACK_REFERENCES = /\\(\d+)/;
  var BACK_REFERENCING_END = /\\(\d+)/g;
  var endRuleId = -1;
  var whileRuleId = -2;
  function ruleIdFromNumber(id) {
    return id;
  }
  function ruleIdToNumber(id) {
    return id;
  }
  var Rule = class {
    $location;
    id;
    _nameIsCapturing;
    _name;
    _contentNameIsCapturing;
    _contentName;
    constructor($location, id, name, contentName) {
      this.$location = $location;
      this.id = id;
      this._name = name || null;
      this._nameIsCapturing = RegexSource.hasCaptures(this._name);
      this._contentName = contentName || null;
      this._contentNameIsCapturing = RegexSource.hasCaptures(this._contentName);
    }
    get debugName() {
      const location = this.$location ? `${basename(this.$location.filename)}:${this.$location.line}` : "unknown";
      return `${this.constructor.name}#${this.id} @ ${location}`;
    }
    getName(lineText, captureIndices) {
      if (!this._nameIsCapturing || this._name === null || lineText === null || captureIndices === null) {
        return this._name;
      }
      return RegexSource.replaceCaptures(this._name, lineText, captureIndices);
    }
    getContentName(lineText, captureIndices) {
      if (!this._contentNameIsCapturing || this._contentName === null) {
        return this._contentName;
      }
      return RegexSource.replaceCaptures(this._contentName, lineText, captureIndices);
    }
  };
  var CaptureRule = class extends Rule {
    retokenizeCapturedWithRuleId;
    constructor($location, id, name, contentName, retokenizeCapturedWithRuleId) {
      super($location, id, name, contentName);
      this.retokenizeCapturedWithRuleId = retokenizeCapturedWithRuleId;
    }
    dispose() {
    }
    collectPatterns(grammar, out) {
      throw new Error("Not supported!");
    }
    compile(grammar, endRegexSource) {
      throw new Error("Not supported!");
    }
    compileAG(grammar, endRegexSource, allowA, allowG) {
      throw new Error("Not supported!");
    }
  };
  var MatchRule = class extends Rule {
    _match;
    captures;
    _cachedCompiledPatterns;
    constructor($location, id, name, match, captures) {
      super($location, id, name, null);
      this._match = new RegExpSource(match, this.id);
      this.captures = captures;
      this._cachedCompiledPatterns = null;
    }
    dispose() {
      if (this._cachedCompiledPatterns) {
        this._cachedCompiledPatterns.dispose();
        this._cachedCompiledPatterns = null;
      }
    }
    get debugMatchRegExp() {
      return `${this._match.source}`;
    }
    collectPatterns(grammar, out) {
      out.push(this._match);
    }
    compile(grammar, endRegexSource) {
      return this._getCachedCompiledPatterns(grammar).compile(grammar);
    }
    compileAG(grammar, endRegexSource, allowA, allowG) {
      return this._getCachedCompiledPatterns(grammar).compileAG(grammar, allowA, allowG);
    }
    _getCachedCompiledPatterns(grammar) {
      if (!this._cachedCompiledPatterns) {
        this._cachedCompiledPatterns = new RegExpSourceList();
        this.collectPatterns(grammar, this._cachedCompiledPatterns);
      }
      return this._cachedCompiledPatterns;
    }
  };
  var IncludeOnlyRule = class extends Rule {
    hasMissingPatterns;
    patterns;
    _cachedCompiledPatterns;
    constructor($location, id, name, contentName, patterns) {
      super($location, id, name, contentName);
      this.patterns = patterns.patterns;
      this.hasMissingPatterns = patterns.hasMissingPatterns;
      this._cachedCompiledPatterns = null;
    }
    dispose() {
      if (this._cachedCompiledPatterns) {
        this._cachedCompiledPatterns.dispose();
        this._cachedCompiledPatterns = null;
      }
    }
    collectPatterns(grammar, out) {
      for (const pattern of this.patterns) {
        const rule = grammar.getRule(pattern);
        rule.collectPatterns(grammar, out);
      }
    }
    compile(grammar, endRegexSource) {
      return this._getCachedCompiledPatterns(grammar).compile(grammar);
    }
    compileAG(grammar, endRegexSource, allowA, allowG) {
      return this._getCachedCompiledPatterns(grammar).compileAG(grammar, allowA, allowG);
    }
    _getCachedCompiledPatterns(grammar) {
      if (!this._cachedCompiledPatterns) {
        this._cachedCompiledPatterns = new RegExpSourceList();
        this.collectPatterns(grammar, this._cachedCompiledPatterns);
      }
      return this._cachedCompiledPatterns;
    }
  };
  var BeginEndRule = class extends Rule {
    _begin;
    beginCaptures;
    _end;
    endHasBackReferences;
    endCaptures;
    applyEndPatternLast;
    hasMissingPatterns;
    patterns;
    _cachedCompiledPatterns;
    constructor($location, id, name, contentName, begin, beginCaptures, end, endCaptures, applyEndPatternLast, patterns) {
      super($location, id, name, contentName);
      this._begin = new RegExpSource(begin, this.id);
      this.beginCaptures = beginCaptures;
      this._end = new RegExpSource(end ? end : "\uFFFF", -1);
      this.endHasBackReferences = this._end.hasBackReferences;
      this.endCaptures = endCaptures;
      this.applyEndPatternLast = applyEndPatternLast || false;
      this.patterns = patterns.patterns;
      this.hasMissingPatterns = patterns.hasMissingPatterns;
      this._cachedCompiledPatterns = null;
    }
    dispose() {
      if (this._cachedCompiledPatterns) {
        this._cachedCompiledPatterns.dispose();
        this._cachedCompiledPatterns = null;
      }
    }
    get debugBeginRegExp() {
      return `${this._begin.source}`;
    }
    get debugEndRegExp() {
      return `${this._end.source}`;
    }
    getEndWithResolvedBackReferences(lineText, captureIndices) {
      return this._end.resolveBackReferences(lineText, captureIndices);
    }
    collectPatterns(grammar, out) {
      out.push(this._begin);
    }
    compile(grammar, endRegexSource) {
      return this._getCachedCompiledPatterns(grammar, endRegexSource).compile(grammar);
    }
    compileAG(grammar, endRegexSource, allowA, allowG) {
      return this._getCachedCompiledPatterns(grammar, endRegexSource).compileAG(grammar, allowA, allowG);
    }
    _getCachedCompiledPatterns(grammar, endRegexSource) {
      if (!this._cachedCompiledPatterns) {
        this._cachedCompiledPatterns = new RegExpSourceList();
        for (const pattern of this.patterns) {
          const rule = grammar.getRule(pattern);
          rule.collectPatterns(grammar, this._cachedCompiledPatterns);
        }
        if (this.applyEndPatternLast) {
          this._cachedCompiledPatterns.push(this._end.hasBackReferences ? this._end.clone() : this._end);
        } else {
          this._cachedCompiledPatterns.unshift(this._end.hasBackReferences ? this._end.clone() : this._end);
        }
      }
      if (this._end.hasBackReferences) {
        if (this.applyEndPatternLast) {
          this._cachedCompiledPatterns.setSource(this._cachedCompiledPatterns.length() - 1, endRegexSource);
        } else {
          this._cachedCompiledPatterns.setSource(0, endRegexSource);
        }
      }
      return this._cachedCompiledPatterns;
    }
  };
  var BeginWhileRule = class extends Rule {
    _begin;
    beginCaptures;
    whileCaptures;
    _while;
    whileHasBackReferences;
    hasMissingPatterns;
    patterns;
    _cachedCompiledPatterns;
    _cachedCompiledWhilePatterns;
    constructor($location, id, name, contentName, begin, beginCaptures, _while, whileCaptures, patterns) {
      super($location, id, name, contentName);
      this._begin = new RegExpSource(begin, this.id);
      this.beginCaptures = beginCaptures;
      this.whileCaptures = whileCaptures;
      this._while = new RegExpSource(_while, whileRuleId);
      this.whileHasBackReferences = this._while.hasBackReferences;
      this.patterns = patterns.patterns;
      this.hasMissingPatterns = patterns.hasMissingPatterns;
      this._cachedCompiledPatterns = null;
      this._cachedCompiledWhilePatterns = null;
    }
    dispose() {
      if (this._cachedCompiledPatterns) {
        this._cachedCompiledPatterns.dispose();
        this._cachedCompiledPatterns = null;
      }
      if (this._cachedCompiledWhilePatterns) {
        this._cachedCompiledWhilePatterns.dispose();
        this._cachedCompiledWhilePatterns = null;
      }
    }
    get debugBeginRegExp() {
      return `${this._begin.source}`;
    }
    get debugWhileRegExp() {
      return `${this._while.source}`;
    }
    getWhileWithResolvedBackReferences(lineText, captureIndices) {
      return this._while.resolveBackReferences(lineText, captureIndices);
    }
    collectPatterns(grammar, out) {
      out.push(this._begin);
    }
    compile(grammar, endRegexSource) {
      return this._getCachedCompiledPatterns(grammar).compile(grammar);
    }
    compileAG(grammar, endRegexSource, allowA, allowG) {
      return this._getCachedCompiledPatterns(grammar).compileAG(grammar, allowA, allowG);
    }
    _getCachedCompiledPatterns(grammar) {
      if (!this._cachedCompiledPatterns) {
        this._cachedCompiledPatterns = new RegExpSourceList();
        for (const pattern of this.patterns) {
          const rule = grammar.getRule(pattern);
          rule.collectPatterns(grammar, this._cachedCompiledPatterns);
        }
      }
      return this._cachedCompiledPatterns;
    }
    compileWhile(grammar, endRegexSource) {
      return this._getCachedCompiledWhilePatterns(grammar, endRegexSource).compile(grammar);
    }
    compileWhileAG(grammar, endRegexSource, allowA, allowG) {
      return this._getCachedCompiledWhilePatterns(grammar, endRegexSource).compileAG(grammar, allowA, allowG);
    }
    _getCachedCompiledWhilePatterns(grammar, endRegexSource) {
      if (!this._cachedCompiledWhilePatterns) {
        this._cachedCompiledWhilePatterns = new RegExpSourceList();
        this._cachedCompiledWhilePatterns.push(this._while.hasBackReferences ? this._while.clone() : this._while);
      }
      if (this._while.hasBackReferences) {
        this._cachedCompiledWhilePatterns.setSource(0, endRegexSource ? endRegexSource : "\uFFFF");
      }
      return this._cachedCompiledWhilePatterns;
    }
  };
  var RuleFactory = class _RuleFactory {
    static createCaptureRule(helper, $location, name, contentName, retokenizeCapturedWithRuleId) {
      return helper.registerRule((id) => {
        return new CaptureRule($location, id, name, contentName, retokenizeCapturedWithRuleId);
      });
    }
    static getCompiledRuleId(desc, helper, repository) {
      if (!desc.id) {
        helper.registerRule((id) => {
          desc.id = id;
          if (desc.match) {
            return new MatchRule(
              desc.$vscodeTextmateLocation,
              desc.id,
              desc.name,
              desc.match,
              _RuleFactory._compileCaptures(desc.captures, helper, repository)
            );
          }
          if (typeof desc.begin === "undefined") {
            if (desc.repository) {
              repository = mergeObjects({}, repository, desc.repository);
            }
            let patterns = desc.patterns;
            if (typeof patterns === "undefined" && desc.include) {
              patterns = [{ include: desc.include }];
            }
            return new IncludeOnlyRule(
              desc.$vscodeTextmateLocation,
              desc.id,
              desc.name,
              desc.contentName,
              _RuleFactory._compilePatterns(patterns, helper, repository)
            );
          }
          if (desc.while) {
            return new BeginWhileRule(
              desc.$vscodeTextmateLocation,
              desc.id,
              desc.name,
              desc.contentName,
              desc.begin,
              _RuleFactory._compileCaptures(desc.beginCaptures || desc.captures, helper, repository),
              desc.while,
              _RuleFactory._compileCaptures(desc.whileCaptures || desc.captures, helper, repository),
              _RuleFactory._compilePatterns(desc.patterns, helper, repository)
            );
          }
          return new BeginEndRule(
            desc.$vscodeTextmateLocation,
            desc.id,
            desc.name,
            desc.contentName,
            desc.begin,
            _RuleFactory._compileCaptures(desc.beginCaptures || desc.captures, helper, repository),
            desc.end,
            _RuleFactory._compileCaptures(desc.endCaptures || desc.captures, helper, repository),
            desc.applyEndPatternLast,
            _RuleFactory._compilePatterns(desc.patterns, helper, repository)
          );
        });
      }
      return desc.id;
    }
    static _compileCaptures(captures, helper, repository) {
      let r4 = [];
      if (captures) {
        let maximumCaptureId = 0;
        for (const captureId in captures) {
          if (captureId === "$vscodeTextmateLocation") {
            continue;
          }
          const numericCaptureId = parseInt(captureId, 10);
          if (numericCaptureId > maximumCaptureId) {
            maximumCaptureId = numericCaptureId;
          }
        }
        for (let i2 = 0; i2 <= maximumCaptureId; i2++) {
          r4[i2] = null;
        }
        for (const captureId in captures) {
          if (captureId === "$vscodeTextmateLocation") {
            continue;
          }
          const numericCaptureId = parseInt(captureId, 10);
          let retokenizeCapturedWithRuleId = 0;
          if (captures[captureId].patterns) {
            retokenizeCapturedWithRuleId = _RuleFactory.getCompiledRuleId(captures[captureId], helper, repository);
          }
          r4[numericCaptureId] = _RuleFactory.createCaptureRule(helper, captures[captureId].$vscodeTextmateLocation, captures[captureId].name, captures[captureId].contentName, retokenizeCapturedWithRuleId);
        }
      }
      return r4;
    }
    static _compilePatterns(patterns, helper, repository) {
      let r4 = [];
      if (patterns) {
        for (let i2 = 0, len = patterns.length; i2 < len; i2++) {
          const pattern = patterns[i2];
          let ruleId = -1;
          if (pattern.include) {
            const reference = parseInclude(pattern.include);
            switch (reference.kind) {
              case 0:
              case 1:
                ruleId = _RuleFactory.getCompiledRuleId(repository[pattern.include], helper, repository);
                break;
              case 2:
                let localIncludedRule = repository[reference.ruleName];
                if (localIncludedRule) {
                  ruleId = _RuleFactory.getCompiledRuleId(localIncludedRule, helper, repository);
                } else {
                }
                break;
              case 3:
              case 4:
                const externalGrammarName = reference.scopeName;
                const externalGrammarInclude = reference.kind === 4 ? reference.ruleName : null;
                const externalGrammar = helper.getExternalGrammar(externalGrammarName, repository);
                if (externalGrammar) {
                  if (externalGrammarInclude) {
                    let externalIncludedRule = externalGrammar.repository[externalGrammarInclude];
                    if (externalIncludedRule) {
                      ruleId = _RuleFactory.getCompiledRuleId(externalIncludedRule, helper, externalGrammar.repository);
                    } else {
                    }
                  } else {
                    ruleId = _RuleFactory.getCompiledRuleId(externalGrammar.repository.$self, helper, externalGrammar.repository);
                  }
                } else {
                }
                break;
            }
          } else {
            ruleId = _RuleFactory.getCompiledRuleId(pattern, helper, repository);
          }
          if (ruleId !== -1) {
            const rule = helper.getRule(ruleId);
            let skipRule = false;
            if (rule instanceof IncludeOnlyRule || rule instanceof BeginEndRule || rule instanceof BeginWhileRule) {
              if (rule.hasMissingPatterns && rule.patterns.length === 0) {
                skipRule = true;
              }
            }
            if (skipRule) {
              continue;
            }
            r4.push(ruleId);
          }
        }
      }
      return {
        patterns: r4,
        hasMissingPatterns: (patterns ? patterns.length : 0) !== r4.length
      };
    }
  };
  var RegExpSource = class _RegExpSource {
    source;
    ruleId;
    hasAnchor;
    hasBackReferences;
    _anchorCache;
    constructor(regExpSource, ruleId) {
      if (regExpSource && typeof regExpSource === "string") {
        const len = regExpSource.length;
        let lastPushedPos = 0;
        let output = [];
        let hasAnchor = false;
        for (let pos = 0; pos < len; pos++) {
          const ch = regExpSource.charAt(pos);
          if (ch === "\\") {
            if (pos + 1 < len) {
              const nextCh = regExpSource.charAt(pos + 1);
              if (nextCh === "z") {
                output.push(regExpSource.substring(lastPushedPos, pos));
                output.push("$(?!\\n)(?<!\\n)");
                lastPushedPos = pos + 2;
              } else if (nextCh === "A" || nextCh === "G") {
                hasAnchor = true;
              }
              pos++;
            }
          }
        }
        this.hasAnchor = hasAnchor;
        if (lastPushedPos === 0) {
          this.source = regExpSource;
        } else {
          output.push(regExpSource.substring(lastPushedPos, len));
          this.source = output.join("");
        }
      } else {
        this.hasAnchor = false;
        this.source = regExpSource;
      }
      if (this.hasAnchor) {
        this._anchorCache = this._buildAnchorCache();
      } else {
        this._anchorCache = null;
      }
      this.ruleId = ruleId;
      if (typeof this.source === "string") {
        this.hasBackReferences = HAS_BACK_REFERENCES.test(this.source);
      } else {
        this.hasBackReferences = false;
      }
    }
    clone() {
      return new _RegExpSource(this.source, this.ruleId);
    }
    setSource(newSource) {
      if (this.source === newSource) {
        return;
      }
      this.source = newSource;
      if (this.hasAnchor) {
        this._anchorCache = this._buildAnchorCache();
      }
    }
    resolveBackReferences(lineText, captureIndices) {
      if (typeof this.source !== "string") {
        throw new Error("This method should only be called if the source is a string");
      }
      let capturedValues = captureIndices.map((capture) => {
        return lineText.substring(capture.start, capture.end);
      });
      BACK_REFERENCING_END.lastIndex = 0;
      return this.source.replace(BACK_REFERENCING_END, (match, g1) => {
        return escapeRegExpCharacters(capturedValues[parseInt(g1, 10)] || "");
      });
    }
    _buildAnchorCache() {
      if (typeof this.source !== "string") {
        throw new Error("This method should only be called if the source is a string");
      }
      let A0_G0_result = [];
      let A0_G1_result = [];
      let A1_G0_result = [];
      let A1_G1_result = [];
      let pos, len, ch, nextCh;
      for (pos = 0, len = this.source.length; pos < len; pos++) {
        ch = this.source.charAt(pos);
        A0_G0_result[pos] = ch;
        A0_G1_result[pos] = ch;
        A1_G0_result[pos] = ch;
        A1_G1_result[pos] = ch;
        if (ch === "\\") {
          if (pos + 1 < len) {
            nextCh = this.source.charAt(pos + 1);
            if (nextCh === "A") {
              A0_G0_result[pos + 1] = "\uFFFF";
              A0_G1_result[pos + 1] = "\uFFFF";
              A1_G0_result[pos + 1] = "A";
              A1_G1_result[pos + 1] = "A";
            } else if (nextCh === "G") {
              A0_G0_result[pos + 1] = "\uFFFF";
              A0_G1_result[pos + 1] = "G";
              A1_G0_result[pos + 1] = "\uFFFF";
              A1_G1_result[pos + 1] = "G";
            } else {
              A0_G0_result[pos + 1] = nextCh;
              A0_G1_result[pos + 1] = nextCh;
              A1_G0_result[pos + 1] = nextCh;
              A1_G1_result[pos + 1] = nextCh;
            }
            pos++;
          }
        }
      }
      return {
        A0_G0: A0_G0_result.join(""),
        A0_G1: A0_G1_result.join(""),
        A1_G0: A1_G0_result.join(""),
        A1_G1: A1_G1_result.join("")
      };
    }
    resolveAnchors(allowA, allowG) {
      if (!this.hasAnchor || !this._anchorCache || typeof this.source !== "string") {
        return this.source;
      }
      if (allowA) {
        if (allowG) {
          return this._anchorCache.A1_G1;
        } else {
          return this._anchorCache.A1_G0;
        }
      } else {
        if (allowG) {
          return this._anchorCache.A0_G1;
        } else {
          return this._anchorCache.A0_G0;
        }
      }
    }
  };
  var RegExpSourceList = class {
    _items;
    _hasAnchors;
    _cached;
    _anchorCache;
    constructor() {
      this._items = [];
      this._hasAnchors = false;
      this._cached = null;
      this._anchorCache = {
        A0_G0: null,
        A0_G1: null,
        A1_G0: null,
        A1_G1: null
      };
    }
    dispose() {
      this._disposeCaches();
    }
    _disposeCaches() {
      if (this._cached) {
        this._cached.dispose();
        this._cached = null;
      }
      if (this._anchorCache.A0_G0) {
        this._anchorCache.A0_G0.dispose();
        this._anchorCache.A0_G0 = null;
      }
      if (this._anchorCache.A0_G1) {
        this._anchorCache.A0_G1.dispose();
        this._anchorCache.A0_G1 = null;
      }
      if (this._anchorCache.A1_G0) {
        this._anchorCache.A1_G0.dispose();
        this._anchorCache.A1_G0 = null;
      }
      if (this._anchorCache.A1_G1) {
        this._anchorCache.A1_G1.dispose();
        this._anchorCache.A1_G1 = null;
      }
    }
    push(item) {
      this._items.push(item);
      this._hasAnchors = this._hasAnchors || item.hasAnchor;
    }
    unshift(item) {
      this._items.unshift(item);
      this._hasAnchors = this._hasAnchors || item.hasAnchor;
    }
    length() {
      return this._items.length;
    }
    setSource(index, newSource) {
      if (this._items[index].source !== newSource) {
        this._disposeCaches();
        this._items[index].setSource(newSource);
      }
    }
    compile(onigLib) {
      if (!this._cached) {
        let regExps = this._items.map((e) => e.source);
        this._cached = new CompiledRule(onigLib, regExps, this._items.map((e) => e.ruleId));
      }
      return this._cached;
    }
    compileAG(onigLib, allowA, allowG) {
      if (!this._hasAnchors) {
        return this.compile(onigLib);
      } else {
        if (allowA) {
          if (allowG) {
            if (!this._anchorCache.A1_G1) {
              this._anchorCache.A1_G1 = this._resolveAnchors(onigLib, allowA, allowG);
            }
            return this._anchorCache.A1_G1;
          } else {
            if (!this._anchorCache.A1_G0) {
              this._anchorCache.A1_G0 = this._resolveAnchors(onigLib, allowA, allowG);
            }
            return this._anchorCache.A1_G0;
          }
        } else {
          if (allowG) {
            if (!this._anchorCache.A0_G1) {
              this._anchorCache.A0_G1 = this._resolveAnchors(onigLib, allowA, allowG);
            }
            return this._anchorCache.A0_G1;
          } else {
            if (!this._anchorCache.A0_G0) {
              this._anchorCache.A0_G0 = this._resolveAnchors(onigLib, allowA, allowG);
            }
            return this._anchorCache.A0_G0;
          }
        }
      }
    }
    _resolveAnchors(onigLib, allowA, allowG) {
      let regExps = this._items.map((e) => e.resolveAnchors(allowA, allowG));
      return new CompiledRule(onigLib, regExps, this._items.map((e) => e.ruleId));
    }
  };
  var CompiledRule = class {
    constructor(onigLib, regExps, rules) {
      this.regExps = regExps;
      this.rules = rules;
      this.scanner = onigLib.createOnigScanner(regExps);
    }
    regExps;
    rules;
    scanner;
    dispose() {
      if (typeof this.scanner.dispose === "function") {
        this.scanner.dispose();
      }
    }
    toString() {
      const r4 = [];
      for (let i2 = 0, len = this.rules.length; i2 < len; i2++) {
        r4.push("   - " + this.rules[i2] + ": " + this.regExps[i2]);
      }
      return r4.join("\n");
    }
    findNextMatchSync(string, startPosition, options) {
      const result = this.scanner.findNextMatchSync(string, startPosition, options);
      if (!result) {
        return null;
      }
      return {
        ruleId: this.rules[result.index],
        captureIndices: result.captureIndices
      };
    }
  };
  var BasicScopeAttributes = class {
    constructor(languageId, tokenType) {
      this.languageId = languageId;
      this.tokenType = tokenType;
    }
    languageId;
    tokenType;
  };
  var BasicScopeAttributesProvider = class _BasicScopeAttributesProvider {
    _defaultAttributes;
    _embeddedLanguagesMatcher;
    constructor(initialLanguageId, embeddedLanguages) {
      this._defaultAttributes = new BasicScopeAttributes(
        initialLanguageId,
        8
        /* NotSet */
      );
      this._embeddedLanguagesMatcher = new ScopeMatcher(Object.entries(embeddedLanguages || {}));
    }
    getDefaultAttributes() {
      return this._defaultAttributes;
    }
    getBasicScopeAttributes(scopeName) {
      if (scopeName === null) {
        return _BasicScopeAttributesProvider._NULL_SCOPE_METADATA;
      }
      return this._getBasicScopeAttributes.get(scopeName);
    }
    static _NULL_SCOPE_METADATA = new BasicScopeAttributes(0, 0);
    _getBasicScopeAttributes = new CachedFn((scopeName) => {
      const languageId = this._scopeToLanguage(scopeName);
      const standardTokenType = this._toStandardTokenType(scopeName);
      return new BasicScopeAttributes(languageId, standardTokenType);
    });
    /**
     * Given a produced TM scope, return the language that token describes or null if unknown.
     * e.g. source.html => html, source.css.embedded.html => css, punctuation.definition.tag.html => null
     */
    _scopeToLanguage(scope) {
      return this._embeddedLanguagesMatcher.match(scope) || 0;
    }
    _toStandardTokenType(scopeName) {
      const m4 = scopeName.match(_BasicScopeAttributesProvider.STANDARD_TOKEN_TYPE_REGEXP);
      if (!m4) {
        return 8;
      }
      switch (m4[1]) {
        case "comment":
          return 1;
        case "string":
          return 2;
        case "regex":
          return 3;
        case "meta.embedded":
          return 0;
      }
      throw new Error("Unexpected match for standard token type!");
    }
    static STANDARD_TOKEN_TYPE_REGEXP = /\b(comment|string|regex|meta\.embedded)\b/;
  };
  var ScopeMatcher = class {
    values;
    scopesRegExp;
    constructor(values) {
      if (values.length === 0) {
        this.values = null;
        this.scopesRegExp = null;
      } else {
        this.values = new Map(values);
        const escapedScopes = values.map(
          ([scopeName, value]) => escapeRegExpCharacters(scopeName)
        );
        escapedScopes.sort();
        escapedScopes.reverse();
        this.scopesRegExp = new RegExp(
          `^((${escapedScopes.join(")|(")}))($|\\.)`,
          ""
        );
      }
    }
    match(scope) {
      if (!this.scopesRegExp) {
        return void 0;
      }
      const m4 = scope.match(this.scopesRegExp);
      if (!m4) {
        return void 0;
      }
      return this.values.get(m4[1]);
    }
  };
  var DebugFlags = {
    InDebugMode: typeof process !== "undefined" && !!process.env["VSCODE_TEXTMATE_DEBUG"]
  };
  var UseOnigurumaFindOptions = false;
  var TokenizeStringResult = class {
    constructor(stack, stoppedEarly) {
      this.stack = stack;
      this.stoppedEarly = stoppedEarly;
    }
    stack;
    stoppedEarly;
  };
  function _tokenizeString(grammar, lineText, isFirstLine, linePos, stack, lineTokens, checkWhileConditions, timeLimit) {
    const lineLength = lineText.content.length;
    let STOP = false;
    let anchorPosition = -1;
    if (checkWhileConditions) {
      const whileCheckResult = _checkWhileConditions(
        grammar,
        lineText,
        isFirstLine,
        linePos,
        stack,
        lineTokens
      );
      stack = whileCheckResult.stack;
      linePos = whileCheckResult.linePos;
      isFirstLine = whileCheckResult.isFirstLine;
      anchorPosition = whileCheckResult.anchorPosition;
    }
    const startTime = Date.now();
    while (!STOP) {
      if (timeLimit !== 0) {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime > timeLimit) {
          return new TokenizeStringResult(stack, true);
        }
      }
      scanNext();
    }
    return new TokenizeStringResult(stack, false);
    function scanNext() {
      if (false) {
        console.log("");
        console.log(
          `@@scanNext ${linePos}: |${lineText.content.substr(linePos).replace(/\n$/, "\\n")}|`
        );
      }
      const r4 = matchRuleOrInjections(
        grammar,
        lineText,
        isFirstLine,
        linePos,
        stack,
        anchorPosition
      );
      if (!r4) {
        lineTokens.produce(stack, lineLength);
        STOP = true;
        return;
      }
      const captureIndices = r4.captureIndices;
      const matchedRuleId = r4.matchedRuleId;
      const hasAdvanced = captureIndices && captureIndices.length > 0 ? captureIndices[0].end > linePos : false;
      if (matchedRuleId === endRuleId) {
        const poppedRule = stack.getRule(grammar);
        if (false) {
          console.log(
            "  popping " + poppedRule.debugName + " - " + poppedRule.debugEndRegExp
          );
        }
        lineTokens.produce(stack, captureIndices[0].start);
        stack = stack.withContentNameScopesList(stack.nameScopesList);
        handleCaptures(
          grammar,
          lineText,
          isFirstLine,
          stack,
          lineTokens,
          poppedRule.endCaptures,
          captureIndices
        );
        lineTokens.produce(stack, captureIndices[0].end);
        const popped = stack;
        stack = stack.parent;
        anchorPosition = popped.getAnchorPos();
        if (!hasAdvanced && popped.getEnterPos() === linePos) {
          if (false) {
            console.error(
              "[1] - Grammar is in an endless loop - Grammar pushed & popped a rule without advancing"
            );
          }
          stack = popped;
          lineTokens.produce(stack, lineLength);
          STOP = true;
          return;
        }
      } else {
        const _rule = grammar.getRule(matchedRuleId);
        lineTokens.produce(stack, captureIndices[0].start);
        const beforePush = stack;
        const scopeName = _rule.getName(lineText.content, captureIndices);
        const nameScopesList = stack.contentNameScopesList.pushAttributed(
          scopeName,
          grammar
        );
        stack = stack.push(
          matchedRuleId,
          linePos,
          anchorPosition,
          captureIndices[0].end === lineLength,
          null,
          nameScopesList,
          nameScopesList
        );
        if (_rule instanceof BeginEndRule) {
          const pushedRule = _rule;
          if (false) {
            console.log(
              "  pushing " + pushedRule.debugName + " - " + pushedRule.debugBeginRegExp
            );
          }
          handleCaptures(
            grammar,
            lineText,
            isFirstLine,
            stack,
            lineTokens,
            pushedRule.beginCaptures,
            captureIndices
          );
          lineTokens.produce(stack, captureIndices[0].end);
          anchorPosition = captureIndices[0].end;
          const contentName = pushedRule.getContentName(
            lineText.content,
            captureIndices
          );
          const contentNameScopesList = nameScopesList.pushAttributed(
            contentName,
            grammar
          );
          stack = stack.withContentNameScopesList(contentNameScopesList);
          if (pushedRule.endHasBackReferences) {
            stack = stack.withEndRule(
              pushedRule.getEndWithResolvedBackReferences(
                lineText.content,
                captureIndices
              )
            );
          }
          if (!hasAdvanced && beforePush.hasSameRuleAs(stack)) {
            if (false) {
              console.error(
                "[2] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"
              );
            }
            stack = stack.pop();
            lineTokens.produce(stack, lineLength);
            STOP = true;
            return;
          }
        } else if (_rule instanceof BeginWhileRule) {
          const pushedRule = _rule;
          if (false) {
            console.log("  pushing " + pushedRule.debugName);
          }
          handleCaptures(
            grammar,
            lineText,
            isFirstLine,
            stack,
            lineTokens,
            pushedRule.beginCaptures,
            captureIndices
          );
          lineTokens.produce(stack, captureIndices[0].end);
          anchorPosition = captureIndices[0].end;
          const contentName = pushedRule.getContentName(
            lineText.content,
            captureIndices
          );
          const contentNameScopesList = nameScopesList.pushAttributed(
            contentName,
            grammar
          );
          stack = stack.withContentNameScopesList(contentNameScopesList);
          if (pushedRule.whileHasBackReferences) {
            stack = stack.withEndRule(
              pushedRule.getWhileWithResolvedBackReferences(
                lineText.content,
                captureIndices
              )
            );
          }
          if (!hasAdvanced && beforePush.hasSameRuleAs(stack)) {
            if (false) {
              console.error(
                "[3] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"
              );
            }
            stack = stack.pop();
            lineTokens.produce(stack, lineLength);
            STOP = true;
            return;
          }
        } else {
          const matchingRule = _rule;
          if (false) {
            console.log(
              "  matched " + matchingRule.debugName + " - " + matchingRule.debugMatchRegExp
            );
          }
          handleCaptures(
            grammar,
            lineText,
            isFirstLine,
            stack,
            lineTokens,
            matchingRule.captures,
            captureIndices
          );
          lineTokens.produce(stack, captureIndices[0].end);
          stack = stack.pop();
          if (!hasAdvanced) {
            if (false) {
              console.error(
                "[4] - Grammar is in an endless loop - Grammar is not advancing, nor is it pushing/popping"
              );
            }
            stack = stack.safePop();
            lineTokens.produce(stack, lineLength);
            STOP = true;
            return;
          }
        }
      }
      if (captureIndices[0].end > linePos) {
        linePos = captureIndices[0].end;
        isFirstLine = false;
      }
    }
  }
  function _checkWhileConditions(grammar, lineText, isFirstLine, linePos, stack, lineTokens) {
    let anchorPosition = stack.beginRuleCapturedEOL ? 0 : -1;
    const whileRules = [];
    for (let node = stack; node; node = node.pop()) {
      const nodeRule = node.getRule(grammar);
      if (nodeRule instanceof BeginWhileRule) {
        whileRules.push({
          rule: nodeRule,
          stack: node
        });
      }
    }
    for (let whileRule = whileRules.pop(); whileRule; whileRule = whileRules.pop()) {
      const { ruleScanner, findOptions } = prepareRuleWhileSearch(whileRule.rule, grammar, whileRule.stack.endRule, isFirstLine, linePos === anchorPosition);
      const r4 = ruleScanner.findNextMatchSync(lineText, linePos, findOptions);
      if (false) {
        console.log("  scanning for while rule");
        console.log(ruleScanner.toString());
      }
      if (r4) {
        const matchedRuleId = r4.ruleId;
        if (matchedRuleId !== whileRuleId) {
          stack = whileRule.stack.pop();
          break;
        }
        if (r4.captureIndices && r4.captureIndices.length) {
          lineTokens.produce(whileRule.stack, r4.captureIndices[0].start);
          handleCaptures(grammar, lineText, isFirstLine, whileRule.stack, lineTokens, whileRule.rule.whileCaptures, r4.captureIndices);
          lineTokens.produce(whileRule.stack, r4.captureIndices[0].end);
          anchorPosition = r4.captureIndices[0].end;
          if (r4.captureIndices[0].end > linePos) {
            linePos = r4.captureIndices[0].end;
            isFirstLine = false;
          }
        }
      } else {
        if (false) {
          console.log("  popping " + whileRule.rule.debugName + " - " + whileRule.rule.debugWhileRegExp);
        }
        stack = whileRule.stack.pop();
        break;
      }
    }
    return { stack, linePos, anchorPosition, isFirstLine };
  }
  function matchRuleOrInjections(grammar, lineText, isFirstLine, linePos, stack, anchorPosition) {
    const matchResult = matchRule(grammar, lineText, isFirstLine, linePos, stack, anchorPosition);
    const injections = grammar.getInjections();
    if (injections.length === 0) {
      return matchResult;
    }
    const injectionResult = matchInjections(injections, grammar, lineText, isFirstLine, linePos, stack, anchorPosition);
    if (!injectionResult) {
      return matchResult;
    }
    if (!matchResult) {
      return injectionResult;
    }
    const matchResultScore = matchResult.captureIndices[0].start;
    const injectionResultScore = injectionResult.captureIndices[0].start;
    if (injectionResultScore < matchResultScore || injectionResult.priorityMatch && injectionResultScore === matchResultScore) {
      return injectionResult;
    }
    return matchResult;
  }
  function matchRule(grammar, lineText, isFirstLine, linePos, stack, anchorPosition) {
    const rule = stack.getRule(grammar);
    const { ruleScanner, findOptions } = prepareRuleSearch(rule, grammar, stack.endRule, isFirstLine, linePos === anchorPosition);
    const r4 = ruleScanner.findNextMatchSync(lineText, linePos, findOptions);
    if (r4) {
      return {
        captureIndices: r4.captureIndices,
        matchedRuleId: r4.ruleId
      };
    }
    return null;
  }
  function matchInjections(injections, grammar, lineText, isFirstLine, linePos, stack, anchorPosition) {
    let bestMatchRating = Number.MAX_VALUE;
    let bestMatchCaptureIndices = null;
    let bestMatchRuleId;
    let bestMatchResultPriority = 0;
    const scopes = stack.contentNameScopesList.getScopeNames();
    for (let i2 = 0, len = injections.length; i2 < len; i2++) {
      const injection = injections[i2];
      if (!injection.matcher(scopes)) {
        continue;
      }
      const rule = grammar.getRule(injection.ruleId);
      const { ruleScanner, findOptions } = prepareRuleSearch(rule, grammar, null, isFirstLine, linePos === anchorPosition);
      const matchResult = ruleScanner.findNextMatchSync(lineText, linePos, findOptions);
      if (!matchResult) {
        continue;
      }
      if (false) {
        console.log(`  matched injection: ${injection.debugSelector}`);
        console.log(ruleScanner.toString());
      }
      const matchRating = matchResult.captureIndices[0].start;
      if (matchRating >= bestMatchRating) {
        continue;
      }
      bestMatchRating = matchRating;
      bestMatchCaptureIndices = matchResult.captureIndices;
      bestMatchRuleId = matchResult.ruleId;
      bestMatchResultPriority = injection.priority;
      if (bestMatchRating === linePos) {
        break;
      }
    }
    if (bestMatchCaptureIndices) {
      return {
        priorityMatch: bestMatchResultPriority === -1,
        captureIndices: bestMatchCaptureIndices,
        matchedRuleId: bestMatchRuleId
      };
    }
    return null;
  }
  function prepareRuleSearch(rule, grammar, endRegexSource, allowA, allowG) {
    if (UseOnigurumaFindOptions) {
      const ruleScanner2 = rule.compile(grammar, endRegexSource);
      const findOptions = getFindOptions(allowA, allowG);
      return { ruleScanner: ruleScanner2, findOptions };
    }
    const ruleScanner = rule.compileAG(grammar, endRegexSource, allowA, allowG);
    return {
      ruleScanner,
      findOptions: 0
      /* None */
    };
  }
  function prepareRuleWhileSearch(rule, grammar, endRegexSource, allowA, allowG) {
    if (UseOnigurumaFindOptions) {
      const ruleScanner2 = rule.compileWhile(grammar, endRegexSource);
      const findOptions = getFindOptions(allowA, allowG);
      return { ruleScanner: ruleScanner2, findOptions };
    }
    const ruleScanner = rule.compileWhileAG(grammar, endRegexSource, allowA, allowG);
    return {
      ruleScanner,
      findOptions: 0
      /* None */
    };
  }
  function getFindOptions(allowA, allowG) {
    let options = 0;
    if (!allowA) {
      options |= 1;
    }
    if (!allowG) {
      options |= 4;
    }
    return options;
  }
  function handleCaptures(grammar, lineText, isFirstLine, stack, lineTokens, captures, captureIndices) {
    if (captures.length === 0) {
      return;
    }
    const lineTextContent = lineText.content;
    const len = Math.min(captures.length, captureIndices.length);
    const localStack = [];
    const maxEnd = captureIndices[0].end;
    for (let i2 = 0; i2 < len; i2++) {
      const captureRule = captures[i2];
      if (captureRule === null) {
        continue;
      }
      const captureIndex = captureIndices[i2];
      if (captureIndex.length === 0) {
        continue;
      }
      if (captureIndex.start > maxEnd) {
        break;
      }
      while (localStack.length > 0 && localStack[localStack.length - 1].endPos <= captureIndex.start) {
        lineTokens.produceFromScopes(localStack[localStack.length - 1].scopes, localStack[localStack.length - 1].endPos);
        localStack.pop();
      }
      if (localStack.length > 0) {
        lineTokens.produceFromScopes(localStack[localStack.length - 1].scopes, captureIndex.start);
      } else {
        lineTokens.produce(stack, captureIndex.start);
      }
      if (captureRule.retokenizeCapturedWithRuleId) {
        const scopeName = captureRule.getName(lineTextContent, captureIndices);
        const nameScopesList = stack.contentNameScopesList.pushAttributed(scopeName, grammar);
        const contentName = captureRule.getContentName(lineTextContent, captureIndices);
        const contentNameScopesList = nameScopesList.pushAttributed(contentName, grammar);
        const stackClone = stack.push(captureRule.retokenizeCapturedWithRuleId, captureIndex.start, -1, false, null, nameScopesList, contentNameScopesList);
        const onigSubStr = grammar.createOnigString(lineTextContent.substring(0, captureIndex.end));
        _tokenizeString(
          grammar,
          onigSubStr,
          isFirstLine && captureIndex.start === 0,
          captureIndex.start,
          stackClone,
          lineTokens,
          false,
          /* no time limit */
          0
        );
        disposeOnigString(onigSubStr);
        continue;
      }
      const captureRuleScopeName = captureRule.getName(lineTextContent, captureIndices);
      if (captureRuleScopeName !== null) {
        const base = localStack.length > 0 ? localStack[localStack.length - 1].scopes : stack.contentNameScopesList;
        const captureRuleScopesList = base.pushAttributed(captureRuleScopeName, grammar);
        localStack.push(new LocalStackElement(captureRuleScopesList, captureIndex.end));
      }
    }
    while (localStack.length > 0) {
      lineTokens.produceFromScopes(localStack[localStack.length - 1].scopes, localStack[localStack.length - 1].endPos);
      localStack.pop();
    }
  }
  var LocalStackElement = class {
    scopes;
    endPos;
    constructor(scopes, endPos) {
      this.scopes = scopes;
      this.endPos = endPos;
    }
  };
  function createGrammar(scopeName, grammar, initialLanguage, embeddedLanguages, tokenTypes, balancedBracketSelectors, grammarRepository, onigLib) {
    return new Grammar(
      scopeName,
      grammar,
      initialLanguage,
      embeddedLanguages,
      tokenTypes,
      balancedBracketSelectors,
      grammarRepository,
      onigLib
    );
  }
  function collectInjections(result, selector, rule, ruleFactoryHelper, grammar) {
    const matchers = createMatchers(selector, nameMatcher);
    const ruleId = RuleFactory.getCompiledRuleId(rule, ruleFactoryHelper, grammar.repository);
    for (const matcher of matchers) {
      result.push({
        debugSelector: selector,
        matcher: matcher.matcher,
        ruleId,
        grammar,
        priority: matcher.priority
      });
    }
  }
  function nameMatcher(identifers, scopes) {
    if (scopes.length < identifers.length) {
      return false;
    }
    let lastIndex = 0;
    return identifers.every((identifier) => {
      for (let i2 = lastIndex; i2 < scopes.length; i2++) {
        if (scopesAreMatching(scopes[i2], identifier)) {
          lastIndex = i2 + 1;
          return true;
        }
      }
      return false;
    });
  }
  function scopesAreMatching(thisScopeName, scopeName) {
    if (!thisScopeName) {
      return false;
    }
    if (thisScopeName === scopeName) {
      return true;
    }
    const len = scopeName.length;
    return thisScopeName.length > len && thisScopeName.substr(0, len) === scopeName && thisScopeName[len] === ".";
  }
  var Grammar = class {
    constructor(_rootScopeName, grammar, initialLanguage, embeddedLanguages, tokenTypes, balancedBracketSelectors, grammarRepository, _onigLib) {
      this._rootScopeName = _rootScopeName;
      this.balancedBracketSelectors = balancedBracketSelectors;
      this._onigLib = _onigLib;
      this._basicScopeAttributesProvider = new BasicScopeAttributesProvider(
        initialLanguage,
        embeddedLanguages
      );
      this._rootId = -1;
      this._lastRuleId = 0;
      this._ruleId2desc = [null];
      this._includedGrammars = {};
      this._grammarRepository = grammarRepository;
      this._grammar = initGrammar(grammar, null);
      this._injections = null;
      this._tokenTypeMatchers = [];
      if (tokenTypes) {
        for (const selector of Object.keys(tokenTypes)) {
          const matchers = createMatchers(selector, nameMatcher);
          for (const matcher of matchers) {
            this._tokenTypeMatchers.push({
              matcher: matcher.matcher,
              type: tokenTypes[selector]
            });
          }
        }
      }
    }
    _rootScopeName;
    balancedBracketSelectors;
    _onigLib;
    _rootId;
    _lastRuleId;
    _ruleId2desc;
    _includedGrammars;
    _grammarRepository;
    _grammar;
    _injections;
    _basicScopeAttributesProvider;
    _tokenTypeMatchers;
    get themeProvider() {
      return this._grammarRepository;
    }
    dispose() {
      for (const rule of this._ruleId2desc) {
        if (rule) {
          rule.dispose();
        }
      }
    }
    createOnigScanner(sources) {
      return this._onigLib.createOnigScanner(sources);
    }
    createOnigString(sources) {
      return this._onigLib.createOnigString(sources);
    }
    getMetadataForScope(scope) {
      return this._basicScopeAttributesProvider.getBasicScopeAttributes(scope);
    }
    _collectInjections() {
      const grammarRepository = {
        lookup: (scopeName2) => {
          if (scopeName2 === this._rootScopeName) {
            return this._grammar;
          }
          return this.getExternalGrammar(scopeName2);
        },
        injections: (scopeName2) => {
          return this._grammarRepository.injections(scopeName2);
        }
      };
      const result = [];
      const scopeName = this._rootScopeName;
      const grammar = grammarRepository.lookup(scopeName);
      if (grammar) {
        const rawInjections = grammar.injections;
        if (rawInjections) {
          for (let expression in rawInjections) {
            collectInjections(
              result,
              expression,
              rawInjections[expression],
              this,
              grammar
            );
          }
        }
        const injectionScopeNames = this._grammarRepository.injections(scopeName);
        if (injectionScopeNames) {
          injectionScopeNames.forEach((injectionScopeName) => {
            const injectionGrammar = this.getExternalGrammar(injectionScopeName);
            if (injectionGrammar) {
              const selector = injectionGrammar.injectionSelector;
              if (selector) {
                collectInjections(
                  result,
                  selector,
                  injectionGrammar,
                  this,
                  injectionGrammar
                );
              }
            }
          });
        }
      }
      result.sort((i1, i2) => i1.priority - i2.priority);
      return result;
    }
    getInjections() {
      if (this._injections === null) {
        this._injections = this._collectInjections();
      }
      return this._injections;
    }
    registerRule(factory) {
      const id = ++this._lastRuleId;
      const result = factory(ruleIdFromNumber(id));
      this._ruleId2desc[id] = result;
      return result;
    }
    getRule(ruleId) {
      return this._ruleId2desc[ruleIdToNumber(ruleId)];
    }
    getExternalGrammar(scopeName, repository) {
      if (this._includedGrammars[scopeName]) {
        return this._includedGrammars[scopeName];
      } else if (this._grammarRepository) {
        const rawIncludedGrammar = this._grammarRepository.lookup(scopeName);
        if (rawIncludedGrammar) {
          this._includedGrammars[scopeName] = initGrammar(
            rawIncludedGrammar,
            repository && repository.$base
          );
          return this._includedGrammars[scopeName];
        }
      }
      return void 0;
    }
    tokenizeLine(lineText, prevState, timeLimit = 0) {
      const r4 = this._tokenize(lineText, prevState, false, timeLimit);
      return {
        tokens: r4.lineTokens.getResult(r4.ruleStack, r4.lineLength),
        ruleStack: r4.ruleStack,
        stoppedEarly: r4.stoppedEarly
      };
    }
    tokenizeLine2(lineText, prevState, timeLimit = 0) {
      const r4 = this._tokenize(lineText, prevState, true, timeLimit);
      return {
        tokens: r4.lineTokens.getBinaryResult(r4.ruleStack, r4.lineLength),
        ruleStack: r4.ruleStack,
        stoppedEarly: r4.stoppedEarly
      };
    }
    _tokenize(lineText, prevState, emitBinaryTokens, timeLimit) {
      if (this._rootId === -1) {
        this._rootId = RuleFactory.getCompiledRuleId(
          this._grammar.repository.$self,
          this,
          this._grammar.repository
        );
        this.getInjections();
      }
      let isFirstLine;
      if (!prevState || prevState === StateStackImpl.NULL) {
        isFirstLine = true;
        const rawDefaultMetadata = this._basicScopeAttributesProvider.getDefaultAttributes();
        const defaultStyle = this.themeProvider.getDefaults();
        const defaultMetadata = EncodedTokenMetadata.set(
          0,
          rawDefaultMetadata.languageId,
          rawDefaultMetadata.tokenType,
          null,
          defaultStyle.fontStyle,
          defaultStyle.foregroundId,
          defaultStyle.backgroundId
        );
        const rootScopeName = this.getRule(this._rootId).getName(
          null,
          null
        );
        let scopeList;
        if (rootScopeName) {
          scopeList = AttributedScopeStack.createRootAndLookUpScopeName(
            rootScopeName,
            defaultMetadata,
            this
          );
        } else {
          scopeList = AttributedScopeStack.createRoot(
            "unknown",
            defaultMetadata
          );
        }
        prevState = new StateStackImpl(
          null,
          this._rootId,
          -1,
          -1,
          false,
          null,
          scopeList,
          scopeList
        );
      } else {
        isFirstLine = false;
        prevState.reset();
      }
      lineText = lineText + "\n";
      const onigLineText = this.createOnigString(lineText);
      const lineLength = onigLineText.content.length;
      const lineTokens = new LineTokens(
        emitBinaryTokens,
        lineText,
        this._tokenTypeMatchers,
        this.balancedBracketSelectors
      );
      const r4 = _tokenizeString(
        this,
        onigLineText,
        isFirstLine,
        0,
        prevState,
        lineTokens,
        true,
        timeLimit
      );
      disposeOnigString(onigLineText);
      return {
        lineLength,
        lineTokens,
        ruleStack: r4.stack,
        stoppedEarly: r4.stoppedEarly
      };
    }
  };
  function initGrammar(grammar, base) {
    grammar = clone(grammar);
    grammar.repository = grammar.repository || {};
    grammar.repository.$self = {
      $vscodeTextmateLocation: grammar.$vscodeTextmateLocation,
      patterns: grammar.patterns,
      name: grammar.scopeName
    };
    grammar.repository.$base = base || grammar.repository.$self;
    return grammar;
  }
  var AttributedScopeStack = class _AttributedScopeStack {
    /**
     * Invariant:
     * ```
     * if (parent && !scopePath.extends(parent.scopePath)) {
     * 	throw new Error();
     * }
     * ```
     */
    constructor(parent, scopePath, tokenAttributes) {
      this.parent = parent;
      this.scopePath = scopePath;
      this.tokenAttributes = tokenAttributes;
    }
    parent;
    scopePath;
    tokenAttributes;
    static fromExtension(namesScopeList, contentNameScopesList) {
      let current = namesScopeList;
      let scopeNames = namesScopeList?.scopePath ?? null;
      for (const frame of contentNameScopesList) {
        scopeNames = ScopeStack.push(scopeNames, frame.scopeNames);
        current = new _AttributedScopeStack(current, scopeNames, frame.encodedTokenAttributes);
      }
      return current;
    }
    static createRoot(scopeName, tokenAttributes) {
      return new _AttributedScopeStack(null, new ScopeStack(null, scopeName), tokenAttributes);
    }
    static createRootAndLookUpScopeName(scopeName, tokenAttributes, grammar) {
      const rawRootMetadata = grammar.getMetadataForScope(scopeName);
      const scopePath = new ScopeStack(null, scopeName);
      const rootStyle = grammar.themeProvider.themeMatch(scopePath);
      const resolvedTokenAttributes = _AttributedScopeStack.mergeAttributes(
        tokenAttributes,
        rawRootMetadata,
        rootStyle
      );
      return new _AttributedScopeStack(null, scopePath, resolvedTokenAttributes);
    }
    get scopeName() {
      return this.scopePath.scopeName;
    }
    toString() {
      return this.getScopeNames().join(" ");
    }
    equals(other) {
      return _AttributedScopeStack.equals(this, other);
    }
    static equals(a2, b4) {
      do {
        if (a2 === b4) {
          return true;
        }
        if (!a2 && !b4) {
          return true;
        }
        if (!a2 || !b4) {
          return false;
        }
        if (a2.scopeName !== b4.scopeName || a2.tokenAttributes !== b4.tokenAttributes) {
          return false;
        }
        a2 = a2.parent;
        b4 = b4.parent;
      } while (true);
    }
    static mergeAttributes(existingTokenAttributes, basicScopeAttributes, styleAttributes) {
      let fontStyle = -1;
      let foreground = 0;
      let background = 0;
      if (styleAttributes !== null) {
        fontStyle = styleAttributes.fontStyle;
        foreground = styleAttributes.foregroundId;
        background = styleAttributes.backgroundId;
      }
      return EncodedTokenMetadata.set(
        existingTokenAttributes,
        basicScopeAttributes.languageId,
        basicScopeAttributes.tokenType,
        null,
        fontStyle,
        foreground,
        background
      );
    }
    pushAttributed(scopePath, grammar) {
      if (scopePath === null) {
        return this;
      }
      if (scopePath.indexOf(" ") === -1) {
        return _AttributedScopeStack._pushAttributed(this, scopePath, grammar);
      }
      const scopes = scopePath.split(/ /g);
      let result = this;
      for (const scope of scopes) {
        result = _AttributedScopeStack._pushAttributed(result, scope, grammar);
      }
      return result;
    }
    static _pushAttributed(target, scopeName, grammar) {
      const rawMetadata = grammar.getMetadataForScope(scopeName);
      const newPath = target.scopePath.push(scopeName);
      const scopeThemeMatchResult = grammar.themeProvider.themeMatch(newPath);
      const metadata = _AttributedScopeStack.mergeAttributes(
        target.tokenAttributes,
        rawMetadata,
        scopeThemeMatchResult
      );
      return new _AttributedScopeStack(target, newPath, metadata);
    }
    getScopeNames() {
      return this.scopePath.getSegments();
    }
    getExtensionIfDefined(base) {
      const result = [];
      let self = this;
      while (self && self !== base) {
        result.push({
          encodedTokenAttributes: self.tokenAttributes,
          scopeNames: self.scopePath.getExtensionIfDefined(self.parent?.scopePath ?? null)
        });
        self = self.parent;
      }
      return self === base ? result.reverse() : void 0;
    }
  };
  var StateStackImpl = class _StateStackImpl {
    /**
     * Invariant:
     * ```
     * if (contentNameScopesList !== nameScopesList && contentNameScopesList?.parent !== nameScopesList) {
     * 	throw new Error();
     * }
     * if (this.parent && !nameScopesList.extends(this.parent.contentNameScopesList)) {
     * 	throw new Error();
     * }
     * ```
     */
    constructor(parent, ruleId, enterPos, anchorPos, beginRuleCapturedEOL, endRule, nameScopesList, contentNameScopesList) {
      this.parent = parent;
      this.ruleId = ruleId;
      this.beginRuleCapturedEOL = beginRuleCapturedEOL;
      this.endRule = endRule;
      this.nameScopesList = nameScopesList;
      this.contentNameScopesList = contentNameScopesList;
      this.depth = this.parent ? this.parent.depth + 1 : 1;
      this._enterPos = enterPos;
      this._anchorPos = anchorPos;
    }
    parent;
    ruleId;
    beginRuleCapturedEOL;
    endRule;
    nameScopesList;
    contentNameScopesList;
    _stackElementBrand = void 0;
    // TODO remove me
    static NULL = new _StateStackImpl(
      null,
      0,
      0,
      0,
      false,
      null,
      null,
      null
    );
    /**
     * The position on the current line where this state was pushed.
     * This is relevant only while tokenizing a line, to detect endless loops.
     * Its value is meaningless across lines.
     */
    _enterPos;
    /**
     * The captured anchor position when this stack element was pushed.
     * This is relevant only while tokenizing a line, to restore the anchor position when popping.
     * Its value is meaningless across lines.
     */
    _anchorPos;
    /**
     * The depth of the stack.
     */
    depth;
    equals(other) {
      if (other === null) {
        return false;
      }
      return _StateStackImpl._equals(this, other);
    }
    static _equals(a2, b4) {
      if (a2 === b4) {
        return true;
      }
      if (!this._structuralEquals(a2, b4)) {
        return false;
      }
      return AttributedScopeStack.equals(a2.contentNameScopesList, b4.contentNameScopesList);
    }
    /**
     * A structural equals check. Does not take into account `scopes`.
     */
    static _structuralEquals(a2, b4) {
      do {
        if (a2 === b4) {
          return true;
        }
        if (!a2 && !b4) {
          return true;
        }
        if (!a2 || !b4) {
          return false;
        }
        if (a2.depth !== b4.depth || a2.ruleId !== b4.ruleId || a2.endRule !== b4.endRule) {
          return false;
        }
        a2 = a2.parent;
        b4 = b4.parent;
      } while (true);
    }
    clone() {
      return this;
    }
    static _reset(el) {
      while (el) {
        el._enterPos = -1;
        el._anchorPos = -1;
        el = el.parent;
      }
    }
    reset() {
      _StateStackImpl._reset(this);
    }
    pop() {
      return this.parent;
    }
    safePop() {
      if (this.parent) {
        return this.parent;
      }
      return this;
    }
    push(ruleId, enterPos, anchorPos, beginRuleCapturedEOL, endRule, nameScopesList, contentNameScopesList) {
      return new _StateStackImpl(
        this,
        ruleId,
        enterPos,
        anchorPos,
        beginRuleCapturedEOL,
        endRule,
        nameScopesList,
        contentNameScopesList
      );
    }
    getEnterPos() {
      return this._enterPos;
    }
    getAnchorPos() {
      return this._anchorPos;
    }
    getRule(grammar) {
      return grammar.getRule(this.ruleId);
    }
    toString() {
      const r4 = [];
      this._writeString(r4, 0);
      return "[" + r4.join(",") + "]";
    }
    _writeString(res, outIndex) {
      if (this.parent) {
        outIndex = this.parent._writeString(res, outIndex);
      }
      res[outIndex++] = `(${this.ruleId}, ${this.nameScopesList?.toString()}, ${this.contentNameScopesList?.toString()})`;
      return outIndex;
    }
    withContentNameScopesList(contentNameScopeStack) {
      if (this.contentNameScopesList === contentNameScopeStack) {
        return this;
      }
      return this.parent.push(
        this.ruleId,
        this._enterPos,
        this._anchorPos,
        this.beginRuleCapturedEOL,
        this.endRule,
        this.nameScopesList,
        contentNameScopeStack
      );
    }
    withEndRule(endRule) {
      if (this.endRule === endRule) {
        return this;
      }
      return new _StateStackImpl(
        this.parent,
        this.ruleId,
        this._enterPos,
        this._anchorPos,
        this.beginRuleCapturedEOL,
        endRule,
        this.nameScopesList,
        this.contentNameScopesList
      );
    }
    // Used to warn of endless loops
    hasSameRuleAs(other) {
      let el = this;
      while (el && el._enterPos === other._enterPos) {
        if (el.ruleId === other.ruleId) {
          return true;
        }
        el = el.parent;
      }
      return false;
    }
    toStateStackFrame() {
      return {
        ruleId: ruleIdToNumber(this.ruleId),
        beginRuleCapturedEOL: this.beginRuleCapturedEOL,
        endRule: this.endRule,
        nameScopesList: this.nameScopesList?.getExtensionIfDefined(this.parent?.nameScopesList ?? null) ?? [],
        contentNameScopesList: this.contentNameScopesList?.getExtensionIfDefined(this.nameScopesList) ?? []
      };
    }
    static pushFrame(self, frame) {
      const namesScopeList = AttributedScopeStack.fromExtension(self?.nameScopesList ?? null, frame.nameScopesList);
      return new _StateStackImpl(
        self,
        ruleIdFromNumber(frame.ruleId),
        frame.enterPos ?? -1,
        frame.anchorPos ?? -1,
        frame.beginRuleCapturedEOL,
        frame.endRule,
        namesScopeList,
        AttributedScopeStack.fromExtension(namesScopeList, frame.contentNameScopesList)
      );
    }
  };
  var BalancedBracketSelectors = class {
    balancedBracketScopes;
    unbalancedBracketScopes;
    allowAny = false;
    constructor(balancedBracketScopes, unbalancedBracketScopes) {
      this.balancedBracketScopes = balancedBracketScopes.flatMap(
        (selector) => {
          if (selector === "*") {
            this.allowAny = true;
            return [];
          }
          return createMatchers(selector, nameMatcher).map((m4) => m4.matcher);
        }
      );
      this.unbalancedBracketScopes = unbalancedBracketScopes.flatMap(
        (selector) => createMatchers(selector, nameMatcher).map((m4) => m4.matcher)
      );
    }
    get matchesAlways() {
      return this.allowAny && this.unbalancedBracketScopes.length === 0;
    }
    get matchesNever() {
      return this.balancedBracketScopes.length === 0 && !this.allowAny;
    }
    match(scopes) {
      for (const excluder of this.unbalancedBracketScopes) {
        if (excluder(scopes)) {
          return false;
        }
      }
      for (const includer of this.balancedBracketScopes) {
        if (includer(scopes)) {
          return true;
        }
      }
      return this.allowAny;
    }
  };
  var LineTokens = class {
    constructor(emitBinaryTokens, lineText, tokenTypeOverrides, balancedBracketSelectors) {
      this.balancedBracketSelectors = balancedBracketSelectors;
      this._emitBinaryTokens = emitBinaryTokens;
      this._tokenTypeOverrides = tokenTypeOverrides;
      if (false) {
        this._lineText = lineText;
      } else {
        this._lineText = null;
      }
      this._tokens = [];
      this._binaryTokens = [];
      this._lastTokenEndIndex = 0;
    }
    balancedBracketSelectors;
    _emitBinaryTokens;
    /**
     * defined only if `false`.
     */
    _lineText;
    /**
     * used only if `_emitBinaryTokens` is false.
     */
    _tokens;
    /**
     * used only if `_emitBinaryTokens` is true.
     */
    _binaryTokens;
    _lastTokenEndIndex;
    _tokenTypeOverrides;
    produce(stack, endIndex) {
      this.produceFromScopes(stack.contentNameScopesList, endIndex);
    }
    produceFromScopes(scopesList, endIndex) {
      if (this._lastTokenEndIndex >= endIndex) {
        return;
      }
      if (this._emitBinaryTokens) {
        let metadata = scopesList?.tokenAttributes ?? 0;
        let containsBalancedBrackets = false;
        if (this.balancedBracketSelectors?.matchesAlways) {
          containsBalancedBrackets = true;
        }
        if (this._tokenTypeOverrides.length > 0 || this.balancedBracketSelectors && !this.balancedBracketSelectors.matchesAlways && !this.balancedBracketSelectors.matchesNever) {
          const scopes2 = scopesList?.getScopeNames() ?? [];
          for (const tokenType of this._tokenTypeOverrides) {
            if (tokenType.matcher(scopes2)) {
              metadata = EncodedTokenMetadata.set(
                metadata,
                0,
                toOptionalTokenType(tokenType.type),
                null,
                -1,
                0,
                0
              );
            }
          }
          if (this.balancedBracketSelectors) {
            containsBalancedBrackets = this.balancedBracketSelectors.match(scopes2);
          }
        }
        if (containsBalancedBrackets) {
          metadata = EncodedTokenMetadata.set(
            metadata,
            0,
            8,
            containsBalancedBrackets,
            -1,
            0,
            0
          );
        }
        if (this._binaryTokens.length > 0 && this._binaryTokens[this._binaryTokens.length - 1] === metadata) {
          this._lastTokenEndIndex = endIndex;
          return;
        }
        this._binaryTokens.push(this._lastTokenEndIndex);
        this._binaryTokens.push(metadata);
        this._lastTokenEndIndex = endIndex;
        return;
      }
      const scopes = scopesList?.getScopeNames() ?? [];
      this._tokens.push({
        startIndex: this._lastTokenEndIndex,
        endIndex,
        // value: lineText.substring(lastTokenEndIndex, endIndex),
        scopes
      });
      this._lastTokenEndIndex = endIndex;
    }
    getResult(stack, lineLength) {
      if (this._tokens.length > 0 && this._tokens[this._tokens.length - 1].startIndex === lineLength - 1) {
        this._tokens.pop();
      }
      if (this._tokens.length === 0) {
        this._lastTokenEndIndex = -1;
        this.produce(stack, lineLength);
        this._tokens[this._tokens.length - 1].startIndex = 0;
      }
      return this._tokens;
    }
    getBinaryResult(stack, lineLength) {
      if (this._binaryTokens.length > 0 && this._binaryTokens[this._binaryTokens.length - 2] === lineLength - 1) {
        this._binaryTokens.pop();
        this._binaryTokens.pop();
      }
      if (this._binaryTokens.length === 0) {
        this._lastTokenEndIndex = -1;
        this.produce(stack, lineLength);
        this._binaryTokens[this._binaryTokens.length - 2] = 0;
      }
      const result = new Uint32Array(this._binaryTokens.length);
      for (let i2 = 0, len = this._binaryTokens.length; i2 < len; i2++) {
        result[i2] = this._binaryTokens[i2];
      }
      return result;
    }
  };
  var SyncRegistry = class {
    constructor(theme, _onigLib) {
      this._onigLib = _onigLib;
      this._theme = theme;
    }
    _onigLib;
    _grammars = /* @__PURE__ */ new Map();
    _rawGrammars = /* @__PURE__ */ new Map();
    _injectionGrammars = /* @__PURE__ */ new Map();
    _theme;
    dispose() {
      for (const grammar of this._grammars.values()) {
        grammar.dispose();
      }
    }
    setTheme(theme) {
      this._theme = theme;
    }
    getColorMap() {
      return this._theme.getColorMap();
    }
    /**
     * Add `grammar` to registry and return a list of referenced scope names
     */
    addGrammar(grammar, injectionScopeNames) {
      this._rawGrammars.set(grammar.scopeName, grammar);
      if (injectionScopeNames) {
        this._injectionGrammars.set(grammar.scopeName, injectionScopeNames);
      }
    }
    /**
     * Lookup a raw grammar.
     */
    lookup(scopeName) {
      return this._rawGrammars.get(scopeName);
    }
    /**
     * Returns the injections for the given grammar
     */
    injections(targetScope) {
      return this._injectionGrammars.get(targetScope);
    }
    /**
     * Get the default theme settings
     */
    getDefaults() {
      return this._theme.getDefaults();
    }
    /**
     * Match a scope in the theme.
     */
    themeMatch(scopePath) {
      return this._theme.match(scopePath);
    }
    /**
     * Lookup a grammar.
     */
    grammarForScopeName(scopeName, initialLanguage, embeddedLanguages, tokenTypes, balancedBracketSelectors) {
      if (!this._grammars.has(scopeName)) {
        let rawGrammar = this._rawGrammars.get(scopeName);
        if (!rawGrammar) {
          return null;
        }
        this._grammars.set(scopeName, createGrammar(
          scopeName,
          rawGrammar,
          initialLanguage,
          embeddedLanguages,
          tokenTypes,
          balancedBracketSelectors,
          this,
          this._onigLib
        ));
      }
      return this._grammars.get(scopeName);
    }
  };
  var Registry = class {
    _options;
    _syncRegistry;
    _ensureGrammarCache;
    constructor(options) {
      this._options = options;
      this._syncRegistry = new SyncRegistry(
        Theme.createFromRawTheme(options.theme, options.colorMap),
        options.onigLib
      );
      this._ensureGrammarCache = /* @__PURE__ */ new Map();
    }
    dispose() {
      this._syncRegistry.dispose();
    }
    /**
     * Change the theme. Once called, no previous `ruleStack` should be used anymore.
     */
    setTheme(theme, colorMap) {
      this._syncRegistry.setTheme(Theme.createFromRawTheme(theme, colorMap));
    }
    /**
     * Returns a lookup array for color ids.
     */
    getColorMap() {
      return this._syncRegistry.getColorMap();
    }
    /**
     * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
     * Please do not use language id 0.
     */
    loadGrammarWithEmbeddedLanguages(initialScopeName, initialLanguage, embeddedLanguages) {
      return this.loadGrammarWithConfiguration(initialScopeName, initialLanguage, { embeddedLanguages });
    }
    /**
     * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
     * Please do not use language id 0.
     */
    loadGrammarWithConfiguration(initialScopeName, initialLanguage, configuration) {
      return this._loadGrammar(
        initialScopeName,
        initialLanguage,
        configuration.embeddedLanguages,
        configuration.tokenTypes,
        new BalancedBracketSelectors(
          configuration.balancedBracketSelectors || [],
          configuration.unbalancedBracketSelectors || []
        )
      );
    }
    /**
     * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
     */
    loadGrammar(initialScopeName) {
      return this._loadGrammar(initialScopeName, 0, null, null, null);
    }
    _loadGrammar(initialScopeName, initialLanguage, embeddedLanguages, tokenTypes, balancedBracketSelectors) {
      const dependencyProcessor = new ScopeDependencyProcessor(this._syncRegistry, initialScopeName);
      while (dependencyProcessor.Q.length > 0) {
        dependencyProcessor.Q.map((request) => this._loadSingleGrammar(request.scopeName));
        dependencyProcessor.processQueue();
      }
      return this._grammarForScopeName(
        initialScopeName,
        initialLanguage,
        embeddedLanguages,
        tokenTypes,
        balancedBracketSelectors
      );
    }
    _loadSingleGrammar(scopeName) {
      if (!this._ensureGrammarCache.has(scopeName)) {
        this._doLoadSingleGrammar(scopeName);
        this._ensureGrammarCache.set(scopeName, true);
      }
    }
    _doLoadSingleGrammar(scopeName) {
      const grammar = this._options.loadGrammar(scopeName);
      if (grammar) {
        const injections = typeof this._options.getInjections === "function" ? this._options.getInjections(scopeName) : void 0;
        this._syncRegistry.addGrammar(grammar, injections);
      }
    }
    /**
     * Adds a rawGrammar.
     */
    addGrammar(rawGrammar, injections = [], initialLanguage = 0, embeddedLanguages = null) {
      this._syncRegistry.addGrammar(rawGrammar, injections);
      return this._grammarForScopeName(rawGrammar.scopeName, initialLanguage, embeddedLanguages);
    }
    /**
     * Get the grammar for `scopeName`. The grammar must first be created via `loadGrammar` or `addGrammar`.
     */
    _grammarForScopeName(scopeName, initialLanguage = 0, embeddedLanguages = null, tokenTypes = null, balancedBracketSelectors = null) {
      return this._syncRegistry.grammarForScopeName(
        scopeName,
        initialLanguage,
        embeddedLanguages,
        tokenTypes,
        balancedBracketSelectors
      );
    }
  };
  var INITIAL = StateStackImpl.NULL;

  // node_modules/@shikijs/primitive/dist/index.mjs
  function resolveColorReplacements(theme, options) {
    const replacements = typeof theme === "string" ? {} : { ...theme.colorReplacements };
    const themeName = typeof theme === "string" ? theme : theme.name;
    for (const [key2, value] of Object.entries(options?.colorReplacements || {})) if (typeof value === "string") replacements[key2] = value;
    else if (key2 === themeName) Object.assign(replacements, value);
    return replacements;
  }
  function applyColorReplacements(color, replacements) {
    if (!color) return color;
    return replacements?.[color?.toLowerCase()] || color;
  }
  function toArray(x4) {
    return Array.isArray(x4) ? x4 : [x4];
  }
  async function normalizeGetter(p2) {
    return Promise.resolve(typeof p2 === "function" ? p2() : p2).then((r4) => r4.default || r4);
  }
  function isPlainLang(lang) {
    return !lang || [
      "plaintext",
      "txt",
      "text",
      "plain"
    ].includes(lang);
  }
  function isSpecialLang(lang) {
    return lang === "ansi" || isPlainLang(lang);
  }
  function isNoneTheme(theme) {
    return theme === "none";
  }
  function isSpecialTheme(theme) {
    return isNoneTheme(theme);
  }
  var RE_NEWLINE = /(\r?\n)/g;
  function splitLines(code, preserveEnding = false) {
    if (code.length === 0) return [["", 0]];
    const parts = code.split(RE_NEWLINE);
    let index = 0;
    const lines = [];
    for (let i2 = 0; i2 < parts.length; i2 += 2) {
      const line = preserveEnding ? parts[i2] + (parts[i2 + 1] || "") : parts[i2];
      lines.push([line, index]);
      index += parts[i2].length;
      index += parts[i2 + 1]?.length || 0;
    }
    return lines;
  }
  var VSCODE_FALLBACK_EDITOR_FG = {
    light: "#333333",
    dark: "#bbbbbb"
  };
  var VSCODE_FALLBACK_EDITOR_BG = {
    light: "#fffffe",
    dark: "#1e1e1e"
  };
  var RESOLVED_KEY = "__shiki_resolved";
  function normalizeTheme(rawTheme) {
    if (rawTheme?.[RESOLVED_KEY]) return rawTheme;
    const theme = { ...rawTheme };
    if (theme.tokenColors && !theme.settings) {
      theme.settings = theme.tokenColors;
      delete theme.tokenColors;
    }
    theme.type ||= "dark";
    theme.colorReplacements = { ...theme.colorReplacements };
    theme.settings ||= [];
    let { bg, fg } = theme;
    if (!bg || !fg) {
      const globalSetting = theme.settings ? theme.settings.find((s2) => !s2.name && !s2.scope) : void 0;
      if (globalSetting?.settings?.foreground) fg = globalSetting.settings.foreground;
      if (globalSetting?.settings?.background) bg = globalSetting.settings.background;
      if (!fg && theme?.colors?.["editor.foreground"]) fg = theme.colors["editor.foreground"];
      if (!bg && theme?.colors?.["editor.background"]) bg = theme.colors["editor.background"];
      if (!fg) fg = theme.type === "light" ? VSCODE_FALLBACK_EDITOR_FG.light : VSCODE_FALLBACK_EDITOR_FG.dark;
      if (!bg) bg = theme.type === "light" ? VSCODE_FALLBACK_EDITOR_BG.light : VSCODE_FALLBACK_EDITOR_BG.dark;
      theme.fg = fg;
      theme.bg = bg;
    }
    if (!(theme.settings[0] && theme.settings[0].settings && !theme.settings[0].scope)) theme.settings.unshift({ settings: {
      foreground: theme.fg,
      background: theme.bg
    } });
    let replacementCount = 0;
    const replacementMap = /* @__PURE__ */ new Map();
    function getReplacementColor(value) {
      if (replacementMap.has(value)) return replacementMap.get(value);
      replacementCount += 1;
      const hex = `#${replacementCount.toString(16).padStart(8, "0").toLowerCase()}`;
      if (theme.colorReplacements?.[`#${hex}`]) return getReplacementColor(value);
      replacementMap.set(value, hex);
      return hex;
    }
    theme.settings = theme.settings.map((setting) => {
      const replaceFg = setting.settings?.foreground && !setting.settings.foreground.startsWith("#");
      const replaceBg = setting.settings?.background && !setting.settings.background.startsWith("#");
      if (!replaceFg && !replaceBg) return setting;
      const clone2 = {
        ...setting,
        settings: { ...setting.settings }
      };
      if (replaceFg) {
        const replacement = getReplacementColor(setting.settings.foreground);
        theme.colorReplacements[replacement] = setting.settings.foreground;
        clone2.settings.foreground = replacement;
      }
      if (replaceBg) {
        const replacement = getReplacementColor(setting.settings.background);
        theme.colorReplacements[replacement] = setting.settings.background;
        clone2.settings.background = replacement;
      }
      return clone2;
    });
    for (const key2 of Object.keys(theme.colors || {})) if (key2 === "editor.foreground" || key2 === "editor.background" || key2.startsWith("terminal.ansi")) {
      if (!theme.colors[key2]?.startsWith("#")) {
        const replacement = getReplacementColor(theme.colors[key2]);
        theme.colorReplacements[replacement] = theme.colors[key2];
        theme.colors[key2] = replacement;
      }
    }
    Object.defineProperty(theme, RESOLVED_KEY, {
      enumerable: false,
      writable: false,
      value: true
    });
    return theme;
  }
  async function resolveLangs(langs) {
    return [...new Set((await Promise.all(langs.filter((l3) => !isSpecialLang(l3)).map(async (lang) => await normalizeGetter(lang).then((r4) => Array.isArray(r4) ? r4 : [r4])))).flat())];
  }
  async function resolveThemes(themes) {
    return (await Promise.all(themes.map(async (theme) => isSpecialTheme(theme) ? null : normalizeTheme(await normalizeGetter(theme))))).filter((i2) => !!i2);
  }
  function resolveLangAlias(name, alias) {
    if (!alias) return name;
    if (alias[name]) {
      const resolved = /* @__PURE__ */ new Set([name]);
      while (alias[name]) {
        name = alias[name];
        if (resolved.has(name)) throw new ShikiError(`Circular alias \`${[...resolved].join(" -> ")} -> ${name}\``);
        resolved.add(name);
      }
    }
    return name;
  }
  var Registry2 = class extends Registry {
    _resolver;
    _themes;
    _langs;
    _alias;
    _resolvedThemes = /* @__PURE__ */ new Map();
    _resolvedGrammars = /* @__PURE__ */ new Map();
    _langMap = /* @__PURE__ */ new Map();
    _langGraph = /* @__PURE__ */ new Map();
    _textmateThemeCache = /* @__PURE__ */ new WeakMap();
    _loadedThemesCache = null;
    _loadedLanguagesCache = null;
    constructor(_resolver, _themes, _langs, _alias = {}) {
      super(_resolver);
      this._resolver = _resolver;
      this._themes = _themes;
      this._langs = _langs;
      this._alias = _alias;
      this._themes.map((t) => this.loadTheme(t));
      this.loadLanguages(this._langs);
    }
    getTheme(theme) {
      if (typeof theme === "string") return this._resolvedThemes.get(theme);
      else return this.loadTheme(theme);
    }
    loadTheme(theme) {
      const _theme = normalizeTheme(theme);
      if (_theme.name) {
        this._resolvedThemes.set(_theme.name, _theme);
        this._loadedThemesCache = null;
      }
      return _theme;
    }
    getLoadedThemes() {
      if (!this._loadedThemesCache) this._loadedThemesCache = [...this._resolvedThemes.keys()];
      return this._loadedThemesCache;
    }
    setTheme(theme) {
      let textmateTheme = this._textmateThemeCache.get(theme);
      if (!textmateTheme) {
        textmateTheme = Theme.createFromRawTheme(theme);
        this._textmateThemeCache.set(theme, textmateTheme);
      }
      this._syncRegistry.setTheme(textmateTheme);
    }
    getGrammar(name) {
      name = resolveLangAlias(name, this._alias);
      return this._resolvedGrammars.get(name);
    }
    loadLanguage(lang) {
      if (this.getGrammar(lang.name)) return;
      const embeddedLazilyBy = new Set([...this._langMap.values()].filter((i2) => i2.embeddedLangsLazy?.includes(lang.name)));
      this._resolver.addLanguage(lang);
      const grammarConfig = {
        balancedBracketSelectors: lang.balancedBracketSelectors || ["*"],
        unbalancedBracketSelectors: lang.unbalancedBracketSelectors || []
      };
      this._syncRegistry._rawGrammars.set(lang.scopeName, lang);
      const g = this.loadGrammarWithConfiguration(lang.scopeName, 1, grammarConfig);
      g.name = lang.name;
      this._resolvedGrammars.set(lang.name, g);
      if (lang.aliases) lang.aliases.forEach((alias) => {
        this._alias[alias] = lang.name;
      });
      this._loadedLanguagesCache = null;
      if (embeddedLazilyBy.size) for (const e of embeddedLazilyBy) {
        this._syncRegistry?._grammars?.get(e.scopeName)?.dispose();
        this._resolvedGrammars.delete(e.name);
        this._loadedLanguagesCache = null;
        this._syncRegistry?._injectionGrammars?.delete(e.scopeName);
        this._syncRegistry?._grammars?.delete(e.scopeName);
        this.loadLanguage(this._langMap.get(e.name));
      }
    }
    dispose() {
      super.dispose();
      this._resolvedThemes.clear();
      this._resolvedGrammars.clear();
      this._langMap.clear();
      this._langGraph.clear();
      this._loadedThemesCache = null;
    }
    loadLanguages(langs) {
      for (const lang of langs) this.resolveEmbeddedLanguages(lang);
      const langsGraphArray = [...this._langGraph.entries()];
      const missingLangs = langsGraphArray.filter(([_4, lang]) => !lang);
      if (missingLangs.length) {
        const dependents = langsGraphArray.filter(([_4, lang]) => {
          if (!lang) return false;
          return (lang.embeddedLanguages || lang.embeddedLangs)?.some((l3) => missingLangs.map(([name]) => name).includes(l3));
        }).filter((lang) => !missingLangs.includes(lang));
        throw new ShikiError(`Missing languages ${missingLangs.map(([name]) => `\`${name}\``).join(", ")}, required by ${dependents.map(([name]) => `\`${name}\``).join(", ")}`);
      }
      for (const [_4, lang] of langsGraphArray) this._resolver.addLanguage(lang);
      for (const [_4, lang] of langsGraphArray) this.loadLanguage(lang);
    }
    getLoadedLanguages() {
      if (!this._loadedLanguagesCache) this._loadedLanguagesCache = [.../* @__PURE__ */ new Set([...this._resolvedGrammars.keys(), ...Object.keys(this._alias)])];
      return this._loadedLanguagesCache;
    }
    resolveEmbeddedLanguages(lang) {
      this._langMap.set(lang.name, lang);
      this._langGraph.set(lang.name, lang);
      const embedded = lang.embeddedLanguages ?? lang.embeddedLangs;
      if (embedded) for (const embeddedLang of embedded) this._langGraph.set(embeddedLang, this._langMap.get(embeddedLang));
    }
  };
  var Resolver = class {
    _langs = /* @__PURE__ */ new Map();
    _scopeToLang = /* @__PURE__ */ new Map();
    _injections = /* @__PURE__ */ new Map();
    _onigLib;
    constructor(engine, langs) {
      this._onigLib = {
        createOnigScanner: (patterns) => engine.createScanner(patterns),
        createOnigString: (s2) => engine.createString(s2)
      };
      langs.forEach((i2) => this.addLanguage(i2));
    }
    get onigLib() {
      return this._onigLib;
    }
    getLangRegistration(langIdOrAlias) {
      return this._langs.get(langIdOrAlias);
    }
    loadGrammar(scopeName) {
      return this._scopeToLang.get(scopeName);
    }
    addLanguage(l3) {
      this._langs.set(l3.name, l3);
      if (l3.aliases) l3.aliases.forEach((a2) => {
        this._langs.set(a2, l3);
      });
      this._scopeToLang.set(l3.scopeName, l3);
      if (l3.injectTo) l3.injectTo.forEach((i2) => {
        if (!this._injections.get(i2)) this._injections.set(i2, []);
        if (!this._injections.get(i2).includes(l3.scopeName)) this._injections.get(i2).push(l3.scopeName);
      });
    }
    getInjections(scopeName) {
      const scopeParts = scopeName.split(".");
      let injections = [];
      for (let i2 = 1; i2 <= scopeParts.length; i2++) {
        const subScopeName = scopeParts.slice(0, i2).join(".");
        injections = [...injections, ...this._injections.get(subScopeName) || []];
      }
      return injections;
    }
  };
  var instancesCount = 0;
  function createShikiPrimitive(options) {
    instancesCount += 1;
    if (options.warnings !== false && instancesCount >= 10 && instancesCount % 10 === 0) console.warn(`[Shiki] ${instancesCount} instances have been created. Shiki is supposed to be used as a singleton, consider refactoring your code to cache your highlighter instance; Or call \`highlighter.dispose()\` to release unused instances.`);
    let isDisposed = false;
    if (!options.engine) throw new ShikiError("`engine` option is required for synchronous mode");
    const langs = (options.langs || []).flat(1);
    const themes = (options.themes || []).flat(1).map(normalizeTheme);
    const _registry = new Registry2(new Resolver(options.engine, langs), themes, langs, options.langAlias);
    let _lastTheme;
    function resolveLangAlias$1(name) {
      return resolveLangAlias(name, options.langAlias);
    }
    function getLanguage(name) {
      ensureNotDisposed();
      const _lang = _registry.getGrammar(typeof name === "string" ? name : name.name);
      if (!_lang) throw new ShikiError(`Language \`${name}\` not found, you may need to load it first`);
      return _lang;
    }
    function getTheme(name) {
      if (name === "none") return {
        bg: "",
        fg: "",
        name: "none",
        settings: [],
        type: "dark"
      };
      ensureNotDisposed();
      const _theme = _registry.getTheme(name);
      if (!_theme) throw new ShikiError(`Theme \`${name}\` not found, you may need to load it first`);
      return _theme;
    }
    function setTheme(name) {
      ensureNotDisposed();
      const theme = getTheme(name);
      if (_lastTheme !== name) {
        _registry.setTheme(theme);
        _lastTheme = name;
      }
      return {
        theme,
        colorMap: _registry.getColorMap()
      };
    }
    function getLoadedThemes() {
      ensureNotDisposed();
      return _registry.getLoadedThemes();
    }
    function getLoadedLanguages() {
      ensureNotDisposed();
      return _registry.getLoadedLanguages();
    }
    function loadLanguageSync(...langs2) {
      ensureNotDisposed();
      _registry.loadLanguages(langs2.flat(1));
    }
    async function loadLanguage(...langs2) {
      return loadLanguageSync(await resolveLangs(langs2));
    }
    function loadThemeSync(...themes2) {
      ensureNotDisposed();
      for (const theme of themes2.flat(1)) _registry.loadTheme(theme);
    }
    async function loadTheme(...themes2) {
      ensureNotDisposed();
      return loadThemeSync(await resolveThemes(themes2));
    }
    function ensureNotDisposed() {
      if (isDisposed) throw new ShikiError("Shiki instance has been disposed");
    }
    function dispose() {
      if (isDisposed) return;
      isDisposed = true;
      _registry.dispose();
      instancesCount -= 1;
    }
    return {
      setTheme,
      getTheme,
      getLanguage,
      getLoadedThemes,
      getLoadedLanguages,
      resolveLangAlias: resolveLangAlias$1,
      loadLanguage,
      loadLanguageSync,
      loadTheme,
      loadThemeSync,
      dispose,
      [Symbol.dispose]: dispose
    };
  }
  async function createShikiPrimitiveAsync(options) {
    if (!options.engine) console.warn("`engine` option is required. Use `createOnigurumaEngine` or `createJavaScriptRegexEngine` to create an engine.");
    const [themes, langs, engine] = await Promise.all([
      resolveThemes(options.themes || []),
      resolveLangs(options.langs || []),
      options.engine
    ]);
    return createShikiPrimitive({
      ...options,
      themes,
      langs,
      engine
    });
  }
  var _grammarStateMap = /* @__PURE__ */ new WeakMap();
  function setLastGrammarStateToMap(keys, state) {
    _grammarStateMap.set(keys, state);
  }
  function getLastGrammarStateFromMap(keys) {
    return _grammarStateMap.get(keys);
  }
  var GrammarState = class GrammarState2 {
    /**
    * Theme to Stack mapping
    */
    _stacks = {};
    lang;
    get themes() {
      return Object.keys(this._stacks);
    }
    get theme() {
      return this.themes[0];
    }
    get _stack() {
      return this._stacks[this.theme];
    }
    /**
    * Static method to create a initial grammar state.
    */
    static initial(lang, themes) {
      return new GrammarState2(Object.fromEntries(toArray(themes).map((theme) => [theme, INITIAL])), lang);
    }
    constructor(...args) {
      if (args.length === 2) {
        const [stacksMap, lang] = args;
        this.lang = lang;
        this._stacks = stacksMap;
      } else {
        const [stack, lang, theme] = args;
        this.lang = lang;
        this._stacks = { [theme]: stack };
      }
    }
    /**
    * Get the internal stack object.
    * @internal
    */
    getInternalStack(theme = this.theme) {
      return this._stacks[theme];
    }
    getScopes(theme = this.theme) {
      return getScopes(this._stacks[theme]);
    }
    toJSON() {
      return {
        lang: this.lang,
        theme: this.theme,
        themes: this.themes,
        scopes: this.getScopes()
      };
    }
  };
  function getScopes(stack) {
    const scopes = [];
    const visited = /* @__PURE__ */ new Set();
    function pushScope(stack2) {
      if (visited.has(stack2)) return;
      visited.add(stack2);
      const name = stack2?.nameScopesList?.scopeName;
      if (name) scopes.push(name);
      if (stack2.parent) pushScope(stack2.parent);
    }
    pushScope(stack);
    return scopes;
  }
  function getGrammarStack(state, theme) {
    if (!(state instanceof GrammarState)) throw new ShikiError("Invalid grammar state");
    return state.getInternalStack(theme);
  }
  var RE_COMMA = /,/;
  var RE_SPACE = / /;
  function codeToTokensBase(primitive, code, options = {}) {
    const { theme: themeName = primitive.getLoadedThemes()[0] } = options;
    if (isPlainLang(primitive.resolveLangAlias(options.lang || "text")) || isNoneTheme(themeName)) return splitLines(code).map((line) => [{
      content: line[0],
      offset: line[1]
    }]);
    const { theme, colorMap } = primitive.setTheme(themeName);
    const _grammar = primitive.getLanguage(options.lang || "text");
    if (options.grammarState) {
      if (options.grammarState.lang !== _grammar.name) throw new ShikiError(`Grammar state language "${options.grammarState.lang}" does not match highlight language "${_grammar.name}"`);
      if (!options.grammarState.themes.includes(theme.name)) throw new ShikiError(`Grammar state themes "${options.grammarState.themes}" do not contain highlight theme "${theme.name}"`);
    }
    return tokenizeWithTheme(code, _grammar, theme, colorMap, options);
  }
  function getLastGrammarState(...args) {
    if (args.length === 2) return getLastGrammarStateFromMap(args[1]);
    const [primitive, code, options = {}] = args;
    const { lang = "text", theme: themeName = primitive.getLoadedThemes()[0] } = options;
    if (isPlainLang(lang) || isNoneTheme(themeName)) throw new ShikiError("Plain language does not have grammar state");
    if (lang === "ansi") throw new ShikiError("ANSI language does not have grammar state");
    const { theme, colorMap } = primitive.setTheme(themeName);
    const _grammar = primitive.getLanguage(lang);
    return new GrammarState(_tokenizeWithTheme(code, _grammar, theme, colorMap, options).stateStack, _grammar.name, theme.name);
  }
  function tokenizeWithTheme(code, grammar, theme, colorMap, options) {
    const result = _tokenizeWithTheme(code, grammar, theme, colorMap, options);
    const grammarState = new GrammarState(result.stateStack, grammar.name, theme.name);
    setLastGrammarStateToMap(result.tokens, grammarState);
    return result.tokens;
  }
  function _tokenizeWithTheme(code, grammar, theme, colorMap, options) {
    const colorReplacements = resolveColorReplacements(theme, options);
    const { tokenizeMaxLineLength = 0, tokenizeTimeLimit = 500, includeExplanation = false } = options;
    const lines = splitLines(code);
    let stateStack = options.grammarState ? getGrammarStack(options.grammarState, theme.name) ?? INITIAL : options.grammarContextCode != null ? _tokenizeWithTheme(options.grammarContextCode, grammar, theme, colorMap, {
      ...options,
      grammarState: void 0,
      grammarContextCode: void 0
    }).stateStack : INITIAL;
    let actual = [];
    const final = [];
    for (let i2 = 0, len = lines.length; i2 < len; i2++) {
      const [line, lineOffset] = lines[i2];
      if (line === "") {
        actual = [];
        final.push([]);
        continue;
      }
      if (tokenizeMaxLineLength > 0 && line.length >= tokenizeMaxLineLength) {
        actual = [];
        final.push([{
          content: line,
          offset: lineOffset,
          color: "",
          fontStyle: 0
        }]);
        continue;
      }
      let resultWithScopes;
      let tokensWithScopes;
      let tokensWithScopesIndex;
      if (includeExplanation && includeExplanation !== "tokenType") {
        resultWithScopes = grammar.tokenizeLine(line, stateStack, tokenizeTimeLimit);
        tokensWithScopes = resultWithScopes.tokens;
        tokensWithScopesIndex = 0;
      }
      const result = grammar.tokenizeLine2(line, stateStack, tokenizeTimeLimit);
      const tokensLength = result.tokens.length / 2;
      for (let j3 = 0; j3 < tokensLength; j3++) {
        const startIndex = result.tokens[2 * j3];
        const nextStartIndex = j3 + 1 < tokensLength ? result.tokens[2 * j3 + 2] : line.length;
        if (startIndex === nextStartIndex) continue;
        const metadata = result.tokens[2 * j3 + 1];
        const color = applyColorReplacements(colorMap[EncodedTokenMetadata.getForeground(metadata)], colorReplacements);
        const fontStyle = EncodedTokenMetadata.getFontStyle(metadata);
        const token2 = {
          content: line.substring(startIndex, nextStartIndex),
          offset: lineOffset + startIndex,
          color,
          fontStyle
        };
        if (includeExplanation === "tokenType") token2.type = EncodedTokenMetadata.getTokenType(metadata);
        else if (includeExplanation) {
          const themeSettingsSelectors = [];
          if (includeExplanation !== "scopeName") for (const setting of theme.settings) {
            let selectors;
            switch (typeof setting.scope) {
              case "string":
                selectors = setting.scope.split(RE_COMMA).map((scope) => scope.trim());
                break;
              case "object":
                selectors = setting.scope;
                break;
              default:
                continue;
            }
            themeSettingsSelectors.push({
              settings: setting,
              selectors: selectors.map((selector) => selector.split(RE_SPACE))
            });
          }
          token2.explanation = [];
          let offset = 0;
          while (startIndex + offset < nextStartIndex) {
            const tokenWithScopes = tokensWithScopes[tokensWithScopesIndex];
            const tokenWithScopesText = line.substring(tokenWithScopes.startIndex, tokenWithScopes.endIndex);
            offset += tokenWithScopesText.length;
            token2.explanation.push({
              content: tokenWithScopesText,
              scopes: includeExplanation === "scopeName" ? explainThemeScopesNameOnly(tokenWithScopes.scopes) : explainThemeScopesFull(themeSettingsSelectors, tokenWithScopes.scopes)
            });
            tokensWithScopesIndex += 1;
          }
        }
        actual.push(token2);
      }
      final.push(actual);
      actual = [];
      stateStack = result.ruleStack;
    }
    return {
      tokens: final,
      stateStack
    };
  }
  function explainThemeScopesNameOnly(scopes) {
    return scopes.map((scope) => ({ scopeName: scope }));
  }
  function explainThemeScopesFull(themeSelectors, scopes) {
    const result = [];
    for (let i2 = 0, len = scopes.length; i2 < len; i2++) {
      const scope = scopes[i2];
      result[i2] = {
        scopeName: scope,
        themeMatches: explainThemeScope(themeSelectors, scope, scopes.slice(0, i2))
      };
    }
    return result;
  }
  function matchesOne(selector, scope) {
    return selector === scope || scope.substring(0, selector.length) === selector && scope[selector.length] === ".";
  }
  function matches(selectors, scope, parentScopes) {
    if (!matchesOne(selectors.at(-1), scope)) return false;
    let selectorParentIndex = selectors.length - 2;
    let parentIndex = parentScopes.length - 1;
    while (selectorParentIndex >= 0 && parentIndex >= 0) {
      if (matchesOne(selectors[selectorParentIndex], parentScopes[parentIndex])) selectorParentIndex -= 1;
      parentIndex -= 1;
    }
    if (selectorParentIndex === -1) return true;
    return false;
  }
  function explainThemeScope(themeSettingsSelectors, scope, parentScopes) {
    const result = [];
    for (const { selectors, settings } of themeSettingsSelectors) for (const selectorPieces of selectors) if (matches(selectorPieces, scope, parentScopes)) {
      result.push(settings);
      break;
    }
    return result;
  }
  function codeToTokensWithThemes(primitive, code, options, codeToTokensBaseFn = codeToTokensBase) {
    const themes = Object.entries(options.themes).filter((i2) => i2[1]).map((i2) => ({
      color: i2[0],
      theme: i2[1]
    }));
    const themedTokens = themes.map((t) => {
      const tokens2 = codeToTokensBaseFn(primitive, code, {
        ...options,
        theme: t.theme
      });
      return {
        tokens: tokens2,
        state: getLastGrammarStateFromMap(tokens2),
        theme: typeof t.theme === "string" ? t.theme : t.theme.name
      };
    });
    const tokens = alignThemesTokenization(...themedTokens.map((i2) => i2.tokens));
    const mergedTokens = tokens[0].map((line, lineIdx) => line.map((_token, tokenIdx) => {
      const mergedToken = {
        content: _token.content,
        variants: {},
        offset: _token.offset
      };
      if ("includeExplanation" in options && options.includeExplanation) mergedToken.explanation = _token.explanation;
      tokens.forEach((t, themeIdx) => {
        const { content: _4, explanation: __, offset: ___, ...styles2 } = t[lineIdx][tokenIdx];
        mergedToken.variants[themes[themeIdx].color] = styles2;
      });
      return mergedToken;
    }));
    const mergedGrammarState = themedTokens[0].state ? new GrammarState(Object.fromEntries(themedTokens.map((s2) => [s2.theme, s2.state?.getInternalStack(s2.theme)])), themedTokens[0].state.lang) : void 0;
    if (mergedGrammarState) setLastGrammarStateToMap(mergedTokens, mergedGrammarState);
    return mergedTokens;
  }
  function alignThemesTokenization(...themes) {
    const outThemes = themes.map(() => []);
    const count = themes.length;
    for (let i2 = 0; i2 < themes[0].length; i2++) {
      const lines = themes.map((t) => t[i2]);
      const outLines = outThemes.map(() => []);
      outThemes.forEach((t, i3) => t.push(outLines[i3]));
      const indexes = lines.map(() => 0);
      const current = lines.map((l3) => l3[0]);
      while (current.every((t) => t)) {
        const minLength = Math.min(...current.map((t) => t.content.length));
        for (let n = 0; n < count; n++) {
          const token2 = current[n];
          if (token2.content.length === minLength) {
            outLines[n].push(token2);
            indexes[n] += 1;
            current[n] = lines[n][indexes[n]];
          } else {
            outLines[n].push({
              ...token2,
              content: token2.content.slice(0, minLength)
            });
            current[n] = {
              ...token2,
              content: token2.content.slice(minLength),
              offset: token2.offset + minLength
            };
          }
        }
      }
    }
    return outThemes;
  }

  // node_modules/html-void-elements/index.js
  var htmlVoidElements = [
    "area",
    "base",
    "basefont",
    "bgsound",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "image",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ];

  // node_modules/property-information/lib/util/schema.js
  var Schema = class {
    /**
     * @param {SchemaType['property']} property
     *   Property.
     * @param {SchemaType['normal']} normal
     *   Normal.
     * @param {Space | undefined} [space]
     *   Space.
     * @returns
     *   Schema.
     */
    constructor(property, normal, space) {
      this.normal = normal;
      this.property = property;
      if (space) {
        this.space = space;
      }
    }
  };
  Schema.prototype.normal = {};
  Schema.prototype.property = {};
  Schema.prototype.space = void 0;

  // node_modules/property-information/lib/util/merge.js
  function merge(definitions, space) {
    const property = {};
    const normal = {};
    for (const definition of definitions) {
      Object.assign(property, definition.property);
      Object.assign(normal, definition.normal);
    }
    return new Schema(property, normal, space);
  }

  // node_modules/property-information/lib/normalize.js
  function normalize(value) {
    return value.toLowerCase();
  }

  // node_modules/property-information/lib/util/info.js
  var Info = class {
    /**
     * @param {string} property
     *   Property.
     * @param {string} attribute
     *   Attribute.
     * @returns
     *   Info.
     */
    constructor(property, attribute) {
      this.attribute = attribute;
      this.property = property;
    }
  };
  Info.prototype.attribute = "";
  Info.prototype.booleanish = false;
  Info.prototype.boolean = false;
  Info.prototype.commaOrSpaceSeparated = false;
  Info.prototype.commaSeparated = false;
  Info.prototype.defined = false;
  Info.prototype.mustUseProperty = false;
  Info.prototype.number = false;
  Info.prototype.overloadedBoolean = false;
  Info.prototype.property = "";
  Info.prototype.spaceSeparated = false;
  Info.prototype.space = void 0;

  // node_modules/property-information/lib/util/types.js
  var types_exports = {};
  __export(types_exports, {
    boolean: () => boolean,
    booleanish: () => booleanish,
    commaOrSpaceSeparated: () => commaOrSpaceSeparated,
    commaSeparated: () => commaSeparated,
    number: () => number,
    overloadedBoolean: () => overloadedBoolean,
    spaceSeparated: () => spaceSeparated
  });
  var powers = 0;
  var boolean = increment();
  var booleanish = increment();
  var overloadedBoolean = increment();
  var number = increment();
  var spaceSeparated = increment();
  var commaSeparated = increment();
  var commaOrSpaceSeparated = increment();
  function increment() {
    return 2 ** ++powers;
  }

  // node_modules/property-information/lib/util/defined-info.js
  var checks = (
    /** @type {ReadonlyArray<keyof typeof types>} */
    Object.keys(types_exports)
  );
  var DefinedInfo = class extends Info {
    /**
     * @constructor
     * @param {string} property
     *   Property.
     * @param {string} attribute
     *   Attribute.
     * @param {number | null | undefined} [mask]
     *   Mask.
     * @param {Space | undefined} [space]
     *   Space.
     * @returns
     *   Info.
     */
    constructor(property, attribute, mask, space) {
      let index = -1;
      super(property, attribute);
      mark(this, "space", space);
      if (typeof mask === "number") {
        while (++index < checks.length) {
          const check = checks[index];
          mark(this, checks[index], (mask & types_exports[check]) === types_exports[check]);
        }
      }
    }
  };
  DefinedInfo.prototype.defined = true;
  function mark(values, key2, value) {
    if (value) {
      values[key2] = value;
    }
  }

  // node_modules/property-information/lib/util/create.js
  function create(definition) {
    const properties = {};
    const normals = {};
    for (const [property, value] of Object.entries(definition.properties)) {
      const info = new DefinedInfo(
        property,
        definition.transform(definition.attributes || {}, property),
        value,
        definition.space
      );
      if (definition.mustUseProperty && definition.mustUseProperty.includes(property)) {
        info.mustUseProperty = true;
      }
      properties[property] = info;
      normals[normalize(property)] = property;
      normals[normalize(info.attribute)] = property;
    }
    return new Schema(properties, normals, definition.space);
  }

  // node_modules/property-information/lib/aria.js
  var aria = create({
    properties: {
      ariaActiveDescendant: null,
      ariaAtomic: booleanish,
      ariaAutoComplete: null,
      ariaBusy: booleanish,
      ariaChecked: booleanish,
      ariaColCount: number,
      ariaColIndex: number,
      ariaColSpan: number,
      ariaControls: spaceSeparated,
      ariaCurrent: null,
      ariaDescribedBy: spaceSeparated,
      ariaDetails: null,
      ariaDisabled: booleanish,
      ariaDropEffect: spaceSeparated,
      ariaErrorMessage: null,
      ariaExpanded: booleanish,
      ariaFlowTo: spaceSeparated,
      ariaGrabbed: booleanish,
      ariaHasPopup: null,
      ariaHidden: booleanish,
      ariaInvalid: null,
      ariaKeyShortcuts: null,
      ariaLabel: null,
      ariaLabelledBy: spaceSeparated,
      ariaLevel: number,
      ariaLive: null,
      ariaModal: booleanish,
      ariaMultiLine: booleanish,
      ariaMultiSelectable: booleanish,
      ariaOrientation: null,
      ariaOwns: spaceSeparated,
      ariaPlaceholder: null,
      ariaPosInSet: number,
      ariaPressed: booleanish,
      ariaReadOnly: booleanish,
      ariaRelevant: null,
      ariaRequired: booleanish,
      ariaRoleDescription: spaceSeparated,
      ariaRowCount: number,
      ariaRowIndex: number,
      ariaRowSpan: number,
      ariaSelected: booleanish,
      ariaSetSize: number,
      ariaSort: null,
      ariaValueMax: number,
      ariaValueMin: number,
      ariaValueNow: number,
      ariaValueText: null,
      role: null
    },
    transform(_4, property) {
      return property === "role" ? property : "aria-" + property.slice(4).toLowerCase();
    }
  });

  // node_modules/property-information/lib/util/case-sensitive-transform.js
  function caseSensitiveTransform(attributes, attribute) {
    return attribute in attributes ? attributes[attribute] : attribute;
  }

  // node_modules/property-information/lib/util/case-insensitive-transform.js
  function caseInsensitiveTransform(attributes, property) {
    return caseSensitiveTransform(attributes, property.toLowerCase());
  }

  // node_modules/property-information/lib/html.js
  var html = create({
    attributes: {
      acceptcharset: "accept-charset",
      classname: "class",
      htmlfor: "for",
      httpequiv: "http-equiv"
    },
    mustUseProperty: ["checked", "multiple", "muted", "selected"],
    properties: {
      // Standard Properties.
      abbr: null,
      accept: commaSeparated,
      acceptCharset: spaceSeparated,
      accessKey: spaceSeparated,
      action: null,
      allow: null,
      allowFullScreen: boolean,
      allowPaymentRequest: boolean,
      allowUserMedia: boolean,
      alpha: boolean,
      alt: null,
      as: null,
      async: boolean,
      autoCapitalize: null,
      autoComplete: spaceSeparated,
      autoFocus: boolean,
      autoPlay: boolean,
      blocking: spaceSeparated,
      capture: null,
      charSet: null,
      checked: boolean,
      cite: null,
      className: spaceSeparated,
      closedBy: null,
      colorSpace: null,
      cols: number,
      colSpan: number,
      command: null,
      commandFor: null,
      content: null,
      contentEditable: booleanish,
      controls: boolean,
      controlsList: spaceSeparated,
      coords: number | commaSeparated,
      crossOrigin: null,
      data: null,
      dateTime: null,
      decoding: null,
      default: boolean,
      defer: boolean,
      dir: null,
      dirName: null,
      disabled: boolean,
      download: overloadedBoolean,
      draggable: booleanish,
      encType: null,
      enterKeyHint: null,
      fetchPriority: null,
      form: null,
      formAction: null,
      formEncType: null,
      formMethod: null,
      formNoValidate: boolean,
      formTarget: null,
      headers: spaceSeparated,
      height: number,
      hidden: overloadedBoolean,
      high: number,
      href: null,
      hrefLang: null,
      htmlFor: spaceSeparated,
      httpEquiv: spaceSeparated,
      id: null,
      imageSizes: null,
      imageSrcSet: null,
      inert: boolean,
      inputMode: null,
      integrity: null,
      is: null,
      isMap: boolean,
      itemId: null,
      itemProp: spaceSeparated,
      itemRef: spaceSeparated,
      itemScope: boolean,
      itemType: spaceSeparated,
      kind: null,
      label: null,
      lang: null,
      language: null,
      list: null,
      loading: null,
      loop: boolean,
      low: number,
      manifest: null,
      max: null,
      maxLength: number,
      media: null,
      method: null,
      min: null,
      minLength: number,
      multiple: boolean,
      muted: boolean,
      name: null,
      nonce: null,
      noModule: boolean,
      noValidate: boolean,
      onAbort: null,
      onAfterPrint: null,
      onAuxClick: null,
      onBeforeMatch: null,
      onBeforePrint: null,
      onBeforeToggle: null,
      onBeforeUnload: null,
      onBlur: null,
      onCancel: null,
      onCanPlay: null,
      onCanPlayThrough: null,
      onChange: null,
      onClick: null,
      onClose: null,
      onContextLost: null,
      onContextMenu: null,
      onContextRestored: null,
      onCopy: null,
      onCueChange: null,
      onCut: null,
      onDblClick: null,
      onDrag: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragExit: null,
      onDragLeave: null,
      onDragOver: null,
      onDragStart: null,
      onDrop: null,
      onDurationChange: null,
      onEmptied: null,
      onEnded: null,
      onError: null,
      onFocus: null,
      onFormData: null,
      onHashChange: null,
      onInput: null,
      onInvalid: null,
      onKeyDown: null,
      onKeyPress: null,
      onKeyUp: null,
      onLanguageChange: null,
      onLoad: null,
      onLoadedData: null,
      onLoadedMetadata: null,
      onLoadEnd: null,
      onLoadStart: null,
      onMessage: null,
      onMessageError: null,
      onMouseDown: null,
      onMouseEnter: null,
      onMouseLeave: null,
      onMouseMove: null,
      onMouseOut: null,
      onMouseOver: null,
      onMouseUp: null,
      onOffline: null,
      onOnline: null,
      onPageHide: null,
      onPageShow: null,
      onPaste: null,
      onPause: null,
      onPlay: null,
      onPlaying: null,
      onPopState: null,
      onProgress: null,
      onRateChange: null,
      onRejectionHandled: null,
      onReset: null,
      onResize: null,
      onScroll: null,
      onScrollEnd: null,
      onSecurityPolicyViolation: null,
      onSeeked: null,
      onSeeking: null,
      onSelect: null,
      onSlotChange: null,
      onStalled: null,
      onStorage: null,
      onSubmit: null,
      onSuspend: null,
      onTimeUpdate: null,
      onToggle: null,
      onUnhandledRejection: null,
      onUnload: null,
      onVolumeChange: null,
      onWaiting: null,
      onWheel: null,
      open: boolean,
      optimum: number,
      pattern: null,
      ping: spaceSeparated,
      placeholder: null,
      playsInline: boolean,
      popover: null,
      popoverTarget: null,
      popoverTargetAction: null,
      poster: null,
      preload: null,
      readOnly: boolean,
      referrerPolicy: null,
      rel: spaceSeparated,
      required: boolean,
      reversed: boolean,
      rows: number,
      rowSpan: number,
      sandbox: spaceSeparated,
      scope: null,
      scoped: boolean,
      seamless: boolean,
      selected: boolean,
      shadowRootClonable: boolean,
      shadowRootCustomElementRegistry: boolean,
      shadowRootDelegatesFocus: boolean,
      shadowRootMode: null,
      shadowRootSerializable: boolean,
      shape: null,
      size: number,
      sizes: null,
      slot: null,
      span: number,
      spellCheck: booleanish,
      src: null,
      srcDoc: null,
      srcLang: null,
      srcSet: null,
      start: number,
      step: null,
      style: null,
      tabIndex: number,
      target: null,
      title: null,
      translate: null,
      type: null,
      typeMustMatch: boolean,
      useMap: null,
      value: booleanish,
      width: number,
      wrap: null,
      writingSuggestions: null,
      // Legacy.
      // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
      align: null,
      // Several. Use CSS `text-align` instead,
      aLink: null,
      // `<body>`. Use CSS `a:active {color}` instead
      archive: spaceSeparated,
      // `<object>`. List of URIs to archives
      axis: null,
      // `<td>` and `<th>`. Use `scope` on `<th>`
      background: null,
      // `<body>`. Use CSS `background-image` instead
      bgColor: null,
      // `<body>` and table elements. Use CSS `background-color` instead
      border: number,
      // `<table>`. Use CSS `border-width` instead,
      borderColor: null,
      // `<table>`. Use CSS `border-color` instead,
      bottomMargin: number,
      // `<body>`
      cellPadding: null,
      // `<table>`
      cellSpacing: null,
      // `<table>`
      char: null,
      // Several table elements. When `align=char`, sets the character to align on
      charOff: null,
      // Several table elements. When `char`, offsets the alignment
      classId: null,
      // `<object>`
      clear: null,
      // `<br>`. Use CSS `clear` instead
      code: null,
      // `<object>`
      codeBase: null,
      // `<object>`
      codeType: null,
      // `<object>`
      color: null,
      // `<font>` and `<hr>`. Use CSS instead
      compact: boolean,
      // Lists. Use CSS to reduce space between items instead
      declare: boolean,
      // `<object>`
      event: null,
      // `<script>`
      face: null,
      // `<font>`. Use CSS instead
      frame: null,
      // `<table>`
      frameBorder: null,
      // `<iframe>`. Use CSS `border` instead
      hSpace: number,
      // `<img>` and `<object>`
      leftMargin: number,
      // `<body>`
      link: null,
      // `<body>`. Use CSS `a:link {color: *}` instead
      longDesc: null,
      // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
      lowSrc: null,
      // `<img>`. Use a `<picture>`
      marginHeight: number,
      // `<body>`
      marginWidth: number,
      // `<body>`
      noResize: boolean,
      // `<frame>`
      noHref: boolean,
      // `<area>`. Use no href instead of an explicit `nohref`
      noShade: boolean,
      // `<hr>`. Use background-color and height instead of borders
      noWrap: boolean,
      // `<td>` and `<th>`
      object: null,
      // `<applet>`
      profile: null,
      // `<head>`
      prompt: null,
      // `<isindex>`
      rev: null,
      // `<link>`
      rightMargin: number,
      // `<body>`
      rules: null,
      // `<table>`
      scheme: null,
      // `<meta>`
      scrolling: booleanish,
      // `<frame>`. Use overflow in the child context
      standby: null,
      // `<object>`
      summary: null,
      // `<table>`
      text: null,
      // `<body>`. Use CSS `color` instead
      topMargin: number,
      // `<body>`
      valueType: null,
      // `<param>`
      version: null,
      // `<html>`. Use a doctype.
      vAlign: null,
      // Several. Use CSS `vertical-align` instead
      vLink: null,
      // `<body>`. Use CSS `a:visited {color}` instead
      vSpace: number,
      // `<img>` and `<object>`
      // Non-standard Properties.
      allowTransparency: null,
      autoCorrect: null,
      autoSave: null,
      credentialless: boolean,
      disablePictureInPicture: boolean,
      disableRemotePlayback: boolean,
      exportParts: commaSeparated,
      part: spaceSeparated,
      prefix: null,
      property: null,
      results: number,
      security: null,
      unselectable: null
    },
    space: "html",
    transform: caseInsensitiveTransform
  });

  // node_modules/property-information/lib/svg.js
  var svg = create({
    attributes: {
      accentHeight: "accent-height",
      alignmentBaseline: "alignment-baseline",
      arabicForm: "arabic-form",
      baselineShift: "baseline-shift",
      capHeight: "cap-height",
      className: "class",
      clipPath: "clip-path",
      clipRule: "clip-rule",
      colorInterpolation: "color-interpolation",
      colorInterpolationFilters: "color-interpolation-filters",
      colorProfile: "color-profile",
      colorRendering: "color-rendering",
      crossOrigin: "crossorigin",
      dataType: "datatype",
      dominantBaseline: "dominant-baseline",
      enableBackground: "enable-background",
      fillOpacity: "fill-opacity",
      fillRule: "fill-rule",
      floodColor: "flood-color",
      floodOpacity: "flood-opacity",
      fontFamily: "font-family",
      fontSize: "font-size",
      fontSizeAdjust: "font-size-adjust",
      fontStretch: "font-stretch",
      fontStyle: "font-style",
      fontVariant: "font-variant",
      fontWeight: "font-weight",
      glyphName: "glyph-name",
      glyphOrientationHorizontal: "glyph-orientation-horizontal",
      glyphOrientationVertical: "glyph-orientation-vertical",
      hrefLang: "hreflang",
      horizAdvX: "horiz-adv-x",
      horizOriginX: "horiz-origin-x",
      horizOriginY: "horiz-origin-y",
      imageRendering: "image-rendering",
      letterSpacing: "letter-spacing",
      lightingColor: "lighting-color",
      markerEnd: "marker-end",
      markerMid: "marker-mid",
      markerStart: "marker-start",
      maskType: "mask-type",
      navDown: "nav-down",
      navDownLeft: "nav-down-left",
      navDownRight: "nav-down-right",
      navLeft: "nav-left",
      navNext: "nav-next",
      navPrev: "nav-prev",
      navRight: "nav-right",
      navUp: "nav-up",
      navUpLeft: "nav-up-left",
      navUpRight: "nav-up-right",
      onAbort: "onabort",
      onActivate: "onactivate",
      onAfterPrint: "onafterprint",
      onBeforePrint: "onbeforeprint",
      onBegin: "onbegin",
      onCancel: "oncancel",
      onCanPlay: "oncanplay",
      onCanPlayThrough: "oncanplaythrough",
      onChange: "onchange",
      onClick: "onclick",
      onClose: "onclose",
      onCopy: "oncopy",
      onCueChange: "oncuechange",
      onCut: "oncut",
      onDblClick: "ondblclick",
      onDrag: "ondrag",
      onDragEnd: "ondragend",
      onDragEnter: "ondragenter",
      onDragExit: "ondragexit",
      onDragLeave: "ondragleave",
      onDragOver: "ondragover",
      onDragStart: "ondragstart",
      onDrop: "ondrop",
      onDurationChange: "ondurationchange",
      onEmptied: "onemptied",
      onEnd: "onend",
      onEnded: "onended",
      onError: "onerror",
      onFocus: "onfocus",
      onFocusIn: "onfocusin",
      onFocusOut: "onfocusout",
      onHashChange: "onhashchange",
      onInput: "oninput",
      onInvalid: "oninvalid",
      onKeyDown: "onkeydown",
      onKeyPress: "onkeypress",
      onKeyUp: "onkeyup",
      onLoad: "onload",
      onLoadedData: "onloadeddata",
      onLoadedMetadata: "onloadedmetadata",
      onLoadStart: "onloadstart",
      onMessage: "onmessage",
      onMouseDown: "onmousedown",
      onMouseEnter: "onmouseenter",
      onMouseLeave: "onmouseleave",
      onMouseMove: "onmousemove",
      onMouseOut: "onmouseout",
      onMouseOver: "onmouseover",
      onMouseUp: "onmouseup",
      onMouseWheel: "onmousewheel",
      onOffline: "onoffline",
      onOnline: "ononline",
      onPageHide: "onpagehide",
      onPageShow: "onpageshow",
      onPaste: "onpaste",
      onPause: "onpause",
      onPlay: "onplay",
      onPlaying: "onplaying",
      onPopState: "onpopstate",
      onProgress: "onprogress",
      onRateChange: "onratechange",
      onRepeat: "onrepeat",
      onReset: "onreset",
      onResize: "onresize",
      onScroll: "onscroll",
      onSeeked: "onseeked",
      onSeeking: "onseeking",
      onSelect: "onselect",
      onShow: "onshow",
      onStalled: "onstalled",
      onStorage: "onstorage",
      onSubmit: "onsubmit",
      onSuspend: "onsuspend",
      onTimeUpdate: "ontimeupdate",
      onToggle: "ontoggle",
      onUnload: "onunload",
      onVolumeChange: "onvolumechange",
      onWaiting: "onwaiting",
      onZoom: "onzoom",
      overlinePosition: "overline-position",
      overlineThickness: "overline-thickness",
      paintOrder: "paint-order",
      panose1: "panose-1",
      pointerEvents: "pointer-events",
      referrerPolicy: "referrerpolicy",
      renderingIntent: "rendering-intent",
      shapeRendering: "shape-rendering",
      stopColor: "stop-color",
      stopOpacity: "stop-opacity",
      strikethroughPosition: "strikethrough-position",
      strikethroughThickness: "strikethrough-thickness",
      strokeDashArray: "stroke-dasharray",
      strokeDashOffset: "stroke-dashoffset",
      strokeLineCap: "stroke-linecap",
      strokeLineJoin: "stroke-linejoin",
      strokeMiterLimit: "stroke-miterlimit",
      strokeOpacity: "stroke-opacity",
      strokeWidth: "stroke-width",
      tabIndex: "tabindex",
      textAnchor: "text-anchor",
      textDecoration: "text-decoration",
      textRendering: "text-rendering",
      transformOrigin: "transform-origin",
      typeOf: "typeof",
      underlinePosition: "underline-position",
      underlineThickness: "underline-thickness",
      unicodeBidi: "unicode-bidi",
      unicodeRange: "unicode-range",
      unitsPerEm: "units-per-em",
      vAlphabetic: "v-alphabetic",
      vHanging: "v-hanging",
      vIdeographic: "v-ideographic",
      vMathematical: "v-mathematical",
      vectorEffect: "vector-effect",
      vertAdvY: "vert-adv-y",
      vertOriginX: "vert-origin-x",
      vertOriginY: "vert-origin-y",
      wordSpacing: "word-spacing",
      writingMode: "writing-mode",
      xHeight: "x-height",
      // These were camelcased in Tiny. Now lowercased in SVG 2
      playbackOrder: "playbackorder",
      timelineBegin: "timelinebegin"
    },
    properties: {
      about: commaOrSpaceSeparated,
      accentHeight: number,
      accumulate: null,
      additive: null,
      alignmentBaseline: null,
      alphabetic: number,
      amplitude: number,
      arabicForm: null,
      ascent: number,
      attributeName: null,
      attributeType: null,
      azimuth: number,
      bandwidth: null,
      baselineShift: null,
      baseFrequency: null,
      baseProfile: null,
      bbox: null,
      begin: null,
      bias: number,
      by: null,
      calcMode: null,
      capHeight: number,
      className: spaceSeparated,
      clip: null,
      clipPath: null,
      clipPathUnits: null,
      clipRule: null,
      color: null,
      colorInterpolation: null,
      colorInterpolationFilters: null,
      colorProfile: null,
      colorRendering: null,
      content: null,
      contentScriptType: null,
      contentStyleType: null,
      crossOrigin: null,
      cursor: null,
      cx: null,
      cy: null,
      d: null,
      dataType: null,
      defaultAction: null,
      descent: number,
      diffuseConstant: number,
      direction: null,
      display: null,
      dur: null,
      divisor: number,
      dominantBaseline: null,
      download: boolean,
      dx: null,
      dy: null,
      edgeMode: null,
      editable: null,
      elevation: number,
      enableBackground: null,
      end: null,
      event: null,
      exponent: number,
      externalResourcesRequired: null,
      fill: null,
      fillOpacity: number,
      fillRule: null,
      filter: null,
      filterRes: null,
      filterUnits: null,
      floodColor: null,
      floodOpacity: null,
      focusable: null,
      focusHighlight: null,
      fontFamily: null,
      fontSize: null,
      fontSizeAdjust: null,
      fontStretch: null,
      fontStyle: null,
      fontVariant: null,
      fontWeight: null,
      format: null,
      fr: null,
      from: null,
      fx: null,
      fy: null,
      g1: commaSeparated,
      g2: commaSeparated,
      glyphName: commaSeparated,
      glyphOrientationHorizontal: null,
      glyphOrientationVertical: null,
      glyphRef: null,
      gradientTransform: null,
      gradientUnits: null,
      handler: null,
      hanging: number,
      hatchContentUnits: null,
      hatchUnits: null,
      height: null,
      href: null,
      hrefLang: null,
      horizAdvX: number,
      horizOriginX: number,
      horizOriginY: number,
      id: null,
      ideographic: number,
      imageRendering: null,
      initialVisibility: null,
      in: null,
      in2: null,
      intercept: number,
      k: number,
      k1: number,
      k2: number,
      k3: number,
      k4: number,
      kernelMatrix: commaOrSpaceSeparated,
      kernelUnitLength: null,
      keyPoints: null,
      // SEMI_COLON_SEPARATED
      keySplines: null,
      // SEMI_COLON_SEPARATED
      keyTimes: null,
      // SEMI_COLON_SEPARATED
      kerning: null,
      lang: null,
      lengthAdjust: null,
      letterSpacing: null,
      lightingColor: null,
      limitingConeAngle: number,
      local: null,
      markerEnd: null,
      markerMid: null,
      markerStart: null,
      markerHeight: null,
      markerUnits: null,
      markerWidth: null,
      mask: null,
      maskContentUnits: null,
      maskType: null,
      maskUnits: null,
      mathematical: null,
      max: null,
      media: null,
      mediaCharacterEncoding: null,
      mediaContentEncodings: null,
      mediaSize: number,
      mediaTime: null,
      method: null,
      min: null,
      mode: null,
      name: null,
      navDown: null,
      navDownLeft: null,
      navDownRight: null,
      navLeft: null,
      navNext: null,
      navPrev: null,
      navRight: null,
      navUp: null,
      navUpLeft: null,
      navUpRight: null,
      numOctaves: null,
      observer: null,
      offset: null,
      onAbort: null,
      onActivate: null,
      onAfterPrint: null,
      onBeforePrint: null,
      onBegin: null,
      onCancel: null,
      onCanPlay: null,
      onCanPlayThrough: null,
      onChange: null,
      onClick: null,
      onClose: null,
      onCopy: null,
      onCueChange: null,
      onCut: null,
      onDblClick: null,
      onDrag: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragExit: null,
      onDragLeave: null,
      onDragOver: null,
      onDragStart: null,
      onDrop: null,
      onDurationChange: null,
      onEmptied: null,
      onEnd: null,
      onEnded: null,
      onError: null,
      onFocus: null,
      onFocusIn: null,
      onFocusOut: null,
      onHashChange: null,
      onInput: null,
      onInvalid: null,
      onKeyDown: null,
      onKeyPress: null,
      onKeyUp: null,
      onLoad: null,
      onLoadedData: null,
      onLoadedMetadata: null,
      onLoadStart: null,
      onMessage: null,
      onMouseDown: null,
      onMouseEnter: null,
      onMouseLeave: null,
      onMouseMove: null,
      onMouseOut: null,
      onMouseOver: null,
      onMouseUp: null,
      onMouseWheel: null,
      onOffline: null,
      onOnline: null,
      onPageHide: null,
      onPageShow: null,
      onPaste: null,
      onPause: null,
      onPlay: null,
      onPlaying: null,
      onPopState: null,
      onProgress: null,
      onRateChange: null,
      onRepeat: null,
      onReset: null,
      onResize: null,
      onScroll: null,
      onSeeked: null,
      onSeeking: null,
      onSelect: null,
      onShow: null,
      onStalled: null,
      onStorage: null,
      onSubmit: null,
      onSuspend: null,
      onTimeUpdate: null,
      onToggle: null,
      onUnload: null,
      onVolumeChange: null,
      onWaiting: null,
      onZoom: null,
      opacity: null,
      operator: null,
      order: null,
      orient: null,
      orientation: null,
      origin: null,
      overflow: null,
      overlay: null,
      overlinePosition: number,
      overlineThickness: number,
      paintOrder: null,
      panose1: null,
      path: null,
      pathLength: number,
      patternContentUnits: null,
      patternTransform: null,
      patternUnits: null,
      phase: null,
      ping: spaceSeparated,
      pitch: null,
      playbackOrder: null,
      pointerEvents: null,
      points: null,
      pointsAtX: number,
      pointsAtY: number,
      pointsAtZ: number,
      preserveAlpha: null,
      preserveAspectRatio: null,
      primitiveUnits: null,
      propagate: null,
      property: commaOrSpaceSeparated,
      r: null,
      radius: null,
      referrerPolicy: null,
      refX: null,
      refY: null,
      rel: commaOrSpaceSeparated,
      rev: commaOrSpaceSeparated,
      renderingIntent: null,
      repeatCount: null,
      repeatDur: null,
      requiredExtensions: commaOrSpaceSeparated,
      requiredFeatures: commaOrSpaceSeparated,
      requiredFonts: commaOrSpaceSeparated,
      requiredFormats: commaOrSpaceSeparated,
      resource: null,
      restart: null,
      result: null,
      rotate: null,
      rx: null,
      ry: null,
      scale: null,
      seed: null,
      shapeRendering: null,
      side: null,
      slope: null,
      snapshotTime: null,
      specularConstant: number,
      specularExponent: number,
      spreadMethod: null,
      spacing: null,
      startOffset: null,
      stdDeviation: null,
      stemh: null,
      stemv: null,
      stitchTiles: null,
      stopColor: null,
      stopOpacity: null,
      strikethroughPosition: number,
      strikethroughThickness: number,
      string: null,
      stroke: null,
      strokeDashArray: commaOrSpaceSeparated,
      strokeDashOffset: null,
      strokeLineCap: null,
      strokeLineJoin: null,
      strokeMiterLimit: number,
      strokeOpacity: number,
      strokeWidth: null,
      style: null,
      surfaceScale: number,
      syncBehavior: null,
      syncBehaviorDefault: null,
      syncMaster: null,
      syncTolerance: null,
      syncToleranceDefault: null,
      systemLanguage: commaOrSpaceSeparated,
      tabIndex: number,
      tableValues: null,
      target: null,
      targetX: number,
      targetY: number,
      textAnchor: null,
      textDecoration: null,
      textRendering: null,
      textLength: null,
      timelineBegin: null,
      title: null,
      transformBehavior: null,
      type: null,
      typeOf: commaOrSpaceSeparated,
      to: null,
      transform: null,
      transformOrigin: null,
      u1: null,
      u2: null,
      underlinePosition: number,
      underlineThickness: number,
      unicode: null,
      unicodeBidi: null,
      unicodeRange: null,
      unitsPerEm: number,
      values: null,
      vAlphabetic: number,
      vMathematical: number,
      vectorEffect: null,
      vHanging: number,
      vIdeographic: number,
      version: null,
      vertAdvY: number,
      vertOriginX: number,
      vertOriginY: number,
      viewBox: null,
      viewTarget: null,
      visibility: null,
      width: null,
      widths: null,
      wordSpacing: null,
      writingMode: null,
      x: null,
      x1: null,
      x2: null,
      xChannelSelector: null,
      xHeight: number,
      y: null,
      y1: null,
      y2: null,
      yChannelSelector: null,
      z: null,
      zoomAndPan: null
    },
    space: "svg",
    transform: caseSensitiveTransform
  });

  // node_modules/property-information/lib/xlink.js
  var xlink = create({
    properties: {
      xLinkActuate: null,
      xLinkArcRole: null,
      xLinkHref: null,
      xLinkRole: null,
      xLinkShow: null,
      xLinkTitle: null,
      xLinkType: null
    },
    space: "xlink",
    transform(_4, property) {
      return "xlink:" + property.slice(5).toLowerCase();
    }
  });

  // node_modules/property-information/lib/xmlns.js
  var xmlns = create({
    attributes: { xmlnsxlink: "xmlns:xlink" },
    properties: { xmlnsXLink: null, xmlns: null },
    space: "xmlns",
    transform: caseInsensitiveTransform
  });

  // node_modules/property-information/lib/xml.js
  var xml = create({
    properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
    space: "xml",
    transform(_4, property) {
      return "xml:" + property.slice(3).toLowerCase();
    }
  });

  // node_modules/property-information/lib/find.js
  var cap = /[A-Z]/g;
  var dash = /-[a-z]/g;
  var valid = /^data[-\w.:]+$/i;
  function find(schema, value) {
    const normal = normalize(value);
    let property = value;
    let Type = Info;
    if (normal in schema.normal) {
      return schema.property[schema.normal[normal]];
    }
    if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
      if (value.charAt(4) === "-") {
        const rest = value.slice(5).replace(dash, camelcase);
        property = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
      } else {
        const rest = value.slice(4);
        if (!dash.test(rest)) {
          let dashes = rest.replace(cap, kebab);
          if (dashes.charAt(0) !== "-") {
            dashes = "-" + dashes;
          }
          value = "data" + dashes;
        }
      }
      Type = DefinedInfo;
    }
    return new Type(property, value);
  }
  function kebab($0) {
    return "-" + $0.toLowerCase();
  }
  function camelcase($0) {
    return $0.charAt(1).toUpperCase();
  }

  // node_modules/property-information/index.js
  var html2 = merge([aria, html, xlink, xmlns, xml], "html");
  var svg2 = merge([aria, svg, xlink, xmlns, xml], "svg");

  // node_modules/zwitch/index.js
  var own = {}.hasOwnProperty;
  function zwitch(key2, options) {
    const settings = options || {};
    function one2(value, ...parameters) {
      let fn = one2.invalid;
      const handlers = one2.handlers;
      if (value && own.call(value, key2)) {
        const id = String(value[key2]);
        fn = own.call(handlers, id) ? handlers[id] : one2.unknown;
      }
      if (fn) {
        return fn.call(this, value, ...parameters);
      }
    }
    one2.handlers = settings.handlers || {};
    one2.invalid = settings.invalid;
    one2.unknown = settings.unknown;
    return one2;
  }

  // node_modules/stringify-entities/lib/core.js
  var defaultSubsetRegex = /["&'<>`]/g;
  var surrogatePairsRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  var controlCharactersRegex = (
    // eslint-disable-next-line no-control-regex, unicorn/no-hex-escape
    /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g
  );
  var regexEscapeRegex = /[|\\{}()[\]^$+*?.]/g;
  var subsetToRegexCache = /* @__PURE__ */ new WeakMap();
  function core(value, options) {
    value = value.replace(
      options.subset ? charactersToExpressionCached(options.subset) : defaultSubsetRegex,
      basic
    );
    if (options.subset || options.escapeOnly) {
      return value;
    }
    return value.replace(surrogatePairsRegex, surrogate).replace(controlCharactersRegex, basic);
    function surrogate(pair, index, all2) {
      return options.format(
        (pair.charCodeAt(0) - 55296) * 1024 + pair.charCodeAt(1) - 56320 + 65536,
        all2.charCodeAt(index + 2),
        options
      );
    }
    function basic(character, index, all2) {
      return options.format(
        character.charCodeAt(0),
        all2.charCodeAt(index + 1),
        options
      );
    }
  }
  function charactersToExpressionCached(subset) {
    let cached = subsetToRegexCache.get(subset);
    if (!cached) {
      cached = charactersToExpression(subset);
      subsetToRegexCache.set(subset, cached);
    }
    return cached;
  }
  function charactersToExpression(subset) {
    const groups = [];
    let index = -1;
    while (++index < subset.length) {
      groups.push(subset[index].replace(regexEscapeRegex, "\\$&"));
    }
    return new RegExp("(?:" + groups.join("|") + ")", "g");
  }

  // node_modules/stringify-entities/lib/util/to-hexadecimal.js
  var hexadecimalRegex = /[\dA-Fa-f]/;
  function toHexadecimal(code, next, omit) {
    const value = "&#x" + code.toString(16).toUpperCase();
    return omit && next && !hexadecimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
  }

  // node_modules/stringify-entities/lib/util/to-decimal.js
  var decimalRegex = /\d/;
  function toDecimal(code, next, omit) {
    const value = "&#" + String(code);
    return omit && next && !decimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
  }

  // node_modules/character-entities-legacy/index.js
  var characterEntitiesLegacy = [
    "AElig",
    "AMP",
    "Aacute",
    "Acirc",
    "Agrave",
    "Aring",
    "Atilde",
    "Auml",
    "COPY",
    "Ccedil",
    "ETH",
    "Eacute",
    "Ecirc",
    "Egrave",
    "Euml",
    "GT",
    "Iacute",
    "Icirc",
    "Igrave",
    "Iuml",
    "LT",
    "Ntilde",
    "Oacute",
    "Ocirc",
    "Ograve",
    "Oslash",
    "Otilde",
    "Ouml",
    "QUOT",
    "REG",
    "THORN",
    "Uacute",
    "Ucirc",
    "Ugrave",
    "Uuml",
    "Yacute",
    "aacute",
    "acirc",
    "acute",
    "aelig",
    "agrave",
    "amp",
    "aring",
    "atilde",
    "auml",
    "brvbar",
    "ccedil",
    "cedil",
    "cent",
    "copy",
    "curren",
    "deg",
    "divide",
    "eacute",
    "ecirc",
    "egrave",
    "eth",
    "euml",
    "frac12",
    "frac14",
    "frac34",
    "gt",
    "iacute",
    "icirc",
    "iexcl",
    "igrave",
    "iquest",
    "iuml",
    "laquo",
    "lt",
    "macr",
    "micro",
    "middot",
    "nbsp",
    "not",
    "ntilde",
    "oacute",
    "ocirc",
    "ograve",
    "ordf",
    "ordm",
    "oslash",
    "otilde",
    "ouml",
    "para",
    "plusmn",
    "pound",
    "quot",
    "raquo",
    "reg",
    "sect",
    "shy",
    "sup1",
    "sup2",
    "sup3",
    "szlig",
    "thorn",
    "times",
    "uacute",
    "ucirc",
    "ugrave",
    "uml",
    "uuml",
    "yacute",
    "yen",
    "yuml"
  ];

  // node_modules/character-entities-html4/index.js
  var characterEntitiesHtml4 = {
    nbsp: "\xA0",
    iexcl: "\xA1",
    cent: "\xA2",
    pound: "\xA3",
    curren: "\xA4",
    yen: "\xA5",
    brvbar: "\xA6",
    sect: "\xA7",
    uml: "\xA8",
    copy: "\xA9",
    ordf: "\xAA",
    laquo: "\xAB",
    not: "\xAC",
    shy: "\xAD",
    reg: "\xAE",
    macr: "\xAF",
    deg: "\xB0",
    plusmn: "\xB1",
    sup2: "\xB2",
    sup3: "\xB3",
    acute: "\xB4",
    micro: "\xB5",
    para: "\xB6",
    middot: "\xB7",
    cedil: "\xB8",
    sup1: "\xB9",
    ordm: "\xBA",
    raquo: "\xBB",
    frac14: "\xBC",
    frac12: "\xBD",
    frac34: "\xBE",
    iquest: "\xBF",
    Agrave: "\xC0",
    Aacute: "\xC1",
    Acirc: "\xC2",
    Atilde: "\xC3",
    Auml: "\xC4",
    Aring: "\xC5",
    AElig: "\xC6",
    Ccedil: "\xC7",
    Egrave: "\xC8",
    Eacute: "\xC9",
    Ecirc: "\xCA",
    Euml: "\xCB",
    Igrave: "\xCC",
    Iacute: "\xCD",
    Icirc: "\xCE",
    Iuml: "\xCF",
    ETH: "\xD0",
    Ntilde: "\xD1",
    Ograve: "\xD2",
    Oacute: "\xD3",
    Ocirc: "\xD4",
    Otilde: "\xD5",
    Ouml: "\xD6",
    times: "\xD7",
    Oslash: "\xD8",
    Ugrave: "\xD9",
    Uacute: "\xDA",
    Ucirc: "\xDB",
    Uuml: "\xDC",
    Yacute: "\xDD",
    THORN: "\xDE",
    szlig: "\xDF",
    agrave: "\xE0",
    aacute: "\xE1",
    acirc: "\xE2",
    atilde: "\xE3",
    auml: "\xE4",
    aring: "\xE5",
    aelig: "\xE6",
    ccedil: "\xE7",
    egrave: "\xE8",
    eacute: "\xE9",
    ecirc: "\xEA",
    euml: "\xEB",
    igrave: "\xEC",
    iacute: "\xED",
    icirc: "\xEE",
    iuml: "\xEF",
    eth: "\xF0",
    ntilde: "\xF1",
    ograve: "\xF2",
    oacute: "\xF3",
    ocirc: "\xF4",
    otilde: "\xF5",
    ouml: "\xF6",
    divide: "\xF7",
    oslash: "\xF8",
    ugrave: "\xF9",
    uacute: "\xFA",
    ucirc: "\xFB",
    uuml: "\xFC",
    yacute: "\xFD",
    thorn: "\xFE",
    yuml: "\xFF",
    fnof: "\u0192",
    Alpha: "\u0391",
    Beta: "\u0392",
    Gamma: "\u0393",
    Delta: "\u0394",
    Epsilon: "\u0395",
    Zeta: "\u0396",
    Eta: "\u0397",
    Theta: "\u0398",
    Iota: "\u0399",
    Kappa: "\u039A",
    Lambda: "\u039B",
    Mu: "\u039C",
    Nu: "\u039D",
    Xi: "\u039E",
    Omicron: "\u039F",
    Pi: "\u03A0",
    Rho: "\u03A1",
    Sigma: "\u03A3",
    Tau: "\u03A4",
    Upsilon: "\u03A5",
    Phi: "\u03A6",
    Chi: "\u03A7",
    Psi: "\u03A8",
    Omega: "\u03A9",
    alpha: "\u03B1",
    beta: "\u03B2",
    gamma: "\u03B3",
    delta: "\u03B4",
    epsilon: "\u03B5",
    zeta: "\u03B6",
    eta: "\u03B7",
    theta: "\u03B8",
    iota: "\u03B9",
    kappa: "\u03BA",
    lambda: "\u03BB",
    mu: "\u03BC",
    nu: "\u03BD",
    xi: "\u03BE",
    omicron: "\u03BF",
    pi: "\u03C0",
    rho: "\u03C1",
    sigmaf: "\u03C2",
    sigma: "\u03C3",
    tau: "\u03C4",
    upsilon: "\u03C5",
    phi: "\u03C6",
    chi: "\u03C7",
    psi: "\u03C8",
    omega: "\u03C9",
    thetasym: "\u03D1",
    upsih: "\u03D2",
    piv: "\u03D6",
    bull: "\u2022",
    hellip: "\u2026",
    prime: "\u2032",
    Prime: "\u2033",
    oline: "\u203E",
    frasl: "\u2044",
    weierp: "\u2118",
    image: "\u2111",
    real: "\u211C",
    trade: "\u2122",
    alefsym: "\u2135",
    larr: "\u2190",
    uarr: "\u2191",
    rarr: "\u2192",
    darr: "\u2193",
    harr: "\u2194",
    crarr: "\u21B5",
    lArr: "\u21D0",
    uArr: "\u21D1",
    rArr: "\u21D2",
    dArr: "\u21D3",
    hArr: "\u21D4",
    forall: "\u2200",
    part: "\u2202",
    exist: "\u2203",
    empty: "\u2205",
    nabla: "\u2207",
    isin: "\u2208",
    notin: "\u2209",
    ni: "\u220B",
    prod: "\u220F",
    sum: "\u2211",
    minus: "\u2212",
    lowast: "\u2217",
    radic: "\u221A",
    prop: "\u221D",
    infin: "\u221E",
    ang: "\u2220",
    and: "\u2227",
    or: "\u2228",
    cap: "\u2229",
    cup: "\u222A",
    int: "\u222B",
    there4: "\u2234",
    sim: "\u223C",
    cong: "\u2245",
    asymp: "\u2248",
    ne: "\u2260",
    equiv: "\u2261",
    le: "\u2264",
    ge: "\u2265",
    sub: "\u2282",
    sup: "\u2283",
    nsub: "\u2284",
    sube: "\u2286",
    supe: "\u2287",
    oplus: "\u2295",
    otimes: "\u2297",
    perp: "\u22A5",
    sdot: "\u22C5",
    lceil: "\u2308",
    rceil: "\u2309",
    lfloor: "\u230A",
    rfloor: "\u230B",
    lang: "\u2329",
    rang: "\u232A",
    loz: "\u25CA",
    spades: "\u2660",
    clubs: "\u2663",
    hearts: "\u2665",
    diams: "\u2666",
    quot: '"',
    amp: "&",
    lt: "<",
    gt: ">",
    OElig: "\u0152",
    oelig: "\u0153",
    Scaron: "\u0160",
    scaron: "\u0161",
    Yuml: "\u0178",
    circ: "\u02C6",
    tilde: "\u02DC",
    ensp: "\u2002",
    emsp: "\u2003",
    thinsp: "\u2009",
    zwnj: "\u200C",
    zwj: "\u200D",
    lrm: "\u200E",
    rlm: "\u200F",
    ndash: "\u2013",
    mdash: "\u2014",
    lsquo: "\u2018",
    rsquo: "\u2019",
    sbquo: "\u201A",
    ldquo: "\u201C",
    rdquo: "\u201D",
    bdquo: "\u201E",
    dagger: "\u2020",
    Dagger: "\u2021",
    permil: "\u2030",
    lsaquo: "\u2039",
    rsaquo: "\u203A",
    euro: "\u20AC"
  };

  // node_modules/stringify-entities/lib/constant/dangerous.js
  var dangerous = [
    "cent",
    "copy",
    "divide",
    "gt",
    "lt",
    "not",
    "para",
    "times"
  ];

  // node_modules/stringify-entities/lib/util/to-named.js
  var own2 = {}.hasOwnProperty;
  var characters = {};
  var key;
  for (key in characterEntitiesHtml4) {
    if (own2.call(characterEntitiesHtml4, key)) {
      characters[characterEntitiesHtml4[key]] = key;
    }
  }
  var notAlphanumericRegex = /[^\dA-Za-z]/;
  function toNamed(code, next, omit, attribute) {
    const character = String.fromCharCode(code);
    if (own2.call(characters, character)) {
      const name = characters[character];
      const value = "&" + name;
      if (omit && characterEntitiesLegacy.includes(name) && !dangerous.includes(name) && (!attribute || next && next !== 61 && notAlphanumericRegex.test(String.fromCharCode(next)))) {
        return value;
      }
      return value + ";";
    }
    return "";
  }

  // node_modules/stringify-entities/lib/util/format-smart.js
  function formatSmart(code, next, options) {
    let numeric = toHexadecimal(code, next, options.omitOptionalSemicolons);
    let named;
    if (options.useNamedReferences || options.useShortestReferences) {
      named = toNamed(
        code,
        next,
        options.omitOptionalSemicolons,
        options.attribute
      );
    }
    if ((options.useShortestReferences || !named) && options.useShortestReferences) {
      const decimal = toDecimal(code, next, options.omitOptionalSemicolons);
      if (decimal.length < numeric.length) {
        numeric = decimal;
      }
    }
    return named && (!options.useShortestReferences || named.length < numeric.length) ? named : numeric;
  }

  // node_modules/stringify-entities/lib/index.js
  function stringifyEntities(value, options) {
    return core(value, Object.assign({ format: formatSmart }, options));
  }

  // node_modules/hast-util-to-html/lib/handle/comment.js
  var htmlCommentRegex = /^>|^->|<!--|-->|--!>|<!-$/g;
  var bogusCommentEntitySubset = [">"];
  var commentEntitySubset = ["<", ">"];
  function comment(node, _1, _22, state) {
    return state.settings.bogusComments ? "<?" + stringifyEntities(
      node.value,
      Object.assign({}, state.settings.characterReferences, {
        subset: bogusCommentEntitySubset
      })
    ) + ">" : "<!--" + node.value.replace(htmlCommentRegex, encode) + "-->";
    function encode($0) {
      return stringifyEntities(
        $0,
        Object.assign({}, state.settings.characterReferences, {
          subset: commentEntitySubset
        })
      );
    }
  }

  // node_modules/hast-util-to-html/lib/handle/doctype.js
  function doctype(_1, _22, _32, state) {
    return "<!" + (state.settings.upperDoctype ? "DOCTYPE" : "doctype") + (state.settings.tightDoctype ? "" : " ") + "html>";
  }

  // node_modules/ccount/index.js
  function ccount(value, character) {
    const source = String(value);
    if (typeof character !== "string") {
      throw new TypeError("Expected character");
    }
    let count = 0;
    let index = source.indexOf(character);
    while (index !== -1) {
      count++;
      index = source.indexOf(character, index + character.length);
    }
    return count;
  }

  // node_modules/comma-separated-tokens/index.js
  function stringify(values, options) {
    const settings = options || {};
    const input = values[values.length - 1] === "" ? [...values, ""] : values;
    return input.join(
      (settings.padRight ? " " : "") + "," + (settings.padLeft === false ? "" : " ")
    ).trim();
  }

  // node_modules/space-separated-tokens/index.js
  function stringify2(values) {
    return values.join(" ").trim();
  }

  // node_modules/hast-util-whitespace/lib/index.js
  var re2 = /[ \t\n\f\r]/g;
  function whitespace(thing) {
    return typeof thing === "object" ? thing.type === "text" ? empty(thing.value) : false : empty(thing);
  }
  function empty(value) {
    return value.replace(re2, "") === "";
  }

  // node_modules/hast-util-to-html/lib/omission/util/siblings.js
  var siblingAfter = siblings(1);
  var siblingBefore = siblings(-1);
  var emptyChildren = [];
  function siblings(increment2) {
    return sibling;
    function sibling(parent, index, includeWhitespace) {
      const siblings2 = parent ? parent.children : emptyChildren;
      let offset = (index || 0) + increment2;
      let next = siblings2[offset];
      if (!includeWhitespace) {
        while (next && whitespace(next)) {
          offset += increment2;
          next = siblings2[offset];
        }
      }
      return next;
    }
  }

  // node_modules/hast-util-to-html/lib/omission/omission.js
  var own3 = {}.hasOwnProperty;
  function omission(handlers) {
    return omit;
    function omit(node, index, parent) {
      return own3.call(handlers, node.tagName) && handlers[node.tagName](node, index, parent);
    }
  }

  // node_modules/hast-util-to-html/lib/omission/closing.js
  var closing = omission({
    body,
    caption: headOrColgroupOrCaption,
    colgroup: headOrColgroupOrCaption,
    dd,
    dt,
    head: headOrColgroupOrCaption,
    html: html3,
    li,
    optgroup,
    option,
    p,
    rp: rubyElement,
    rt: rubyElement,
    tbody,
    td: cells,
    tfoot,
    th: cells,
    thead,
    tr
  });
  function headOrColgroupOrCaption(_4, index, parent) {
    const next = siblingAfter(parent, index, true);
    return !next || next.type !== "comment" && !(next.type === "text" && whitespace(next.value.charAt(0)));
  }
  function html3(_4, index, parent) {
    const next = siblingAfter(parent, index);
    return !next || next.type !== "comment";
  }
  function body(_4, index, parent) {
    const next = siblingAfter(parent, index);
    return !next || next.type !== "comment";
  }
  function p(_4, index, parent) {
    const next = siblingAfter(parent, index);
    return next ? next.type === "element" && (next.tagName === "address" || next.tagName === "article" || next.tagName === "aside" || next.tagName === "blockquote" || next.tagName === "details" || next.tagName === "div" || next.tagName === "dl" || next.tagName === "fieldset" || next.tagName === "figcaption" || next.tagName === "figure" || next.tagName === "footer" || next.tagName === "form" || next.tagName === "h1" || next.tagName === "h2" || next.tagName === "h3" || next.tagName === "h4" || next.tagName === "h5" || next.tagName === "h6" || next.tagName === "header" || next.tagName === "hgroup" || next.tagName === "hr" || next.tagName === "main" || next.tagName === "menu" || next.tagName === "nav" || next.tagName === "ol" || next.tagName === "p" || next.tagName === "pre" || next.tagName === "section" || next.tagName === "table" || next.tagName === "ul") : !parent || // Confusing parent.
    !(parent.type === "element" && (parent.tagName === "a" || parent.tagName === "audio" || parent.tagName === "del" || parent.tagName === "ins" || parent.tagName === "map" || parent.tagName === "noscript" || parent.tagName === "video"));
  }
  function li(_4, index, parent) {
    const next = siblingAfter(parent, index);
    return !next || next.type === "element" && next.tagName === "li";
  }
  function dt(_4, index, parent) {
    const next = siblingAfter(parent, index);
    return Boolean(
      next && next.type === "element" && (next.tagName === "dt" || next.tagName === "dd")
    );
  }
  function dd(_4, index, parent) {
    const next = siblingAfter(parent, index);
    return !next || next.type === "element" && (next.tagName === "dt" || next.tagName === "dd");
  }
  function rubyElement(_4, index, parent) {
    const next = siblingAfter(parent, index);
    return !next || next.type === "element" && (next.tagName === "rp" || next.tagName === "rt");
  }
  function optgroup(_4, index, parent) {
    const next = siblingAfter(parent, index);
    return !next || next.type === "element" && next.tagName === "optgroup";
  }
  function option(_4, index, parent) {
    const next = siblingAfter(parent, index);
    return !next || next.type === "element" && (next.tagName === "option" || next.tagName === "optgroup");
  }
  function thead(_4, index, parent) {
    const next = siblingAfter(parent, index);
    return Boolean(
      next && next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot")
    );
  }
  function tbody(_4, index, parent) {
    const next = siblingAfter(parent, index);
    return !next || next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot");
  }
  function tfoot(_4, index, parent) {
    return !siblingAfter(parent, index);
  }
  function tr(_4, index, parent) {
    const next = siblingAfter(parent, index);
    return !next || next.type === "element" && next.tagName === "tr";
  }
  function cells(_4, index, parent) {
    const next = siblingAfter(parent, index);
    return !next || next.type === "element" && (next.tagName === "td" || next.tagName === "th");
  }

  // node_modules/hast-util-to-html/lib/omission/opening.js
  var opening = omission({
    body: body2,
    colgroup,
    head,
    html: html4,
    tbody: tbody2
  });
  function html4(node) {
    const head2 = siblingAfter(node, -1);
    return !head2 || head2.type !== "comment";
  }
  function head(node) {
    const seen = /* @__PURE__ */ new Set();
    for (const child2 of node.children) {
      if (child2.type === "element" && (child2.tagName === "base" || child2.tagName === "title")) {
        if (seen.has(child2.tagName)) return false;
        seen.add(child2.tagName);
      }
    }
    const child = node.children[0];
    return !child || child.type === "element";
  }
  function body2(node) {
    const head2 = siblingAfter(node, -1, true);
    return !head2 || head2.type !== "comment" && !(head2.type === "text" && whitespace(head2.value.charAt(0))) && !(head2.type === "element" && (head2.tagName === "meta" || head2.tagName === "link" || head2.tagName === "script" || head2.tagName === "style" || head2.tagName === "template"));
  }
  function colgroup(node, index, parent) {
    const previous = siblingBefore(parent, index);
    const head2 = siblingAfter(node, -1, true);
    if (parent && previous && previous.type === "element" && previous.tagName === "colgroup" && closing(previous, parent.children.indexOf(previous), parent)) {
      return false;
    }
    return Boolean(head2 && head2.type === "element" && head2.tagName === "col");
  }
  function tbody2(node, index, parent) {
    const previous = siblingBefore(parent, index);
    const head2 = siblingAfter(node, -1);
    if (parent && previous && previous.type === "element" && (previous.tagName === "thead" || previous.tagName === "tbody") && closing(previous, parent.children.indexOf(previous), parent)) {
      return false;
    }
    return Boolean(head2 && head2.type === "element" && head2.tagName === "tr");
  }

  // node_modules/hast-util-to-html/lib/handle/element.js
  var constants = {
    // See: <https://html.spec.whatwg.org/#attribute-name-state>.
    name: [
      ["	\n\f\r &/=>".split(""), "	\n\f\r \"&'/=>`".split("")],
      [`\0	
\f\r "&'/<=>`.split(""), "\0	\n\f\r \"&'/<=>`".split("")]
    ],
    // See: <https://html.spec.whatwg.org/#attribute-value-(unquoted)-state>.
    unquoted: [
      ["	\n\f\r &>".split(""), "\0	\n\f\r \"&'<=>`".split("")],
      ["\0	\n\f\r \"&'<=>`".split(""), "\0	\n\f\r \"&'<=>`".split("")]
    ],
    // See: <https://html.spec.whatwg.org/#attribute-value-(single-quoted)-state>.
    single: [
      ["&'".split(""), "\"&'`".split("")],
      ["\0&'".split(""), "\0\"&'`".split("")]
    ],
    // See: <https://html.spec.whatwg.org/#attribute-value-(double-quoted)-state>.
    double: [
      ['"&'.split(""), "\"&'`".split("")],
      ['\0"&'.split(""), "\0\"&'`".split("")]
    ]
  };
  function element(node, index, parent, state) {
    const schema = state.schema;
    const omit = schema.space === "svg" ? false : state.settings.omitOptionalTags;
    let selfClosing = schema.space === "svg" ? state.settings.closeEmptyElements : state.settings.voids.includes(node.tagName.toLowerCase());
    const parts = [];
    let last;
    if (schema.space === "html" && node.tagName === "svg") {
      state.schema = svg2;
    }
    const attributes = serializeAttributes(state, node.properties);
    const content = state.all(
      schema.space === "html" && node.tagName === "template" ? node.content : node
    );
    state.schema = schema;
    if (content) selfClosing = false;
    if (attributes || !omit || !opening(node, index, parent)) {
      parts.push("<", node.tagName, attributes ? " " + attributes : "");
      if (selfClosing && (schema.space === "svg" || state.settings.closeSelfClosing)) {
        last = attributes.charAt(attributes.length - 1);
        if (!state.settings.tightSelfClosing || last === "/" || last && last !== '"' && last !== "'") {
          parts.push(" ");
        }
        parts.push("/");
      }
      parts.push(">");
    }
    parts.push(content);
    if (!selfClosing && (!omit || !closing(node, index, parent))) {
      parts.push("</" + node.tagName + ">");
    }
    return parts.join("");
  }
  function serializeAttributes(state, properties) {
    const values = [];
    let index = -1;
    let key2;
    if (properties) {
      for (key2 in properties) {
        if (properties[key2] !== null && properties[key2] !== void 0) {
          const value = serializeAttribute(state, key2, properties[key2]);
          if (value) values.push(value);
        }
      }
    }
    while (++index < values.length) {
      const last = state.settings.tightAttributes ? values[index].charAt(values[index].length - 1) : void 0;
      if (index !== values.length - 1 && last !== '"' && last !== "'") {
        values[index] += " ";
      }
    }
    return values.join("");
  }
  function serializeAttribute(state, key2, value) {
    const info = find(state.schema, key2);
    const x4 = state.settings.allowParseErrors && state.schema.space === "html" ? 0 : 1;
    const y4 = state.settings.allowDangerousCharacters ? 0 : 1;
    let quote = state.quote;
    let result;
    if (info.overloadedBoolean && (value === info.attribute || value === "")) {
      value = true;
    } else if ((info.boolean || info.overloadedBoolean) && (typeof value !== "string" || value === info.attribute || value === "")) {
      value = Boolean(value);
    }
    if (value === null || value === void 0 || value === false || typeof value === "number" && Number.isNaN(value)) {
      return "";
    }
    const name = stringifyEntities(
      info.attribute,
      Object.assign({}, state.settings.characterReferences, {
        // Always encode without parse errors in non-HTML.
        subset: constants.name[x4][y4]
      })
    );
    if (value === true) return name;
    value = Array.isArray(value) ? (info.commaSeparated ? stringify : stringify2)(value, {
      padLeft: !state.settings.tightCommaSeparatedLists
    }) : String(value);
    if (state.settings.collapseEmptyAttributes && !value) return name;
    if (state.settings.preferUnquoted) {
      result = stringifyEntities(
        value,
        Object.assign({}, state.settings.characterReferences, {
          attribute: true,
          subset: constants.unquoted[x4][y4]
        })
      );
    }
    if (result !== value) {
      if (state.settings.quoteSmart && ccount(value, quote) > ccount(value, state.alternative)) {
        quote = state.alternative;
      }
      result = quote + stringifyEntities(
        value,
        Object.assign({}, state.settings.characterReferences, {
          // Always encode without parse errors in non-HTML.
          subset: (quote === "'" ? constants.single : constants.double)[x4][y4],
          attribute: true
        })
      ) + quote;
    }
    return name + (result ? "=" + result : result);
  }

  // node_modules/hast-util-to-html/lib/handle/text.js
  var textEntitySubset = ["<", "&"];
  function text2(node, _4, parent, state) {
    return parent && parent.type === "element" && (parent.tagName === "script" || parent.tagName === "style") ? node.value : stringifyEntities(
      node.value,
      Object.assign({}, state.settings.characterReferences, {
        subset: textEntitySubset
      })
    );
  }

  // node_modules/hast-util-to-html/lib/handle/raw.js
  function raw(node, index, parent, state) {
    return state.settings.allowDangerousHtml ? node.value : text2(node, index, parent, state);
  }

  // node_modules/hast-util-to-html/lib/handle/root.js
  function root(node, _1, _22, state) {
    return state.all(node);
  }

  // node_modules/hast-util-to-html/lib/handle/index.js
  var handle = zwitch("type", {
    invalid,
    unknown,
    handlers: { comment, doctype, element, raw, root, text: text2 }
  });
  function invalid(node) {
    throw new Error("Expected node, not `" + node + "`");
  }
  function unknown(node_) {
    const node = (
      /** @type {Nodes} */
      node_
    );
    throw new Error("Cannot compile unknown node `" + node.type + "`");
  }

  // node_modules/hast-util-to-html/lib/index.js
  var emptyOptions = {};
  var emptyCharacterReferences = {};
  var emptyChildren2 = [];
  function toHtml(tree, options) {
    const options_ = options || emptyOptions;
    const quote = options_.quote || '"';
    const alternative = quote === '"' ? "'" : '"';
    if (quote !== '"' && quote !== "'") {
      throw new Error("Invalid quote `" + quote + "`, expected `'` or `\"`");
    }
    const state = {
      one,
      all,
      settings: {
        omitOptionalTags: options_.omitOptionalTags || false,
        allowParseErrors: options_.allowParseErrors || false,
        allowDangerousCharacters: options_.allowDangerousCharacters || false,
        quoteSmart: options_.quoteSmart || false,
        preferUnquoted: options_.preferUnquoted || false,
        tightAttributes: options_.tightAttributes || false,
        upperDoctype: options_.upperDoctype || false,
        tightDoctype: options_.tightDoctype || false,
        bogusComments: options_.bogusComments || false,
        tightCommaSeparatedLists: options_.tightCommaSeparatedLists || false,
        tightSelfClosing: options_.tightSelfClosing || false,
        collapseEmptyAttributes: options_.collapseEmptyAttributes || false,
        allowDangerousHtml: options_.allowDangerousHtml || false,
        voids: options_.voids || htmlVoidElements,
        characterReferences: options_.characterReferences || emptyCharacterReferences,
        closeSelfClosing: options_.closeSelfClosing || false,
        closeEmptyElements: options_.closeEmptyElements || false
      },
      schema: options_.space === "svg" ? svg2 : html2,
      quote,
      alternative
    };
    return state.one(
      Array.isArray(tree) ? { type: "root", children: tree } : tree,
      void 0,
      void 0
    );
  }
  function one(node, index, parent) {
    return handle(node, index, parent, this);
  }
  function all(parent) {
    const results = [];
    const children = parent && parent.children || emptyChildren2;
    let index = -1;
    while (++index < children.length) {
      results[index] = this.one(children[index], index, parent);
    }
    return results.join("");
  }

  // node_modules/@shikijs/core/dist/index.mjs
  var RE_WHITESPACE = /\s+/g;
  function addClassToHast(node, className) {
    if (!className) return node;
    node.properties ||= {};
    node.properties.class ||= [];
    if (typeof node.properties.class === "string") node.properties.class = node.properties.class.split(RE_WHITESPACE);
    if (!Array.isArray(node.properties.class)) node.properties.class = [];
    const targets = Array.isArray(className) ? className : className.split(RE_WHITESPACE);
    for (const c of targets) if (c && !node.properties.class.includes(c)) node.properties.class.push(c);
    return node;
  }
  function createPositionConverter(code) {
    const lines = splitLines(code, true).map(([line]) => line);
    function indexToPos(index) {
      if (index === code.length) return {
        line: lines.length - 1,
        character: lines.at(-1).length
      };
      let character = index;
      let line = 0;
      for (const lineText of lines) {
        if (character < lineText.length) break;
        character -= lineText.length;
        line++;
      }
      return {
        line,
        character
      };
    }
    function posToIndex(line, character) {
      let index = 0;
      for (let i2 = 0; i2 < line; i2++) index += lines[i2].length;
      index += character;
      return index;
    }
    return {
      lines,
      indexToPos,
      posToIndex
    };
  }
  var COLOR_KEYS = ["color", "background-color"];
  function splitToken(token2, offsets) {
    let lastOffset = 0;
    const tokens = [];
    for (const offset of offsets) {
      if (offset > lastOffset) tokens.push({
        ...token2,
        content: token2.content.slice(lastOffset, offset),
        offset: token2.offset + lastOffset
      });
      lastOffset = offset;
    }
    if (lastOffset < token2.content.length) tokens.push({
      ...token2,
      content: token2.content.slice(lastOffset),
      offset: token2.offset + lastOffset
    });
    return tokens;
  }
  function findFirstBreakpointAfter(breakpoints, offset) {
    let start = 0;
    let end = breakpoints.length;
    while (start < end) {
      const middle = start + (end - start >> 1);
      if (breakpoints[middle] <= offset) start = middle + 1;
      else end = middle;
    }
    return start;
  }
  function splitTokens(tokens, breakpoints) {
    const sorted = [...breakpoints instanceof Set ? breakpoints : new Set(breakpoints)].sort((a2, b4) => a2 - b4);
    if (!sorted.length) return tokens;
    return tokens.map((line) => {
      return line.flatMap((token2) => {
        const tokenEnd = token2.offset + token2.content.length;
        const start = findFirstBreakpointAfter(sorted, token2.offset);
        let end = start;
        while (end < sorted.length && sorted[end] < tokenEnd) end++;
        if (start === end) return token2;
        const breakpointsInToken = sorted.slice(start, end);
        for (let index = 0; index < breakpointsInToken.length; index++) breakpointsInToken[index] -= token2.offset;
        return splitToken(token2, breakpointsInToken);
      });
    });
  }
  function flatTokenVariants(merged, variantsOrder, cssVariablePrefix, defaultColor, colorsRendering = "css-vars") {
    const token2 = {
      content: merged.content,
      explanation: merged.explanation,
      offset: merged.offset
    };
    const styles2 = variantsOrder.map((t) => getTokenStyleObject(merged.variants[t]));
    const styleKeys = new Set(styles2.flatMap((t) => Object.keys(t)));
    const mergedStyles = {};
    const varKey = (idx, key2) => {
      const keyName = key2 === "color" ? "" : key2 === "background-color" ? "-bg" : `-${key2}`;
      return cssVariablePrefix + variantsOrder[idx] + (key2 === "color" ? "" : keyName);
    };
    styles2.forEach((cur, idx) => {
      for (const key2 of styleKeys) {
        const value = cur[key2] || "inherit";
        if (idx === 0 && defaultColor && COLOR_KEYS.includes(key2)) {
          if (defaultColor === "light-dark()" && styles2.length > 1) {
            const lightIndex = variantsOrder.findIndex((t) => t === "light");
            const darkIndex = variantsOrder.findIndex((t) => t === "dark");
            if (lightIndex === -1 || darkIndex === -1) throw new ShikiError('When using `defaultColor: "light-dark()"`, you must provide both `light` and `dark` themes');
            const lightValue = styles2[lightIndex][key2] || "inherit";
            const darkValue = styles2[darkIndex][key2] || "inherit";
            mergedStyles[key2] = `light-dark(${lightValue}, ${darkValue})`;
            if (colorsRendering === "css-vars") mergedStyles[varKey(idx, key2)] = value;
          } else mergedStyles[key2] = value;
        } else if (colorsRendering === "css-vars") mergedStyles[varKey(idx, key2)] = value;
      }
    });
    token2.htmlStyle = mergedStyles;
    return token2;
  }
  function getTokenStyleObject(token2) {
    const styles2 = {};
    if (token2.color) styles2.color = token2.color;
    if (token2.bgColor) styles2["background-color"] = token2.bgColor;
    if (token2.fontStyle) {
      if (token2.fontStyle & FontStyle.Italic) styles2["font-style"] = "italic";
      if (token2.fontStyle & FontStyle.Bold) styles2["font-weight"] = "bold";
      const decorations2 = [];
      if (token2.fontStyle & FontStyle.Underline) decorations2.push("underline");
      if (token2.fontStyle & FontStyle.Strikethrough) decorations2.push("line-through");
      if (decorations2.length) styles2["text-decoration"] = decorations2.join(" ");
    }
    return styles2;
  }
  function stringifyTokenStyle(token2) {
    if (typeof token2 === "string") return token2;
    return Object.entries(token2).map(([key2, value]) => `${key2}:${value}`).join(";");
  }
  function transformerDecorations() {
    const map = /* @__PURE__ */ new WeakMap();
    function getContext(shiki) {
      if (!map.has(shiki.meta)) {
        let normalizePosition = function(p2) {
          if (typeof p2 === "number") {
            if (p2 < 0 || p2 > shiki.source.length) throw new ShikiError(`Invalid decoration offset: ${p2}. Code length: ${shiki.source.length}`);
            return {
              ...converter.indexToPos(p2),
              offset: p2
            };
          } else {
            const line = converter.lines[p2.line];
            if (line === void 0) throw new ShikiError(`Invalid decoration position ${JSON.stringify(p2)}. Lines length: ${converter.lines.length}`);
            let character = p2.character;
            if (character < 0) character = line.length + character;
            if (character < 0 || character > line.length) throw new ShikiError(`Invalid decoration position ${JSON.stringify(p2)}. Line ${p2.line} length: ${line.length}`);
            return {
              ...p2,
              character,
              offset: converter.posToIndex(p2.line, character)
            };
          }
        };
        const converter = createPositionConverter(shiki.source);
        const decorations2 = (shiki.options.decorations || []).map((d3) => ({
          ...d3,
          start: normalizePosition(d3.start),
          end: normalizePosition(d3.end)
        }));
        verifyIntersections(decorations2);
        map.set(shiki.meta, {
          decorations: decorations2,
          converter,
          source: shiki.source
        });
      }
      return map.get(shiki.meta);
    }
    return {
      name: "shiki:decorations",
      tokens(tokens) {
        if (!this.options.decorations?.length) return;
        return splitTokens(tokens, getContext(this).decorations.flatMap((d3) => [d3.start.offset, d3.end.offset]));
      },
      code(codeEl) {
        if (!this.options.decorations?.length) return;
        const ctx = getContext(this);
        const lines = [...codeEl.children].filter((i2) => i2.type === "element" && i2.tagName === "span");
        if (lines.length !== ctx.converter.lines.length) throw new ShikiError(`Number of lines in code element (${lines.length}) does not match the number of lines in the source (${ctx.converter.lines.length}). Failed to apply decorations.`);
        function applyLineSection(line, start, end, decoration) {
          const lineEl = lines[line];
          let text3 = "";
          let startIndex = -1;
          let endIndex = -1;
          if (start === 0) startIndex = 0;
          if (end === 0) endIndex = 0;
          if (end === Number.POSITIVE_INFINITY) endIndex = lineEl.children.length;
          if (startIndex === -1 || endIndex === -1) for (let i2 = 0; i2 < lineEl.children.length; i2++) {
            text3 += stringify3(lineEl.children[i2]);
            if (startIndex === -1 && text3.length === start) startIndex = i2 + 1;
            if (endIndex === -1 && text3.length === end) endIndex = i2 + 1;
          }
          if (startIndex === -1) throw new ShikiError(`Failed to find start index for decoration ${JSON.stringify(decoration.start)}`);
          if (endIndex === -1) throw new ShikiError(`Failed to find end index for decoration ${JSON.stringify(decoration.end)}`);
          const children = lineEl.children.slice(startIndex, endIndex);
          if (!decoration.alwaysWrap && children.length === lineEl.children.length) applyDecoration(lineEl, decoration, "line");
          else if (!decoration.alwaysWrap && children.length === 1 && children[0].type === "element") applyDecoration(children[0], decoration, "token");
          else {
            const wrapper = {
              type: "element",
              tagName: "span",
              properties: {},
              children
            };
            applyDecoration(wrapper, decoration, "wrapper");
            lineEl.children.splice(startIndex, children.length, wrapper);
          }
        }
        function applyLine(line, decoration) {
          lines[line] = applyDecoration(lines[line], decoration, "line");
        }
        function applyDecoration(el, decoration, type) {
          const properties = decoration.properties || {};
          const transform2 = decoration.transform || ((i2) => i2);
          el.tagName = decoration.tagName || "span";
          el.properties = {
            ...el.properties,
            ...properties,
            class: el.properties.class
          };
          if (decoration.properties?.class) addClassToHast(el, decoration.properties.class);
          el = transform2(el, type) || el;
          return el;
        }
        const lineApplies = [];
        const sorted = ctx.decorations.sort((a2, b4) => b4.start.offset - a2.start.offset || a2.end.offset - b4.end.offset);
        for (const decoration of sorted) {
          const { start, end } = decoration;
          if (start.line === end.line) applyLineSection(start.line, start.character, end.character, decoration);
          else if (start.line < end.line) {
            applyLineSection(start.line, start.character, Number.POSITIVE_INFINITY, decoration);
            for (let i2 = start.line + 1; i2 < end.line; i2++) lineApplies.unshift(() => applyLine(i2, decoration));
            applyLineSection(end.line, 0, end.character, decoration);
          }
        }
        lineApplies.forEach((i2) => i2());
      }
    };
  }
  function verifyIntersections(items) {
    for (let i2 = 0; i2 < items.length; i2++) {
      const foo = items[i2];
      if (foo.start.offset > foo.end.offset) throw new ShikiError(`Invalid decoration range: ${JSON.stringify(foo.start)} - ${JSON.stringify(foo.end)}`);
      for (let j3 = i2 + 1; j3 < items.length; j3++) {
        const bar = items[j3];
        const isFooHasBarStart = foo.start.offset <= bar.start.offset && bar.start.offset < foo.end.offset;
        const isFooHasBarEnd = foo.start.offset < bar.end.offset && bar.end.offset <= foo.end.offset;
        const isBarHasFooStart = bar.start.offset <= foo.start.offset && foo.start.offset < bar.end.offset;
        const isBarHasFooEnd = bar.start.offset < foo.end.offset && foo.end.offset <= bar.end.offset;
        if (isFooHasBarStart || isFooHasBarEnd || isBarHasFooStart || isBarHasFooEnd) {
          if (isFooHasBarStart && isFooHasBarEnd) continue;
          if (isBarHasFooStart && isBarHasFooEnd) continue;
          if (isBarHasFooStart && foo.start.offset === foo.end.offset) continue;
          if (isFooHasBarEnd && bar.start.offset === bar.end.offset) continue;
          throw new ShikiError(`Decorations ${JSON.stringify(foo.start)} and ${JSON.stringify(bar.start)} intersect.`);
        }
      }
    }
  }
  function stringify3(el) {
    if (el.type === "text") return el.value;
    if (el.type === "element") return el.children.map(stringify3).join("");
    return "";
  }
  var builtInTransformers = [/* @__PURE__ */ transformerDecorations()];
  function getTransformers(options) {
    const transformers = sortTransformersByEnforcement(options.transformers || []);
    return [
      ...transformers.pre,
      ...transformers.normal,
      ...transformers.post,
      ...builtInTransformers
    ];
  }
  function sortTransformersByEnforcement(transformers) {
    const pre = [];
    const post = [];
    const normal = [];
    for (const transformer of transformers) switch (transformer.enforce) {
      case "pre":
        pre.push(transformer);
        break;
      case "post":
        post.push(transformer);
        break;
      default:
        normal.push(transformer);
    }
    return {
      pre,
      post,
      normal
    };
  }
  var namedColors = [
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
    "brightBlack",
    "brightRed",
    "brightGreen",
    "brightYellow",
    "brightBlue",
    "brightMagenta",
    "brightCyan",
    "brightWhite"
  ];
  var decorations = {
    1: "bold",
    2: "dim",
    3: "italic",
    4: "underline",
    7: "reverse",
    8: "hidden",
    9: "strikethrough"
  };
  function findSequence(value, position) {
    const nextEscape = value.indexOf("\x1B", position);
    if (nextEscape !== -1) {
      if (value[nextEscape + 1] === "[") {
        const nextClose = value.indexOf("m", nextEscape);
        if (nextClose !== -1) return {
          sequence: value.substring(nextEscape + 2, nextClose).split(";"),
          startPosition: nextEscape,
          position: nextClose + 1
        };
      }
    }
    return { position: value.length };
  }
  function parseColor(sequence) {
    const colorMode = sequence.shift();
    if (colorMode === "2") {
      const rgb = sequence.splice(0, 3).map((x4) => Number.parseInt(x4));
      if (rgb.length !== 3 || rgb.some((x4) => Number.isNaN(x4))) return;
      return {
        type: "rgb",
        rgb
      };
    } else if (colorMode === "5") {
      const index = sequence.shift();
      if (index) return {
        type: "table",
        index: Number(index)
      };
    }
  }
  function parseSequence(sequence) {
    const commands = [];
    while (sequence.length > 0) {
      const code = sequence.shift();
      if (!code) continue;
      const codeInt = Number.parseInt(code);
      if (Number.isNaN(codeInt)) continue;
      if (codeInt === 0) commands.push({ type: "resetAll" });
      else if (codeInt <= 9) {
        if (decorations[codeInt]) commands.push({
          type: "setDecoration",
          value: decorations[codeInt]
        });
      } else if (codeInt <= 29) {
        const decoration = decorations[codeInt - 20];
        if (decoration) {
          commands.push({
            type: "resetDecoration",
            value: decoration
          });
          if (decoration === "dim") commands.push({
            type: "resetDecoration",
            value: "bold"
          });
        }
      } else if (codeInt <= 37) commands.push({
        type: "setForegroundColor",
        value: {
          type: "named",
          name: namedColors[codeInt - 30]
        }
      });
      else if (codeInt === 38) {
        const color = parseColor(sequence);
        if (color) commands.push({
          type: "setForegroundColor",
          value: color
        });
      } else if (codeInt === 39) commands.push({ type: "resetForegroundColor" });
      else if (codeInt <= 47) commands.push({
        type: "setBackgroundColor",
        value: {
          type: "named",
          name: namedColors[codeInt - 40]
        }
      });
      else if (codeInt === 48) {
        const color = parseColor(sequence);
        if (color) commands.push({
          type: "setBackgroundColor",
          value: color
        });
      } else if (codeInt === 49) commands.push({ type: "resetBackgroundColor" });
      else if (codeInt === 53) commands.push({
        type: "setDecoration",
        value: "overline"
      });
      else if (codeInt === 55) commands.push({
        type: "resetDecoration",
        value: "overline"
      });
      else if (codeInt >= 90 && codeInt <= 97) commands.push({
        type: "setForegroundColor",
        value: {
          type: "named",
          name: namedColors[codeInt - 90 + 8]
        }
      });
      else if (codeInt >= 100 && codeInt <= 107) commands.push({
        type: "setBackgroundColor",
        value: {
          type: "named",
          name: namedColors[codeInt - 100 + 8]
        }
      });
    }
    return commands;
  }
  function createAnsiSequenceParser() {
    let foreground = null;
    let background = null;
    let decorations2 = /* @__PURE__ */ new Set();
    return { parse(value) {
      const tokens = [];
      let position = 0;
      do {
        const findResult = findSequence(value, position);
        const text3 = findResult.sequence ? value.substring(position, findResult.startPosition) : value.substring(position);
        if (text3.length > 0) tokens.push({
          value: text3,
          foreground,
          background,
          decorations: new Set(decorations2)
        });
        if (findResult.sequence) {
          const commands = parseSequence(findResult.sequence);
          for (const styleToken of commands) if (styleToken.type === "resetAll") {
            foreground = null;
            background = null;
            decorations2.clear();
          } else if (styleToken.type === "resetForegroundColor") foreground = null;
          else if (styleToken.type === "resetBackgroundColor") background = null;
          else if (styleToken.type === "resetDecoration") decorations2.delete(styleToken.value);
          for (const styleToken of commands) if (styleToken.type === "setForegroundColor") foreground = styleToken.value;
          else if (styleToken.type === "setBackgroundColor") background = styleToken.value;
          else if (styleToken.type === "setDecoration") decorations2.add(styleToken.value);
        }
        position = findResult.position;
      } while (position < value.length);
      return tokens;
    } };
  }
  var defaultNamedColorsMap = {
    black: "#000000",
    red: "#bb0000",
    green: "#00bb00",
    yellow: "#bbbb00",
    blue: "#0000bb",
    magenta: "#ff00ff",
    cyan: "#00bbbb",
    white: "#eeeeee",
    brightBlack: "#555555",
    brightRed: "#ff5555",
    brightGreen: "#00ff00",
    brightYellow: "#ffff55",
    brightBlue: "#5555ff",
    brightMagenta: "#ff55ff",
    brightCyan: "#55ffff",
    brightWhite: "#ffffff"
  };
  function createColorPalette(namedColorsMap = defaultNamedColorsMap) {
    function namedColor(name) {
      return namedColorsMap[name];
    }
    function rgbColor(rgb) {
      return `#${rgb.map((x4) => Math.max(0, Math.min(x4, 255)).toString(16).padStart(2, "0")).join("")}`;
    }
    let colorTable;
    function getColorTable() {
      if (colorTable) return colorTable;
      colorTable = [];
      for (let i2 = 0; i2 < namedColors.length; i2++) colorTable.push(namedColor(namedColors[i2]));
      let levels = [
        0,
        95,
        135,
        175,
        215,
        255
      ];
      for (let r4 = 0; r4 < 6; r4++) for (let g = 0; g < 6; g++) for (let b4 = 0; b4 < 6; b4++) colorTable.push(rgbColor([
        levels[r4],
        levels[g],
        levels[b4]
      ]));
      let level = 8;
      for (let i2 = 0; i2 < 24; i2++, level += 10) colorTable.push(rgbColor([
        level,
        level,
        level
      ]));
      return colorTable;
    }
    function tableColor(index) {
      return getColorTable()[index];
    }
    function value(color) {
      switch (color.type) {
        case "named":
          return namedColor(color.name);
        case "rgb":
          return rgbColor(color.rgb);
        case "table":
          return tableColor(color.index);
      }
    }
    return { value };
  }
  var RE_HEX_COLOR = /#([0-9a-f]{3,8})/i;
  var RE_CSS_VAR_ANSI = /var\((--[\w-]+-ansi-[\w-]+)\)/;
  var defaultAnsiColors = {
    black: "#000000",
    red: "#cd3131",
    green: "#0DBC79",
    yellow: "#E5E510",
    blue: "#2472C8",
    magenta: "#BC3FBC",
    cyan: "#11A8CD",
    white: "#E5E5E5",
    brightBlack: "#666666",
    brightRed: "#F14C4C",
    brightGreen: "#23D18B",
    brightYellow: "#F5F543",
    brightBlue: "#3B8EEA",
    brightMagenta: "#D670D6",
    brightCyan: "#29B8DB",
    brightWhite: "#FFFFFF"
  };
  function tokenizeAnsiWithTheme(theme, fileContents, options) {
    const colorReplacements = resolveColorReplacements(theme, options);
    const lines = splitLines(fileContents);
    const colorPalette = createColorPalette(Object.fromEntries(namedColors.map((name) => {
      const key2 = `terminal.ansi${name[0].toUpperCase()}${name.substring(1)}`;
      return [name, theme.colors?.[key2] || defaultAnsiColors[name]];
    })));
    const parser = createAnsiSequenceParser();
    return lines.map((line) => parser.parse(line[0]).map((token2) => {
      let color;
      let bgColor;
      if (token2.decorations.has("reverse")) {
        color = token2.background ? colorPalette.value(token2.background) : theme.bg;
        bgColor = token2.foreground ? colorPalette.value(token2.foreground) : theme.fg;
      } else {
        color = token2.foreground ? colorPalette.value(token2.foreground) : theme.fg;
        bgColor = token2.background ? colorPalette.value(token2.background) : void 0;
      }
      color = applyColorReplacements(color, colorReplacements);
      bgColor = applyColorReplacements(bgColor, colorReplacements);
      if (token2.decorations.has("dim")) color = dimColor(color);
      let fontStyle = FontStyle.None;
      if (token2.decorations.has("bold")) fontStyle |= FontStyle.Bold;
      if (token2.decorations.has("italic")) fontStyle |= FontStyle.Italic;
      if (token2.decorations.has("underline")) fontStyle |= FontStyle.Underline;
      if (token2.decorations.has("strikethrough")) fontStyle |= FontStyle.Strikethrough;
      return {
        content: token2.value,
        offset: line[1],
        color,
        bgColor,
        fontStyle
      };
    }));
  }
  function dimColor(color) {
    const hexMatch = color.match(RE_HEX_COLOR);
    if (hexMatch) {
      const hex = hexMatch[1];
      if (hex.length === 8) {
        const alpha = Math.round(Number.parseInt(hex.slice(6, 8), 16) / 2).toString(16).padStart(2, "0");
        return `#${hex.slice(0, 6)}${alpha}`;
      } else if (hex.length === 6) return `#${hex}80`;
      else if (hex.length === 4) {
        const r4 = hex[0];
        const g = hex[1];
        const b4 = hex[2];
        const a2 = hex[3];
        return `#${r4}${r4}${g}${g}${b4}${b4}${Math.round(Number.parseInt(`${a2}${a2}`, 16) / 2).toString(16).padStart(2, "0")}`;
      } else if (hex.length === 3) {
        const r4 = hex[0];
        const g = hex[1];
        const b4 = hex[2];
        return `#${r4}${r4}${g}${g}${b4}${b4}80`;
      }
    }
    const cssVarMatch = color.match(RE_CSS_VAR_ANSI);
    if (cssVarMatch) return `var(${cssVarMatch[1]}-dim)`;
    return color;
  }
  function codeToTokensBase2(primitive, code, options = {}) {
    const lang = primitive.resolveLangAlias(options.lang || "text");
    const { theme: themeName = primitive.getLoadedThemes()[0] } = options;
    if (!isPlainLang(lang) && !isNoneTheme(themeName) && lang === "ansi") {
      const { theme } = primitive.setTheme(themeName);
      return tokenizeAnsiWithTheme(theme, code, options);
    }
    return codeToTokensBase(primitive, code, options);
  }
  function codeToTokens(primitive, code, options) {
    let bg;
    let fg;
    let tokens;
    let themeName;
    let rootStyle;
    let grammarState;
    if ("themes" in options) {
      const { defaultColor = "light", cssVariablePrefix = "--shiki-", colorsRendering = "css-vars" } = options;
      const themes = Object.entries(options.themes).filter((i2) => i2[1]).map((i2) => ({
        color: i2[0],
        theme: i2[1]
      })).sort((a2, b4) => a2.color === defaultColor ? -1 : b4.color === defaultColor ? 1 : 0);
      if (themes.length === 0) throw new ShikiError("`themes` option must not be empty");
      const themeTokens = codeToTokensWithThemes(primitive, code, options, codeToTokensBase2);
      grammarState = getLastGrammarStateFromMap(themeTokens);
      if (defaultColor && "light-dark()" !== defaultColor && !themes.some((t) => t.color === defaultColor)) throw new ShikiError(`\`themes\` option must contain the defaultColor key \`${defaultColor}\``);
      const themeRegs = themes.map((t) => primitive.getTheme(t.theme));
      const themesOrder = themes.map((t) => t.color);
      tokens = themeTokens.map((line) => line.map((token2) => flatTokenVariants(token2, themesOrder, cssVariablePrefix, defaultColor, colorsRendering)));
      if (grammarState) setLastGrammarStateToMap(tokens, grammarState);
      const themeColorReplacements = themes.map((t) => resolveColorReplacements(t.theme, options));
      fg = mapThemeColors(themes, themeRegs, themeColorReplacements, cssVariablePrefix, defaultColor, "fg", colorsRendering);
      bg = mapThemeColors(themes, themeRegs, themeColorReplacements, cssVariablePrefix, defaultColor, "bg", colorsRendering);
      themeName = `shiki-themes ${themeRegs.map((t) => t.name).join(" ")}`;
      rootStyle = defaultColor ? void 0 : [fg, bg].join(";");
    } else if ("theme" in options) {
      const colorReplacements = resolveColorReplacements(options.theme, options);
      tokens = codeToTokensBase2(primitive, code, options);
      const _theme = primitive.getTheme(options.theme);
      bg = applyColorReplacements(_theme.bg, colorReplacements);
      fg = applyColorReplacements(_theme.fg, colorReplacements);
      themeName = _theme.name;
      grammarState = getLastGrammarStateFromMap(tokens);
    } else throw new ShikiError("Invalid options, either `theme` or `themes` must be provided");
    return {
      tokens,
      fg,
      bg,
      themeName,
      rootStyle,
      grammarState
    };
  }
  function mapThemeColors(themes, themeRegs, themeColorReplacements, cssVariablePrefix, defaultColor, property, colorsRendering) {
    return themes.map((t, idx) => {
      const value = applyColorReplacements(themeRegs[idx][property], themeColorReplacements[idx]) || "inherit";
      const cssVar = `${cssVariablePrefix + t.color}${property === "bg" ? "-bg" : ""}:${value}`;
      if (idx === 0 && defaultColor) {
        if (defaultColor === "light-dark()" && themes.length > 1) {
          const lightIndex = themes.findIndex((t2) => t2.color === "light");
          const darkIndex = themes.findIndex((t2) => t2.color === "dark");
          if (lightIndex === -1 || darkIndex === -1) throw new ShikiError('When using `defaultColor: "light-dark()"`, you must provide both `light` and `dark` themes');
          return `light-dark(${applyColorReplacements(themeRegs[lightIndex][property], themeColorReplacements[lightIndex]) || "inherit"}, ${applyColorReplacements(themeRegs[darkIndex][property], themeColorReplacements[darkIndex]) || "inherit"});${cssVar}`;
        }
        return value;
      }
      if (colorsRendering === "css-vars") return cssVar;
      return null;
    }).filter((i2) => !!i2).join(";");
  }
  var RE_WHITESPACE_ONLY = /^\s+$/;
  var RE_LEADING_TRAILING_WHITESPACE = /^(\s*)(.*?)(\s*)$/;
  function codeToHast(primitive, code, options, transformerContext = {
    meta: {},
    options,
    codeToHast: (_code, _options) => codeToHast(primitive, _code, _options),
    codeToTokens: (_code, _options) => codeToTokens(primitive, _code, _options)
  }) {
    let input = code;
    for (const transformer of getTransformers(options)) input = transformer.preprocess?.call(transformerContext, input, options) || input;
    let { tokens, fg, bg, themeName, rootStyle, grammarState } = codeToTokens(primitive, input, options);
    const { mergeWhitespaces = true, mergeSameStyleTokens = false } = options;
    if (mergeWhitespaces === true) tokens = mergeWhitespaceTokens(tokens);
    else if (mergeWhitespaces === "never") tokens = splitWhitespaceTokens(tokens);
    if (mergeSameStyleTokens) tokens = mergeAdjacentStyledTokens(tokens);
    const contextSource = {
      ...transformerContext,
      get source() {
        return input;
      }
    };
    for (const transformer of getTransformers(options)) tokens = transformer.tokens?.call(contextSource, tokens) || tokens;
    return tokensToHast(tokens, {
      ...options,
      fg,
      bg,
      themeName,
      rootStyle: options.rootStyle === false ? false : options.rootStyle ?? rootStyle
    }, contextSource, grammarState);
  }
  function tokensToHast(tokens, options, transformerContext, grammarState = getLastGrammarStateFromMap(tokens)) {
    const transformers = getTransformers(options);
    const lines = [];
    const root2 = {
      type: "root",
      children: []
    };
    const { structure = "classic", tabindex = "0" } = options;
    const properties = { class: `shiki ${options.themeName || ""}` };
    if (options.rootStyle !== false) {
      if (options.rootStyle != null) properties.style = options.rootStyle;
      else properties.style = `background-color:${options.bg};color:${options.fg}`;
    }
    if (tabindex !== false && tabindex != null) properties.tabindex = tabindex.toString();
    for (const [key2, value] of Object.entries(options.meta || {})) if (!key2.startsWith("_")) properties[key2] = value;
    let preNode = {
      type: "element",
      tagName: "pre",
      properties,
      children: [],
      data: options.data
    };
    let codeNode = {
      type: "element",
      tagName: "code",
      properties: {},
      children: lines
    };
    const lineNodes = [];
    const context = {
      ...transformerContext,
      structure,
      addClassToHast,
      get source() {
        return transformerContext.source;
      },
      get tokens() {
        return tokens;
      },
      get options() {
        return options;
      },
      get root() {
        return root2;
      },
      get pre() {
        return preNode;
      },
      get code() {
        return codeNode;
      },
      get lines() {
        return lineNodes;
      }
    };
    tokens.forEach((line, idx) => {
      if (idx) {
        if (structure === "inline") root2.children.push({
          type: "element",
          tagName: "br",
          properties: {},
          children: []
        });
        else if (structure === "classic") lines.push({
          type: "text",
          value: "\n"
        });
      }
      let lineNode = {
        type: "element",
        tagName: "span",
        properties: { class: "line" },
        children: []
      };
      let col = 0;
      for (const token2 of line) {
        let tokenNode = {
          type: "element",
          tagName: "span",
          properties: { ...token2.htmlAttrs },
          children: [{
            type: "text",
            value: token2.content
          }]
        };
        const style = stringifyTokenStyle(token2.htmlStyle || getTokenStyleObject(token2));
        if (style) tokenNode.properties.style = style;
        for (const transformer of transformers) tokenNode = transformer?.span?.call(context, tokenNode, idx + 1, col, lineNode, token2) || tokenNode;
        if (structure === "inline") root2.children.push(tokenNode);
        else if (structure === "classic") lineNode.children.push(tokenNode);
        col += token2.content.length;
      }
      if (structure === "classic") {
        for (const transformer of transformers) lineNode = transformer?.line?.call(context, lineNode, idx + 1) || lineNode;
        lineNodes.push(lineNode);
        lines.push(lineNode);
      } else if (structure === "inline") lineNodes.push(lineNode);
    });
    if (structure === "classic") {
      for (const transformer of transformers) codeNode = transformer?.code?.call(context, codeNode) || codeNode;
      preNode.children.push(codeNode);
      for (const transformer of transformers) preNode = transformer?.pre?.call(context, preNode) || preNode;
      root2.children.push(preNode);
    } else if (structure === "inline") {
      const syntheticLines = [];
      let currentLine = {
        type: "element",
        tagName: "span",
        properties: { class: "line" },
        children: []
      };
      for (const child of root2.children) if (child.type === "element" && child.tagName === "br") {
        syntheticLines.push(currentLine);
        currentLine = {
          type: "element",
          tagName: "span",
          properties: { class: "line" },
          children: []
        };
      } else if (child.type === "element" || child.type === "text") currentLine.children.push(child);
      syntheticLines.push(currentLine);
      let transformedCode = {
        type: "element",
        tagName: "code",
        properties: {},
        children: syntheticLines
      };
      for (const transformer of transformers) transformedCode = transformer?.code?.call(context, transformedCode) || transformedCode;
      root2.children = [];
      for (let i2 = 0; i2 < transformedCode.children.length; i2++) {
        if (i2 > 0) root2.children.push({
          type: "element",
          tagName: "br",
          properties: {},
          children: []
        });
        const line = transformedCode.children[i2];
        if (line.type === "element") root2.children.push(...line.children);
      }
    }
    let result = root2;
    for (const transformer of transformers) result = transformer?.root?.call(context, result) || result;
    if (grammarState) setLastGrammarStateToMap(result, grammarState);
    return result;
  }
  function mergeWhitespaceTokens(tokens) {
    return tokens.map((line) => {
      const newLine = [];
      let carryOnContent = "";
      let firstOffset;
      line.forEach((token2, idx) => {
        const couldMerge = !(token2.fontStyle && (token2.fontStyle & FontStyle.Underline || token2.fontStyle & FontStyle.Strikethrough));
        if (couldMerge && RE_WHITESPACE_ONLY.test(token2.content) && line[idx + 1]) {
          if (firstOffset === void 0) firstOffset = token2.offset;
          carryOnContent += token2.content;
        } else if (carryOnContent) {
          if (couldMerge) newLine.push({
            ...token2,
            offset: firstOffset,
            content: carryOnContent + token2.content
          });
          else newLine.push({
            content: carryOnContent,
            offset: firstOffset
          }, token2);
          firstOffset = void 0;
          carryOnContent = "";
        } else newLine.push(token2);
      });
      return newLine;
    });
  }
  function splitWhitespaceTokens(tokens) {
    return tokens.map((line) => {
      return line.flatMap((token2) => {
        if (RE_WHITESPACE_ONLY.test(token2.content)) return token2;
        const match = token2.content.match(RE_LEADING_TRAILING_WHITESPACE);
        if (!match) return token2;
        const [, leading, content, trailing] = match;
        if (!leading && !trailing) return token2;
        const expanded = [{
          ...token2,
          offset: token2.offset + leading.length,
          content
        }];
        if (leading) expanded.unshift({
          content: leading,
          offset: token2.offset
        });
        if (trailing) expanded.push({
          content: trailing,
          offset: token2.offset + leading.length + content.length
        });
        return expanded;
      });
    });
  }
  function mergeAdjacentStyledTokens(tokens) {
    return tokens.map((line) => {
      const newLine = [];
      for (const token2 of line) {
        if (newLine.length === 0) {
          newLine.push({ ...token2 });
          continue;
        }
        const prevToken = newLine.at(-1);
        const prevStyle = stringifyTokenStyle(prevToken.htmlStyle || getTokenStyleObject(prevToken));
        const currentStyle = stringifyTokenStyle(token2.htmlStyle || getTokenStyleObject(token2));
        const isPrevDecorated = prevToken.fontStyle && (prevToken.fontStyle & FontStyle.Underline || prevToken.fontStyle & FontStyle.Strikethrough);
        const isDecorated = token2.fontStyle && (token2.fontStyle & FontStyle.Underline || token2.fontStyle & FontStyle.Strikethrough);
        if (!isPrevDecorated && !isDecorated && prevStyle === currentStyle) prevToken.content += token2.content;
        else newLine.push({ ...token2 });
      }
      return newLine;
    });
  }
  var hastToHtml = toHtml;
  function codeToHtml(primitive, code, options) {
    const context = {
      meta: {},
      options,
      codeToHast: (_code, _options) => codeToHast(primitive, _code, _options),
      codeToTokens: (_code, _options) => codeToTokens(primitive, _code, _options)
    };
    let result = hastToHtml(codeToHast(primitive, code, options, context));
    for (const transformer of getTransformers(options)) result = transformer.postprocess?.call(context, result, options) || result;
    return result;
  }
  async function createHighlighterCore(options) {
    const primitive = await createShikiPrimitiveAsync(options);
    return {
      getLastGrammarState: (...args) => getLastGrammarState(primitive, ...args),
      codeToTokensBase: (code, options2) => codeToTokensBase2(primitive, code, options2),
      codeToTokensWithThemes: (code, options2) => codeToTokensWithThemes(primitive, code, options2),
      codeToTokens: (code, options2) => codeToTokens(primitive, code, options2),
      codeToHast: (code, options2) => codeToHast(primitive, code, options2),
      codeToHtml: (code, options2) => codeToHtml(primitive, code, options2),
      getBundledLanguages: () => ({}),
      getBundledThemes: () => ({}),
      ...primitive,
      getInternalContext: () => primitive
    };
  }

  // node_modules/@shikijs/engine-javascript/dist/string-TLTPtCPs.mjs
  var MAX = 4294967295;
  function isSearchCacheable(regexp) {
    return !regexp.sticky && !regexp.rawOptions?.strategy;
  }
  function toResult(index, indices) {
    return {
      index,
      captureIndices: indices.map((indice) => {
        if (indice == null) return {
          start: MAX,
          end: MAX,
          length: 0
        };
        return {
          start: indice[0],
          end: indice[1],
          length: indice[1] - indice[0]
        };
      })
    };
  }
  var JavaScriptScanner = class {
    patterns;
    options;
    regexps;
    /**
    * Last search of each regexp on the current string, reused the way `vscode-oniguruma` does.
    * `null` for regexps whose searches can't be reused.
    */
    lastSearches;
    constructor(patterns, options = {}) {
      this.patterns = patterns;
      this.options = options;
      const { forgiving = false, cache, regexConstructor } = options;
      if (!regexConstructor) throw new Error("Option `regexConstructor` is not provided");
      this.regexps = patterns.map((p2) => {
        if (typeof p2 !== "string") return p2;
        const cached = cache?.get(p2);
        if (cached) {
          if (cached instanceof RegExp) return cached;
          if (forgiving) return null;
          throw cached;
        }
        try {
          const regex = regexConstructor(p2);
          cache?.set(p2, regex);
          return regex;
        } catch (e) {
          cache?.set(p2, e);
          if (forgiving) return null;
          throw e;
        }
      });
      this.lastSearches = this.regexps.map((regexp) => regexp && isSearchCacheable(regexp) ? {
        strId: 0,
        searchedFrom: 0,
        matchIndex: -1,
        indices: null
      } : null);
    }
    findNextMatchSync(string, startPosition, _options) {
      const str = typeof string === "string" ? string : string.content;
      const strId = typeof string === "string" ? 0 : string.id || 0;
      let bestIndex = -1;
      let bestMatchIndex = 0;
      let bestIndices = null;
      for (let i2 = 0; i2 < this.regexps.length; i2++) {
        const regexp = this.regexps[i2];
        if (!regexp) continue;
        try {
          const last = strId ? this.lastSearches[i2] : null;
          let matchIndex;
          let indices;
          if (last && last.strId === strId && last.searchedFrom <= startPosition && (last.matchIndex === -1 || last.matchIndex >= startPosition)) {
            matchIndex = last.matchIndex;
            indices = last.indices;
          } else {
            regexp.lastIndex = startPosition;
            const match = regexp.exec(str);
            matchIndex = match ? match.index : -1;
            indices = match ? match.indices : null;
            if (last) {
              last.strId = strId;
              last.searchedFrom = startPosition;
              last.matchIndex = matchIndex;
              last.indices = indices;
            }
          }
          if (matchIndex === -1) continue;
          if (matchIndex === startPosition) return toResult(i2, indices);
          if (bestIndex === -1 || matchIndex < bestMatchIndex) {
            bestIndex = i2;
            bestMatchIndex = matchIndex;
            bestIndices = indices;
          }
        } catch (e) {
          if (this.options.forgiving) continue;
          throw e;
        }
      }
      return bestIndex === -1 ? null : toResult(bestIndex, bestIndices);
    }
  };
  var lastStringId = 0;
  function createJavaScriptEngineString(content) {
    return {
      content,
      id: ++lastStringId
    };
  }

  // node_modules/oniguruma-parser/dist/utils.js
  function r(e) {
    if ([...e].length !== 1) throw new Error(`Expected "${e}" to be a single code point`);
    return e.codePointAt(0);
  }
  function l(e, t, n) {
    return e.has(t) || e.set(t, n), e.get(t);
  }
  var i = /* @__PURE__ */ new Set(["alnum", "alpha", "ascii", "blank", "cntrl", "digit", "graph", "lower", "print", "punct", "space", "upper", "word", "xdigit"]);
  var o = String.raw;
  function u3(e, t) {
    if (e == null) throw new Error(t ?? "Value expected");
    return e;
  }

  // node_modules/oniguruma-parser/dist/tokenizer/tokenize.js
  var m2 = o`\[\^?`;
  var b2 = `c.? | C(?:-.?)?|${o`[pP]\{(?:\^?[-\x20_]*[A-Za-z][-\x20\w]*\})?`}|${o`x[89A-Fa-f]\p{AHex}(?:\\x[89A-Fa-f]\p{AHex})*`}|${o`u(?:\p{AHex}{4})? | x\{[^\}]*\}? | x\p{AHex}{0,2}`}|${o`o\{[^\}]*\}?`}|${o`\d{1,3}`}`;
  var y2 = /[?*+][?+]?|\{(?:\d+(?:,\d*)?|,\d+)\}\??/;
  var C2 = new RegExp(o`
  \\ (?:
    ${b2}
    | [gk]<[^>]*>?
    | [gk]'[^']*'?
    | .
  )
  | \( (?:
    \? (?:
      [:=!>({]
      | <[=!]
      | <[^>]*>
      | '[^']*'
      | ~\|?
      | #(?:[^)\\]|\\.?)*
      | [^:)]*[:)]
    )?
    | \*[^\)]*\)?
  )?
  | (?:${y2.source})+
  | ${m2}
  | .
`.replace(/\s+/g, ""), "gsu");
  var T3 = new RegExp(o`
  \\ (?:
    ${b2}
    | .
  )
  | \[:(?:\^?\p{Alpha}+|\^):\]
  | ${m2}
  | &&
  | .
`.replace(/\s+/g, ""), "gsu");
  function M2(e, n = {}) {
    const t = { flags: "", ...n, rules: { captureGroup: false, singleline: false, ...n.rules } };
    if (typeof e != "string") throw new Error("String expected as pattern");
    const o3 = Y(t.flags), s2 = [o3.extended], a2 = { captureGroup: t.rules.captureGroup, getCurrentModX() {
      return s2.at(-1);
    }, numOpenGroups: 0, popModX() {
      s2.pop();
    }, pushModX(u4) {
      s2.push(u4);
    }, replaceCurrentModX(u4) {
      s2[s2.length - 1] = u4;
    }, singleline: t.rules.singleline };
    let r4 = [], i2;
    for (C2.lastIndex = 0; i2 = C2.exec(e); ) {
      const u4 = F2(a2, e, i2[0], C2.lastIndex);
      u4.tokens ? r4.push(...u4.tokens) : u4.token && r4.push(u4.token), u4.lastIndex !== void 0 && (C2.lastIndex = u4.lastIndex);
    }
    const l3 = [];
    let c = 0;
    r4.filter((u4) => u4.type === "GroupOpen").forEach((u4) => {
      u4.kind === "capturing" ? u4.number = ++c : u4.raw === "(" && l3.push(u4);
    }), c || l3.forEach((u4, S4) => {
      u4.kind = "capturing", u4.number = S4 + 1;
    });
    const g = c || l3.length;
    return { tokens: r4.map((u4) => u4.type === "EscapedNumber" ? ee(u4, g) : u4).flat(), flags: o3 };
  }
  function F2(e, n, t, o3) {
    const [s2, a2] = t;
    if (t === "[" || t === "[^") {
      const r4 = K2(n, t, o3);
      return { tokens: r4.tokens, lastIndex: r4.lastIndex };
    }
    if (s2 === "\\") {
      if ("AbBGyYzZ".includes(a2)) return { token: w2(t, t) };
      if (/^\\g[<']/.test(t)) {
        if (!/^\\g(?:<[^>]+>|'[^']+')$/.test(t)) throw new Error(`Invalid group name "${t}"`);
        return { token: R(t) };
      }
      if (/^\\k[<']/.test(t)) {
        if (!/^\\k(?:<[^>]+>|'[^']+')$/.test(t)) throw new Error(`Invalid group name "${t}"`);
        return { token: A(t) };
      }
      if (a2 === "K") return { token: I2("keep", t) };
      if (a2 === "N" || a2 === "R") return { token: k2("newline", t, { negate: a2 === "N" }) };
      if (a2 === "O") return { token: k2("any", t) };
      if (a2 === "X") return { token: k2("text_segment", t) };
      const r4 = x2(t, { inCharClass: false });
      return Array.isArray(r4) ? { tokens: r4 } : { token: r4 };
    }
    if (s2 === "(") {
      if (a2 === "*") return { token: j2(t) };
      if (t === "(?{") throw new Error(`Unsupported callout "${t}"`);
      if (t.startsWith("(?#")) {
        if (n[o3] !== ")") throw new Error('Unclosed comment group "(?#"');
        return { lastIndex: o3 + 1 };
      }
      if (/^\(\?[-imx]+[:)]$/.test(t)) return { token: L2(t, e) };
      if (e.pushModX(e.getCurrentModX()), e.numOpenGroups++, t === "(" && !e.captureGroup || t === "(?:") return { token: f("group", t) };
      if (t === "(?>") return { token: f("atomic", t) };
      if (t === "(?=" || t === "(?!" || t === "(?<=" || t === "(?<!") return { token: f(t[2] === "<" ? "lookbehind" : "lookahead", t, { negate: t.endsWith("!") }) };
      if (t === "(" && e.captureGroup || t.startsWith("(?<") && t.endsWith(">") || t.startsWith("(?'") && t.endsWith("'")) return { token: f("capturing", t, { ...t !== "(" && { name: t.slice(3, -1) } }) };
      if (t.startsWith("(?~")) {
        if (t === "(?~|") throw new Error(`Unsupported absence function kind "${t}"`);
        return { token: f("absence_repeater", t) };
      }
      throw t === "(?(" ? new Error(`Unsupported conditional "${t}"`) : new Error(`Invalid or unsupported group option "${t}"`);
    }
    if (t === ")") {
      if (e.popModX(), e.numOpenGroups--, e.numOpenGroups < 0) throw new Error('Unmatched ")"');
      return { token: Q2(t) };
    }
    if (e.getCurrentModX()) {
      if (t === "#") {
        const r4 = n.indexOf(`
`, o3);
        return { lastIndex: r4 === -1 ? n.length : r4 };
      }
      if (/^\s$/.test(t)) {
        const r4 = /\s+/y;
        return r4.lastIndex = o3, { lastIndex: r4.exec(n) ? r4.lastIndex : o3 };
      }
    }
    if (t === ".") return { token: k2("dot", t) };
    if (t === "^" || t === "$") {
      const r4 = e.singleline ? { "^": o`\A`, $: o`\Z` }[t] : t;
      return { token: w2(r4, t) };
    }
    return t === "|" ? { token: P2(t) } : y2.test(t) ? { tokens: te2(t) } : { token: d2(r(t), t) };
  }
  function K2(e, n, t) {
    const o3 = [E2(n[1] === "^", n)];
    let s2 = 1, a2;
    for (T3.lastIndex = t; a2 = T3.exec(e); ) {
      const r4 = a2[0];
      if (r4[0] === "[" && r4[1] !== ":") s2++, o3.push(E2(r4[1] === "^", r4));
      else if (r4 === "]") {
        if (o3.at(-1).type === "CharacterClassOpen") o3.push(d2(93, r4));
        else if (s2--, o3.push(z2(r4)), !s2) break;
      } else {
        const i2 = X2(r4);
        Array.isArray(i2) ? o3.push(...i2) : o3.push(i2);
      }
    }
    return { tokens: o3, lastIndex: T3.lastIndex || e.length };
  }
  function X2(e) {
    if (e[0] === "\\") return x2(e, { inCharClass: true });
    if (e[0] === "[") {
      const n = /\[:(?<negate>\^?)(?<name>[a-z]+):\]/.exec(e);
      if (!n || !i.has(n.groups.name)) throw new Error(`Invalid POSIX class "${e}"`);
      return k2("posix", e, { value: n.groups.name, negate: !!n.groups.negate });
    }
    return e === "-" ? U2(e) : e === "&&" ? H(e) : d2(r(e), e);
  }
  function x2(e, { inCharClass: n }) {
    const t = e[1];
    if (t === "c" || t === "C") return Z2(e);
    if ("dDhHsSwW".includes(t)) return q2(e);
    if (e.startsWith(o`\o{`)) throw new Error(`Incomplete, invalid, or unsupported octal code point "${e}"`);
    if (/^\\[pP]\{/.test(e)) {
      if (e.length === 3) throw new Error(`Incomplete or invalid Unicode property "${e}"`);
      return V(e);
    }
    if (/^\\x[89A-Fa-f]\p{AHex}/u.test(e)) try {
      const o3 = e.split(/\\x/).slice(1).map((i2) => parseInt(i2, 16)), s2 = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }).decode(new Uint8Array(o3)), a2 = new TextEncoder();
      return [...s2].map((i2) => {
        const l3 = [...a2.encode(i2)].map((c) => `\\x${c.toString(16)}`).join("");
        return d2(r(i2), l3);
      });
    } catch {
      throw new Error(`Multibyte code "${e}" incomplete or invalid in Oniguruma`);
    }
    if (t === "u" || t === "x") return d2(J2(e), e);
    if ($2.has(t)) return d2($2.get(t), e);
    if (/\d/.test(t)) return W2(n, e);
    if (e === "\\") throw new Error(o`Incomplete escape "\"`);
    if (t === "M") throw new Error(`Unsupported meta "${e}"`);
    if ([...e].length === 2) return d2(e.codePointAt(1), e);
    throw new Error(`Unexpected escape "${e}"`);
  }
  function P2(e) {
    return { type: "Alternator", raw: e };
  }
  function w2(e, n) {
    return { type: "Assertion", kind: e, raw: n };
  }
  function A(e) {
    return { type: "Backreference", raw: e };
  }
  function d2(e, n) {
    return { type: "Character", value: e, raw: n };
  }
  function z2(e) {
    return { type: "CharacterClassClose", raw: e };
  }
  function U2(e) {
    return { type: "CharacterClassHyphen", raw: e };
  }
  function H(e) {
    return { type: "CharacterClassIntersector", raw: e };
  }
  function E2(e, n) {
    return { type: "CharacterClassOpen", negate: e, raw: n };
  }
  function k2(e, n, t = {}) {
    return { type: "CharacterSet", kind: e, ...t, raw: n };
  }
  function I2(e, n, t = {}) {
    return e === "keep" ? { type: "Directive", kind: e, raw: n } : { type: "Directive", kind: e, flags: u3(t.flags), raw: n };
  }
  function W2(e, n) {
    return { type: "EscapedNumber", inCharClass: e, raw: n };
  }
  function Q2(e) {
    return { type: "GroupClose", raw: e };
  }
  function f(e, n, t = {}) {
    return { type: "GroupOpen", kind: e, ...t, raw: n };
  }
  function D3(e, n, t, o3) {
    return { type: "NamedCallout", kind: e, tag: n, arguments: t, raw: o3 };
  }
  function _2(e, n, t, o3) {
    return { type: "Quantifier", kind: e, min: n, max: t, raw: o3 };
  }
  function R(e) {
    return { type: "Subroutine", raw: e };
  }
  var B2 = /* @__PURE__ */ new Set(["COUNT", "CMP", "ERROR", "FAIL", "MAX", "MISMATCH", "SKIP", "TOTAL_COUNT"]);
  var $2 = /* @__PURE__ */ new Map([["a", 7], ["b", 8], ["e", 27], ["f", 12], ["n", 10], ["r", 13], ["t", 9], ["v", 11]]);
  function Z2(e) {
    const n = e[1] === "c" ? e[2] : e[3];
    if (!n || !/[A-Za-z]/.test(n)) throw new Error(`Unsupported control character "${e}"`);
    return d2(r(n.toUpperCase()) - 64, e);
  }
  function L2(e, n) {
    let { on: t, off: o3 } = /^\(\?(?<on>[imx]*)(?:-(?<off>[-imx]*))?/.exec(e).groups;
    o3 ??= "";
    const s2 = (n.getCurrentModX() || t.includes("x")) && !o3.includes("x"), a2 = v2(t), r4 = v2(o3), i2 = {};
    if (a2 && (i2.enable = a2), r4 && (i2.disable = r4), e.endsWith(")")) return n.replaceCurrentModX(s2), I2("flags", e, { flags: i2 });
    if (e.endsWith(":")) return n.pushModX(s2), n.numOpenGroups++, f("group", e, { ...(a2 || r4) && { flags: i2 } });
    throw new Error(`Unexpected flag modifier "${e}"`);
  }
  function j2(e) {
    const n = /\(\*(?<name>[A-Za-z_]\w*)?(?:\[(?<tag>(?:[A-Za-z_]\w*)?)\])?(?:\{(?<args>[^}]*)\})?\)/.exec(e);
    if (!n) throw new Error(`Incomplete or invalid named callout "${e}"`);
    const { name: t, tag: o3, args: s2 } = n.groups;
    if (!t) throw new Error(`Invalid named callout "${e}"`);
    if (o3 === "") throw new Error(`Named callout tag with empty value not allowed "${e}"`);
    const a2 = s2 ? s2.split(",").filter((g) => g !== "").map((g) => /^[+-]?\d+$/.test(g) ? +g : g) : [], [r4, i2, l3] = a2, c = B2.has(t) ? t.toLowerCase() : "custom";
    switch (c) {
      case "fail":
      case "mismatch":
      case "skip":
        if (a2.length > 0) throw new Error(`Named callout arguments not allowed "${a2}"`);
        break;
      case "error":
        if (a2.length > 1) throw new Error(`Named callout allows only one argument "${a2}"`);
        if (typeof r4 == "string") throw new Error(`Named callout argument must be a number "${r4}"`);
        break;
      case "max":
        if (!a2.length || a2.length > 2) throw new Error(`Named callout must have one or two arguments "${a2}"`);
        if (typeof r4 == "string" && !/^[A-Za-z_]\w*$/.test(r4)) throw new Error(`Named callout argument one must be a tag or number "${r4}"`);
        if (a2.length === 2 && (typeof i2 == "number" || !/^[<>X]$/.test(i2))) throw new Error(`Named callout optional argument two must be '<', '>', or 'X' "${i2}"`);
        break;
      case "count":
      case "total_count":
        if (a2.length > 1) throw new Error(`Named callout allows only one argument "${a2}"`);
        if (a2.length === 1 && (typeof r4 == "number" || !/^[<>X]$/.test(r4))) throw new Error(`Named callout optional argument must be '<', '>', or 'X' "${r4}"`);
        break;
      case "cmp":
        if (a2.length !== 3) throw new Error(`Named callout must have three arguments "${a2}"`);
        if (typeof r4 == "string" && !/^[A-Za-z_]\w*$/.test(r4)) throw new Error(`Named callout argument one must be a tag or number "${r4}"`);
        if (typeof i2 == "number" || !/^(?:[<>!=]=|[<>])$/.test(i2)) throw new Error(`Named callout argument two must be '==', '!=', '>', '<', '>=', or '<=' "${i2}"`);
        if (typeof l3 == "string" && !/^[A-Za-z_]\w*$/.test(l3)) throw new Error(`Named callout argument three must be a tag or number "${l3}"`);
        break;
      case "custom":
        throw new Error(`Undefined callout name "${t}"`);
      default:
        throw new Error(`Unexpected named callout kind "${c}"`);
    }
    return D3(c, o3 ?? null, s2?.split(",") ?? null, e);
  }
  function O(e) {
    let n = null, t, o3;
    if (e[0] === "{") {
      const { minStr: s2, maxStr: a2 } = /^\{(?<minStr>\d*)(?:,(?<maxStr>\d*))?/.exec(e).groups, r4 = 1e5;
      if (+s2 > r4 || a2 && +a2 > r4) throw new Error("Quantifier value unsupported in Oniguruma");
      if (t = +s2, o3 = a2 === void 0 ? +s2 : a2 === "" ? 1 / 0 : +a2, t > o3 && (n = "possessive", [t, o3] = [o3, t]), e.endsWith("?")) {
        if (n === "possessive") throw new Error('Unsupported possessive interval quantifier chain with "?"');
        n = "lazy";
      } else n || (n = "greedy");
    } else t = e[0] === "+" ? 1 : 0, o3 = e[0] === "?" ? 1 : 1 / 0, n = e[1] === "+" ? "possessive" : e[1] === "?" ? "lazy" : "greedy";
    return _2(n, t, o3, e);
  }
  function q2(e) {
    const n = e[1].toLowerCase();
    return k2({ d: "digit", h: "hex", s: "space", w: "word" }[n], e, { negate: e[1] !== n });
  }
  function V(e) {
    const { p: n, neg: t, value: o3 } = /^\\(?<p>[pP])\{(?<neg>\^?)(?<value>[^}]+)/.exec(e).groups;
    return k2("property", e, { value: o3, negate: n === "P" && !t || n === "p" && !!t });
  }
  function v2(e) {
    const n = {};
    return e.includes("i") && (n.ignoreCase = true), e.includes("m") && (n.dotAll = true), e.includes("x") && (n.extended = true), Object.keys(n).length ? n : null;
  }
  function Y(e) {
    const n = { ignoreCase: false, dotAll: false, extended: false, digitIsAscii: false, posixIsAscii: false, spaceIsAscii: false, wordIsAscii: false, textSegmentMode: null };
    for (let t = 0; t < e.length; t++) {
      const o3 = e[t];
      if (!"imxDPSWy".includes(o3)) throw new Error(`Invalid flag "${o3}"`);
      if (o3 === "y") {
        if (!/^y{[gw]}/.test(e.slice(t))) throw new Error('Invalid or unspecified flag "y" mode');
        n.textSegmentMode = e[t + 2] === "g" ? "grapheme" : "word", t += 3;
        continue;
      }
      n[{ i: "ignoreCase", m: "dotAll", x: "extended", D: "digitIsAscii", P: "posixIsAscii", S: "spaceIsAscii", W: "wordIsAscii" }[o3]] = true;
    }
    return n;
  }
  function J2(e) {
    if (/^(?:\\u(?!\p{AHex}{4})|\\x(?!\p{AHex}{1,2}|\{\p{AHex}{1,8}\}))/u.test(e)) throw new Error(`Incomplete or invalid escape "${e}"`);
    const n = e[2] === "{" ? /^\\x\{\s*(?<hex>\p{AHex}+)/u.exec(e).groups.hex : e.slice(2);
    return parseInt(n, 16);
  }
  function ee(e, n) {
    const { raw: t, inCharClass: o3 } = e, s2 = t.slice(1);
    if (!o3 && (s2 !== "0" && s2.length === 1 || s2[0] !== "0" && +s2 <= n)) return [A(t)];
    const a2 = [], r4 = s2.match(/^[0-7]+|\d/g);
    for (let i2 = 0; i2 < r4.length; i2++) {
      const l3 = r4[i2];
      let c;
      if (i2 === 0 && l3 !== "8" && l3 !== "9") {
        if (c = parseInt(l3, 8), c > 127) throw new Error(o`Octal encoded byte above 177 unsupported "${t}"`);
      } else c = r(l3);
      a2.push(d2(c, (i2 === 0 ? "\\" : "") + l3));
    }
    return a2;
  }
  function te2(e) {
    const n = [], t = new RegExp(y2, "gy");
    let o3;
    for (; o3 = t.exec(e); ) {
      const s2 = o3[0];
      if (s2[0] === "{") {
        const a2 = /^\{(?<min>\d+),(?<max>\d+)\}\??$/.exec(s2);
        if (a2) {
          const { min: r4, max: i2 } = a2.groups;
          if (+r4 > +i2 && s2.endsWith("?")) {
            t.lastIndex--, n.push(O(s2.slice(0, -1)));
            continue;
          }
        }
      }
      n.push(O(s2));
    }
    return n;
  }

  // node_modules/oniguruma-parser/dist/parser/node-utils.js
  function o2(e, t) {
    if (!Array.isArray(e.body)) throw new Error("Expected node with body array");
    if (e.body.length !== 1) return false;
    const r4 = e.body[0];
    return !t || Object.keys(t).every((n) => t[n] === r4[n]);
  }
  function s(e) {
    return y3.has(e.type);
  }
  var y3 = /* @__PURE__ */ new Set(["AbsenceFunction", "Backreference", "CapturingGroup", "Character", "CharacterClass", "CharacterSet", "Group", "Quantifier", "Subroutine"]);

  // node_modules/oniguruma-parser/dist/parser/parse.js
  function J3(e, r4 = {}) {
    const n = { flags: "", normalizeUnknownPropertyNames: false, skipBackrefValidation: false, skipLookbehindValidation: false, skipPropertyNameValidation: false, unicodePropertyMap: null, ...r4, rules: { captureGroup: false, singleline: false, ...r4.rules } }, o3 = M2(e, { flags: n.flags, rules: { captureGroup: n.rules.captureGroup, singleline: n.rules.singleline } }), i2 = (p2, N2) => {
      const u4 = o3.tokens[t.nextIndex];
      switch (t.parent = p2, t.nextIndex++, u4.type) {
        case "Alternator":
          return b3();
        case "Assertion":
          return W3(u4);
        case "Backreference":
          return X3(u4, t);
        case "Character":
          return m3(u4.value, { useLastValid: !!N2.isCheckingRangeEnd });
        case "CharacterClassHyphen":
          return ee2(u4, t, N2);
        case "CharacterClassOpen":
          return re3(u4, t, N2);
        case "CharacterSet":
          return ne2(u4, t);
        case "Directive":
          return I3(u4.kind, { flags: u4.flags });
        case "GroupOpen":
          return te3(u4, t, N2);
        case "NamedCallout":
          return U3(u4.kind, u4.tag, u4.arguments);
        case "Quantifier":
          return oe2(u4, t);
        case "Subroutine":
          return ae2(u4, t);
        default:
          throw new Error(`Unexpected token type "${u4.type}"`);
      }
    }, t = { capturingGroups: [], hasNumberedRef: false, namedGroupsByName: /* @__PURE__ */ new Map(), nextIndex: 0, normalizeUnknownPropertyNames: n.normalizeUnknownPropertyNames, parent: null, skipBackrefValidation: n.skipBackrefValidation, skipLookbehindValidation: n.skipLookbehindValidation, skipPropertyNameValidation: n.skipPropertyNameValidation, subroutines: [], tokens: o3.tokens, unicodePropertyMap: n.unicodePropertyMap, walk: i2 }, d3 = B3(T4(o3.flags));
    let s2 = d3.body[0];
    for (; t.nextIndex < o3.tokens.length; ) {
      const p2 = i2(s2, {});
      p2.type === "Alternative" ? (d3.body.push(p2), s2 = p2) : s2.body.push(p2);
    }
    const { capturingGroups: a2, hasNumberedRef: l3, namedGroupsByName: c, subroutines: f2 } = t;
    if (l3 && c.size && !n.rules.captureGroup) throw new Error("Numbered backref/subroutine not allowed when using named capture");
    for (const { ref: p2 } of f2) if (typeof p2 == "number") {
      if (p2 > a2.length) throw new Error("Subroutine uses a group number that's not defined");
      p2 && (a2[p2 - 1].isSubroutined = true);
    } else if (c.has(p2)) {
      if (c.get(p2).length > 1) throw new Error(o`Subroutine uses a duplicate group name "\g<${p2}>"`);
      c.get(p2)[0].isSubroutined = true;
    } else throw new Error(o`Subroutine uses a group name that's not defined "\g<${p2}>"`);
    return d3;
  }
  function W3({ kind: e }) {
    return F3(u3({ "^": "line_start", $: "line_end", "\\A": "string_start", "\\b": "word_boundary", "\\B": "word_boundary", "\\G": "search_start", "\\y": "text_segment_boundary", "\\Y": "text_segment_boundary", "\\z": "string_end", "\\Z": "string_end_newline" }[e], `Unexpected assertion kind "${e}"`), { negate: e === o`\B` || e === o`\Y` });
  }
  function X3({ raw: e }, r4) {
    const n = /^\\k[<']/.test(e), o3 = n ? e.slice(3, -1) : e.slice(1), i2 = (t, d3 = false) => {
      const s2 = r4.capturingGroups.length;
      let a2 = false;
      if (t > s2) if (r4.skipBackrefValidation) a2 = true;
      else throw new Error(`Not enough capturing groups defined to the left "${e}"`);
      return r4.hasNumberedRef = true, k3(d3 ? s2 + 1 - t : t, { orphan: a2 });
    };
    if (n) {
      const t = /^(?<sign>-?)0*(?<num>[1-9]\d*)$/.exec(o3);
      if (t) return i2(+t.groups.num, !!t.groups.sign);
      if (/[-+]/.test(o3)) throw new Error(`Invalid backref name "${e}"`);
      if (!r4.namedGroupsByName.has(o3)) throw new Error(`Group name not defined to the left "${e}"`);
      return k3(o3);
    }
    return i2(+o3);
  }
  function ee2(e, r4, n) {
    const { tokens: o3, walk: i2 } = r4, t = r4.parent, d3 = t.body.at(-1), s2 = o3[r4.nextIndex];
    if (!n.isCheckingRangeEnd && d3 && d3.type !== "CharacterClass" && d3.type !== "CharacterClassRange" && s2 && s2.type !== "CharacterClassOpen" && s2.type !== "CharacterClassClose" && s2.type !== "CharacterClassIntersector") {
      const a2 = i2(t, { ...n, isCheckingRangeEnd: true });
      if (d3.type === "Character" && a2.type === "Character") return t.body.pop(), L3(d3, a2);
      throw new Error("Invalid character class range");
    }
    return m3(r("-"));
  }
  function re3({ negate: e }, r4, n) {
    const { tokens: o3, walk: i2 } = r4, t = [C3()], d3 = o3[r4.nextIndex];
    let s2 = z3(d3);
    for (; s2.type !== "CharacterClassClose"; ) {
      if (s2.type === "CharacterClassIntersector") t.push(C3()), r4.nextIndex++;
      else {
        const l3 = t.at(-1);
        l3.body.push(i2(l3, n));
      }
      s2 = z3(o3[r4.nextIndex], d3);
    }
    const a2 = C3({ negate: e });
    return t.length === 1 ? a2.body = t[0].body : (a2.kind = "intersection", a2.body = t.map((l3) => l3.body.length === 1 ? l3.body[0] : l3)), r4.nextIndex++, a2;
  }
  function ne2({ kind: e, negate: r4, value: n }, o3) {
    const { normalizeUnknownPropertyNames: i2, skipPropertyNameValidation: t, unicodePropertyMap: d3 } = o3;
    if (e === "property") {
      const s2 = w3(n);
      if (i.has(s2) && !d3?.has(s2)) e = "posix", n = s2;
      else return Q3(n, { negate: r4, normalizeUnknownPropertyNames: i2, skipPropertyNameValidation: t, unicodePropertyMap: d3 });
    }
    return e === "posix" ? R2(n, { negate: r4 }) : E3(e, { negate: r4 });
  }
  function te3(e, r4, n) {
    const { tokens: o3, capturingGroups: i2, namedGroupsByName: t, skipLookbehindValidation: d3, walk: s2 } = r4, a2 = ie2(e), l3 = a2.type === "AbsenceFunction", c = $3(a2), f2 = c && a2.negate;
    if (a2.type === "CapturingGroup" && (i2.push(a2), a2.name && l(t, a2.name, []).push(a2)), l3 && n.isInAbsenceFunction) throw new Error("Nested absence function not supported by Oniguruma");
    let p2 = D4(o3[r4.nextIndex]);
    for (; p2.type !== "GroupClose"; ) {
      if (p2.type === "Alternator") a2.body.push(b3()), r4.nextIndex++;
      else {
        const N2 = a2.body.at(-1), u4 = s2(N2, { ...n, isInAbsenceFunction: n.isInAbsenceFunction || l3, isInLookbehind: n.isInLookbehind || c, isInNegLookbehind: n.isInNegLookbehind || f2 });
        if (N2.body.push(u4), (c || n.isInLookbehind) && !d3) {
          const v3 = "Lookbehind includes a pattern not allowed by Oniguruma";
          if (f2 || n.isInNegLookbehind) {
            if (M3(u4) || u4.type === "CapturingGroup") throw new Error(v3);
          } else if (M3(u4) || $3(u4) && u4.negate) throw new Error(v3);
        }
      }
      p2 = D4(o3[r4.nextIndex]);
    }
    return r4.nextIndex++, a2;
  }
  function oe2({ kind: e, min: r4, max: n }, o3) {
    const i2 = o3.parent, t = i2.body.at(-1);
    if (!t || !s(t)) throw new Error("Quantifier requires a repeatable token");
    const d3 = _3(e, r4, n, t);
    return i2.body.pop(), d3;
  }
  function ae2({ raw: e }, r4) {
    const { capturingGroups: n, subroutines: o3 } = r4;
    let i2 = e.slice(3, -1);
    const t = /^(?<sign>[-+]?)0*(?<num>[1-9]\d*)$/.exec(i2);
    if (t) {
      const s2 = +t.groups.num, a2 = n.length;
      if (r4.hasNumberedRef = true, i2 = { "": s2, "+": a2 + s2, "-": a2 + 1 - s2 }[t.groups.sign], i2 < 1) throw new Error("Invalid subroutine number");
    } else i2 === "0" && (i2 = 0);
    const d3 = O2(i2);
    return o3.push(d3), d3;
  }
  function G2(e, r4) {
    if (e !== "repeater") throw new Error(`Unexpected absence function kind "${e}"`);
    return { type: "AbsenceFunction", kind: e, body: h(r4?.body) };
  }
  function b3(e) {
    return { type: "Alternative", body: V2(e?.body) };
  }
  function F3(e, r4) {
    const n = { type: "Assertion", kind: e };
    return (e === "word_boundary" || e === "text_segment_boundary") && (n.negate = !!r4?.negate), n;
  }
  function k3(e, r4) {
    const n = !!r4?.orphan;
    return { type: "Backreference", ref: e, ...n && { orphan: n } };
  }
  function P3(e, r4) {
    const n = { name: void 0, isSubroutined: false, ...r4 };
    if (n.name !== void 0 && !se2(n.name)) throw new Error(`Group name "${n.name}" invalid in Oniguruma`);
    return { type: "CapturingGroup", number: e, ...n.name && { name: n.name }, ...n.isSubroutined && { isSubroutined: n.isSubroutined }, body: h(r4?.body) };
  }
  function m3(e, r4) {
    const n = { useLastValid: false, ...r4 };
    if (e > 1114111) {
      const o3 = e.toString(16);
      if (n.useLastValid) e = 1114111;
      else throw e > 1310719 ? new Error(`Invalid code point out of range "\\x{${o3}}"`) : new Error(`Invalid code point out of range in JS "\\x{${o3}}"`);
    }
    return { type: "Character", value: e };
  }
  function C3(e) {
    const r4 = { kind: "union", negate: false, ...e };
    return { type: "CharacterClass", kind: r4.kind, negate: r4.negate, body: V2(e?.body) };
  }
  function L3(e, r4) {
    if (r4.value < e.value) throw new Error("Character class range out of order");
    return { type: "CharacterClassRange", min: e, max: r4 };
  }
  function E3(e, r4) {
    const n = !!r4?.negate, o3 = { type: "CharacterSet", kind: e };
    return (e === "digit" || e === "hex" || e === "newline" || e === "space" || e === "word") && (o3.negate = n), (e === "text_segment" || e === "newline" && !n) && (o3.variableLength = true), o3;
  }
  function I3(e, r4 = {}) {
    if (e === "keep") return { type: "Directive", kind: e };
    if (e === "flags") return { type: "Directive", kind: e, flags: u3(r4.flags) };
    throw new Error(`Unexpected directive kind "${e}"`);
  }
  function T4(e) {
    return { type: "Flags", ...e };
  }
  function A2(e) {
    const r4 = e?.atomic, n = e?.flags;
    if (r4 && n) throw new Error("Atomic group cannot have flags");
    return { type: "Group", ...r4 && { atomic: r4 }, ...n && { flags: n }, body: h(e?.body) };
  }
  function K3(e) {
    const r4 = { behind: false, negate: false, ...e };
    return { type: "LookaroundAssertion", kind: r4.behind ? "lookbehind" : "lookahead", negate: r4.negate, body: h(e?.body) };
  }
  function U3(e, r4, n) {
    return { type: "NamedCallout", kind: e, tag: r4, arguments: n };
  }
  function R2(e, r4) {
    const n = !!r4?.negate;
    if (!i.has(e)) throw new Error(`Invalid POSIX class "${e}"`);
    return { type: "CharacterSet", kind: "posix", value: e, negate: n };
  }
  function _3(e, r4, n, o3) {
    if (r4 > n) throw new Error("Invalid reversed quantifier range");
    return { type: "Quantifier", kind: e, min: r4, max: n, body: o3 };
  }
  function B3(e, r4) {
    return { type: "Regex", body: h(r4?.body), flags: e };
  }
  function O2(e) {
    return { type: "Subroutine", ref: e };
  }
  function Q3(e, r4) {
    const n = { negate: false, normalizeUnknownPropertyNames: false, skipPropertyNameValidation: false, unicodePropertyMap: null, ...r4 };
    let o3 = n.unicodePropertyMap?.get(w3(e));
    if (!o3) {
      if (n.normalizeUnknownPropertyNames) o3 = de2(e);
      else if (n.unicodePropertyMap && !n.skipPropertyNameValidation) throw new Error(o`Invalid Unicode property "\p{${e}}"`);
    }
    return { type: "CharacterSet", kind: "property", value: o3 ?? e, negate: n.negate };
  }
  function ie2({ flags: e, kind: r4, name: n, negate: o3, number: i2 }) {
    switch (r4) {
      case "absence_repeater":
        return G2("repeater");
      case "atomic":
        return A2({ atomic: true });
      case "capturing":
        return P3(i2, { name: n });
      case "group":
        return A2({ flags: e });
      case "lookahead":
      case "lookbehind":
        return K3({ behind: r4 === "lookbehind", negate: o3 });
      default:
        throw new Error(`Unexpected group kind "${r4}"`);
    }
  }
  function h(e) {
    if (e === void 0) e = [b3()];
    else if (!Array.isArray(e) || !e.length || !e.every((r4) => r4.type === "Alternative")) throw new Error("Invalid body; expected array of one or more Alternative nodes");
    return e;
  }
  function V2(e) {
    if (e === void 0) e = [];
    else if (!Array.isArray(e) || !e.every((r4) => !!r4.type)) throw new Error("Invalid body; expected array of nodes");
    return e;
  }
  function M3(e) {
    return e.type === "LookaroundAssertion" && e.kind === "lookahead";
  }
  function $3(e) {
    return e.type === "LookaroundAssertion" && e.kind === "lookbehind";
  }
  function se2(e) {
    return /^[\p{Alpha}\p{Pc}][^)]*$/u.test(e);
  }
  function de2(e) {
    return e.trim().replace(/[- _]+/g, "_").replace(/[A-Z][a-z]+(?=[A-Z])/g, "$&_").replace(/[A-Za-z]+/g, (r4) => r4[0].toUpperCase() + r4.slice(1).toLowerCase());
  }
  function w3(e) {
    return e.replace(/[- _]+/g, "").toLowerCase();
  }
  function z3(e, r4) {
    const n = r4;
    return u3(e, `Unclosed character class${n?.type === "Character" && n.value === 93 && n.raw === "]" ? ' (started with "]")' : ""}`);
  }
  function D4(e) {
    return u3(e, "Unclosed group");
  }

  // node_modules/oniguruma-parser/dist/traverser/traverse.js
  function S3(a2, v3, N2 = null) {
    function b4(e, s2) {
      for (let t = 0; t < e.length; t++) {
        const r4 = n(e[t], s2, t, e);
        t = Math.max(-1, t + r4);
      }
    }
    function n(e, s2 = null, t = null, r4 = null) {
      let i2 = 0, c = false;
      const d3 = { node: e, parent: s2, key: t, container: r4, root: a2, remove() {
        x3(r4).splice(Math.max(0, l2(t) + i2), 1), i2--, c = true;
      }, removeAllNextSiblings() {
        return x3(r4).splice(l2(t) + 1);
      }, removeAllPrevSiblings() {
        const o3 = l2(t) + i2;
        return i2 -= o3, x3(r4).splice(0, Math.max(0, o3));
      }, replaceWith(o3, m4 = {}) {
        const y4 = !!m4.traverse;
        r4 ? r4[Math.max(0, l2(t) + i2)] = o3 : u3(s2, "Can't replace root node")[t] = o3, y4 && n(o3, s2, t, r4), c = true;
      }, replaceWithMultiple(o3, m4 = {}) {
        const y4 = !!m4.traverse;
        if (x3(r4).splice(Math.max(0, l2(t) + i2), 1, ...o3), i2 += o3.length - 1, y4) {
          let g = 0;
          for (let p2 = 0; p2 < o3.length; p2++) g += n(o3[p2], s2, l2(t) + p2 + g, r4);
        }
        c = true;
      }, skip() {
        c = true;
      } }, { type: f2 } = e, u4 = v3["*"], h2 = v3[f2], R3 = typeof u4 == "function" ? u4 : u4?.enter, P4 = typeof h2 == "function" ? h2 : h2?.enter;
      if (R3?.(d3, N2), P4?.(d3, N2), !c) switch (f2) {
        case "AbsenceFunction":
        case "Alternative":
        case "CapturingGroup":
        case "CharacterClass":
        case "Group":
        case "LookaroundAssertion":
          b4(e.body, e);
          break;
        case "Assertion":
        case "Backreference":
        case "Character":
        case "CharacterSet":
        case "Directive":
        case "Flags":
        case "NamedCallout":
        case "Subroutine":
          break;
        case "CharacterClassRange":
          n(e.min, e, "min"), n(e.max, e, "max");
          break;
        case "Quantifier":
          n(e.body, e, "body");
          break;
        case "Regex":
          b4(e.body, e), n(e.flags, e, "flags");
          break;
        default:
          throw new Error(`Unexpected node type "${f2}"`);
      }
      return h2?.exit?.(d3, N2), u4?.exit?.(d3, N2), i2;
    }
    return n(a2), a2;
  }
  function x3(a2) {
    if (!Array.isArray(a2)) throw new Error("Container expected");
    return a2;
  }
  function l2(a2) {
    if (typeof a2 != "number") throw new Error("Numeric key expected");
    return a2;
  }

  // node_modules/regex/src/utils-internals.js
  var noncapturingDelim = String.raw`\(\?(?:[:=!>A-Za-z\-]|<[=!]|\(DEFINE\))`;
  function incrementIfAtLeast(arr, threshold) {
    for (let i2 = 0; i2 < arr.length; i2++) {
      if (arr[i2] >= threshold) {
        arr[i2]++;
      }
    }
  }
  function spliceStr(str, pos, oldValue, newValue) {
    return str.slice(0, pos) + newValue + str.slice(pos + oldValue.length);
  }

  // node_modules/regex-utilities/src/index.js
  var Context = Object.freeze({
    DEFAULT: "DEFAULT",
    CHAR_CLASS: "CHAR_CLASS"
  });
  function replaceUnescaped(expression, needle, replacement, context) {
    const re4 = new RegExp(String.raw`${needle}|(?<$skip>\[\^?|\\?.)`, "gsu");
    const negated = [false];
    let numCharClassesOpen = 0;
    let result = "";
    for (const match of expression.matchAll(re4)) {
      const { 0: m4, groups: { $skip } } = match;
      if (!$skip && (!context || context === Context.DEFAULT === !numCharClassesOpen)) {
        if (replacement instanceof Function) {
          result += replacement(match, {
            context: numCharClassesOpen ? Context.CHAR_CLASS : Context.DEFAULT,
            negated: negated[negated.length - 1]
          });
        } else {
          result += replacement;
        }
        continue;
      }
      if (m4[0] === "[") {
        numCharClassesOpen++;
        negated.push(m4[1] === "^");
      } else if (m4 === "]" && numCharClassesOpen) {
        numCharClassesOpen--;
        negated.pop();
      }
      result += m4;
    }
    return result;
  }
  function forEachUnescaped(expression, needle, callback, context) {
    replaceUnescaped(expression, needle, callback, context);
  }
  function execUnescaped(expression, needle, pos = 0, context) {
    if (!new RegExp(needle, "su").test(expression)) {
      return null;
    }
    const re4 = new RegExp(`${needle}|(?<$skip>\\\\?.)`, "gsu");
    re4.lastIndex = pos;
    let numCharClassesOpen = 0;
    let match;
    while (match = re4.exec(expression)) {
      const { 0: m4, groups: { $skip } } = match;
      if (!$skip && (!context || context === Context.DEFAULT === !numCharClassesOpen)) {
        return match;
      }
      if (m4 === "[") {
        numCharClassesOpen++;
      } else if (m4 === "]" && numCharClassesOpen) {
        numCharClassesOpen--;
      }
      if (re4.lastIndex == match.index) {
        re4.lastIndex++;
      }
    }
    return null;
  }
  function hasUnescaped(expression, needle, context) {
    return !!execUnescaped(expression, needle, 0, context);
  }
  function getGroupContents(expression, contentsStartPos) {
    const token2 = /\\?./gsu;
    token2.lastIndex = contentsStartPos;
    let contentsEndPos = expression.length;
    let numCharClassesOpen = 0;
    let numGroupsOpen = 1;
    let match;
    while (match = token2.exec(expression)) {
      const [m4] = match;
      if (m4 === "[") {
        numCharClassesOpen++;
      } else if (!numCharClassesOpen) {
        if (m4 === "(") {
          numGroupsOpen++;
        } else if (m4 === ")") {
          numGroupsOpen--;
          if (!numGroupsOpen) {
            contentsEndPos = match.index;
            break;
          }
        }
      } else if (m4 === "]") {
        numCharClassesOpen--;
      }
    }
    return expression.slice(contentsStartPos, contentsEndPos);
  }

  // node_modules/regex/src/atomic.js
  var atomicPluginToken = new RegExp(String.raw`(?<noncapturingStart>${noncapturingDelim})|(?<capturingStart>\((?:\?<[^>]+>)?)|\\?.`, "gsu");
  function atomic(expression, data) {
    const hiddenCaptures = data?.hiddenCaptures ?? [];
    let captureTransfers = data?.captureTransfers ?? /* @__PURE__ */ new Map();
    if (!/\(\?>/.test(expression)) {
      return {
        pattern: expression,
        captureTransfers,
        hiddenCaptures
      };
    }
    const aGDelim = "(?>";
    const emulatedAGDelim = "(?:(?=(";
    const captureNumMap = [0];
    const addedHiddenCaptures = [];
    let numCapturesBeforeAG = 0;
    let numAGs = 0;
    let aGPos = NaN;
    let hasProcessedAG;
    do {
      hasProcessedAG = false;
      let numCharClassesOpen = 0;
      let numGroupsOpenInAG = 0;
      let inAG = false;
      let match;
      atomicPluginToken.lastIndex = Number.isNaN(aGPos) ? 0 : aGPos + emulatedAGDelim.length;
      while (match = atomicPluginToken.exec(expression)) {
        const { 0: m4, index, groups: { capturingStart, noncapturingStart } } = match;
        if (m4 === "[") {
          numCharClassesOpen++;
        } else if (!numCharClassesOpen) {
          if (m4 === aGDelim && !inAG) {
            aGPos = index;
            inAG = true;
          } else if (inAG && noncapturingStart) {
            numGroupsOpenInAG++;
          } else if (capturingStart) {
            if (inAG) {
              numGroupsOpenInAG++;
            } else {
              numCapturesBeforeAG++;
              captureNumMap.push(numCapturesBeforeAG + numAGs);
            }
          } else if (m4 === ")" && inAG) {
            if (!numGroupsOpenInAG) {
              numAGs++;
              const addedCaptureNum = numCapturesBeforeAG + numAGs;
              expression = `${expression.slice(0, aGPos)}${emulatedAGDelim}${expression.slice(aGPos + aGDelim.length, index)}))<$$${addedCaptureNum}>)${expression.slice(index + 1)}`;
              hasProcessedAG = true;
              addedHiddenCaptures.push(addedCaptureNum);
              incrementIfAtLeast(hiddenCaptures, addedCaptureNum);
              if (captureTransfers.size) {
                const newCaptureTransfers = /* @__PURE__ */ new Map();
                captureTransfers.forEach((from, to) => {
                  newCaptureTransfers.set(
                    to >= addedCaptureNum ? to + 1 : to,
                    from.map((f2) => f2 >= addedCaptureNum ? f2 + 1 : f2)
                  );
                });
                captureTransfers = newCaptureTransfers;
              }
              break;
            }
            numGroupsOpenInAG--;
          }
        } else if (m4 === "]") {
          numCharClassesOpen--;
        }
      }
    } while (hasProcessedAG);
    hiddenCaptures.push(...addedHiddenCaptures);
    expression = replaceUnescaped(
      expression,
      String.raw`\\(?<backrefNum>[1-9]\d*)|<\$\$(?<wrappedBackrefNum>\d+)>`,
      ({ 0: m4, groups: { backrefNum, wrappedBackrefNum } }) => {
        if (backrefNum) {
          const bNum = +backrefNum;
          if (bNum > captureNumMap.length - 1) {
            throw new Error(`Backref "${m4}" greater than number of captures`);
          }
          return `\\${captureNumMap[bNum]}`;
        }
        return `\\${wrappedBackrefNum}`;
      },
      Context.DEFAULT
    );
    return {
      pattern: expression,
      captureTransfers,
      hiddenCaptures
    };
  }
  var baseQuantifier = String.raw`(?:[?*+]|\{\d+(?:,\d*)?\})`;
  var possessivePluginToken = new RegExp(String.raw`
\\(?: \d+
  | c[A-Za-z]
  | [gk]<[^>]+>
  | [pPu]\{[^\}]+\}
  | u[A-Fa-f\d]{4}
  | x[A-Fa-f\d]{2}
  )
| \((?: \? (?: [:=!>]
  | <(?:[=!]|[^>]+>)
  | [A-Za-z\-]+:
  | \(DEFINE\)
  ))?
| (?<qBase>${baseQuantifier})(?<qMod>[?+]?)(?<invalidQ>[?*+\{]?)
| \\?.
`.replace(/\s+/g, ""), "gsu");
  function possessive(expression) {
    if (!new RegExp(`${baseQuantifier}\\+`).test(expression)) {
      return {
        pattern: expression
      };
    }
    const openGroupIndices = [];
    let lastGroupIndex = null;
    let lastCharClassIndex = null;
    let lastToken = "";
    let numCharClassesOpen = 0;
    let match;
    possessivePluginToken.lastIndex = 0;
    while (match = possessivePluginToken.exec(expression)) {
      const { 0: m4, index, groups: { qBase, qMod, invalidQ } } = match;
      if (m4 === "[") {
        if (!numCharClassesOpen) {
          lastCharClassIndex = index;
        }
        numCharClassesOpen++;
      } else if (m4 === "]") {
        if (numCharClassesOpen) {
          numCharClassesOpen--;
        } else {
          lastCharClassIndex = null;
        }
      } else if (!numCharClassesOpen) {
        if (qMod === "+" && lastToken && !lastToken.startsWith("(")) {
          if (invalidQ) {
            throw new Error(`Invalid quantifier "${m4}"`);
          }
          let charsAdded = -1;
          if (/^\{\d+\}$/.test(qBase)) {
            expression = spliceStr(expression, index + qBase.length, qMod, "");
          } else {
            if (lastToken === ")" || lastToken === "]") {
              const nodeIndex = lastToken === ")" ? lastGroupIndex : lastCharClassIndex;
              if (nodeIndex === null) {
                throw new Error(`Invalid unmatched "${lastToken}"`);
              }
              expression = `${expression.slice(0, nodeIndex)}(?>${expression.slice(nodeIndex, index)}${qBase})${expression.slice(index + m4.length)}`;
            } else {
              expression = `${expression.slice(0, index - lastToken.length)}(?>${lastToken}${qBase})${expression.slice(index + m4.length)}`;
            }
            charsAdded += 4;
          }
          possessivePluginToken.lastIndex += charsAdded;
        } else if (m4[0] === "(") {
          openGroupIndices.push(index);
        } else if (m4 === ")") {
          lastGroupIndex = openGroupIndices.length ? openGroupIndices.pop() : null;
        }
      }
      lastToken = m4;
    }
    return {
      pattern: expression
    };
  }

  // node_modules/regex-recursion/src/index.js
  var r2 = String.raw;
  var gRToken = r2`\\g<(?<gRNameOrNum>[^>&]+)&R=(?<gRDepth>[^>]+)>`;
  var recursiveToken = r2`\(\?R=(?<rDepth>[^\)]+)\)|${gRToken}`;
  var namedCaptureDelim = r2`\(\?<(?![=!])(?<captureName>[^>]+)>`;
  var captureDelim = r2`${namedCaptureDelim}|(?<unnamed>\()(?!\?)`;
  var token = new RegExp(r2`${namedCaptureDelim}|${recursiveToken}|\(\?|\\?.`, "gsu");
  var overlappingRecursionMsg = "Cannot use multiple overlapping recursions";
  function recursion(pattern, data) {
    const { hiddenCaptures, mode } = {
      hiddenCaptures: [],
      mode: "plugin",
      ...data
    };
    let captureTransfers = data?.captureTransfers ?? /* @__PURE__ */ new Map();
    if (!new RegExp(recursiveToken, "su").test(pattern)) {
      return {
        pattern,
        captureTransfers,
        hiddenCaptures
      };
    }
    if (mode === "plugin" && hasUnescaped(pattern, r2`\(\?\(DEFINE\)`, Context.DEFAULT)) {
      throw new Error("DEFINE groups cannot be used with recursion");
    }
    const addedHiddenCaptures = [];
    const hasNumberedBackref = hasUnescaped(pattern, r2`\\[1-9]`, Context.DEFAULT);
    const groupContentsStartPos = /* @__PURE__ */ new Map();
    const openGroups = [];
    let hasRecursed = false;
    let numCharClassesOpen = 0;
    let numCapturesPassed = 0;
    let match;
    token.lastIndex = 0;
    while (match = token.exec(pattern)) {
      const { 0: m4, groups: { captureName, rDepth, gRNameOrNum, gRDepth } } = match;
      if (m4 === "[") {
        numCharClassesOpen++;
      } else if (!numCharClassesOpen) {
        if (rDepth) {
          assertMaxInBounds(rDepth);
          if (hasRecursed) {
            throw new Error(overlappingRecursionMsg);
          }
          if (hasNumberedBackref) {
            throw new Error(
              // When used in `external` mode by transpilers other than Regex+, backrefs might have
              // gone through conversion from named to numbered, so avoid a misleading error
              `${mode === "external" ? "Backrefs" : "Numbered backrefs"} cannot be used with global recursion`
            );
          }
          const left = pattern.slice(0, match.index);
          const right = pattern.slice(token.lastIndex);
          if (hasUnescaped(right, recursiveToken, Context.DEFAULT)) {
            throw new Error(overlappingRecursionMsg);
          }
          const reps = +rDepth - 1;
          pattern = makeRecursive(
            left,
            right,
            reps,
            false,
            hiddenCaptures,
            addedHiddenCaptures,
            numCapturesPassed
          );
          captureTransfers = mapCaptureTransfers(
            captureTransfers,
            left,
            reps,
            addedHiddenCaptures.length,
            0,
            numCapturesPassed
          );
          break;
        } else if (gRNameOrNum) {
          assertMaxInBounds(gRDepth);
          let isWithinReffedGroup = false;
          for (const g of openGroups) {
            if (g.name === gRNameOrNum || g.num === +gRNameOrNum) {
              isWithinReffedGroup = true;
              if (g.hasRecursedWithin) {
                throw new Error(overlappingRecursionMsg);
              }
              break;
            }
          }
          if (!isWithinReffedGroup) {
            throw new Error(r2`Recursive \g cannot be used outside the referenced group "${mode === "external" ? gRNameOrNum : r2`\g<${gRNameOrNum}&R=${gRDepth}>`}"`);
          }
          const startPos = groupContentsStartPos.get(gRNameOrNum);
          const groupContents = getGroupContents(pattern, startPos);
          if (hasNumberedBackref && hasUnescaped(groupContents, r2`${namedCaptureDelim}|\((?!\?)`, Context.DEFAULT)) {
            throw new Error(
              // When used in `external` mode by transpilers other than Regex+, backrefs might have
              // gone through conversion from named to numbered, so avoid a misleading error
              `${mode === "external" ? "Backrefs" : "Numbered backrefs"} cannot be used with recursion of capturing groups`
            );
          }
          const groupContentsLeft = pattern.slice(startPos, match.index);
          const groupContentsRight = groupContents.slice(groupContentsLeft.length + m4.length);
          const numAddedHiddenCapturesPreExpansion = addedHiddenCaptures.length;
          const reps = +gRDepth - 1;
          const expansion = makeRecursive(
            groupContentsLeft,
            groupContentsRight,
            reps,
            true,
            hiddenCaptures,
            addedHiddenCaptures,
            numCapturesPassed
          );
          captureTransfers = mapCaptureTransfers(
            captureTransfers,
            groupContentsLeft,
            reps,
            addedHiddenCaptures.length - numAddedHiddenCapturesPreExpansion,
            numAddedHiddenCapturesPreExpansion,
            numCapturesPassed
          );
          const pre = pattern.slice(0, startPos);
          const post = pattern.slice(startPos + groupContents.length);
          pattern = `${pre}${expansion}${post}`;
          token.lastIndex += expansion.length - m4.length - groupContentsLeft.length - groupContentsRight.length;
          openGroups.forEach((g) => g.hasRecursedWithin = true);
          hasRecursed = true;
        } else if (captureName) {
          numCapturesPassed++;
          groupContentsStartPos.set(String(numCapturesPassed), token.lastIndex);
          groupContentsStartPos.set(captureName, token.lastIndex);
          openGroups.push({
            num: numCapturesPassed,
            name: captureName
          });
        } else if (m4[0] === "(") {
          const isUnnamedCapture = m4 === "(";
          if (isUnnamedCapture) {
            numCapturesPassed++;
            groupContentsStartPos.set(String(numCapturesPassed), token.lastIndex);
          }
          openGroups.push(isUnnamedCapture ? { num: numCapturesPassed } : {});
        } else if (m4 === ")") {
          openGroups.pop();
        }
      } else if (m4 === "]") {
        numCharClassesOpen--;
      }
    }
    hiddenCaptures.push(...addedHiddenCaptures);
    return {
      pattern,
      captureTransfers,
      hiddenCaptures
    };
  }
  function assertMaxInBounds(max) {
    const errMsg = `Max depth must be integer between 2 and 100; used ${max}`;
    if (!/^[1-9]\d*$/.test(max)) {
      throw new Error(errMsg);
    }
    max = +max;
    if (max < 2 || max > 100) {
      throw new Error(errMsg);
    }
  }
  function makeRecursive(left, right, reps, isSubpattern, hiddenCaptures, addedHiddenCaptures, numCapturesPassed) {
    const namesInRecursed = /* @__PURE__ */ new Set();
    if (isSubpattern) {
      forEachUnescaped(left + right, namedCaptureDelim, ({ groups: { captureName } }) => {
        namesInRecursed.add(captureName);
      }, Context.DEFAULT);
    }
    const rest = [
      reps,
      isSubpattern ? namesInRecursed : null,
      hiddenCaptures,
      addedHiddenCaptures,
      numCapturesPassed
    ];
    return `${left}${repeatWithDepth(`(?:${left}`, "forward", ...rest)}(?:)${repeatWithDepth(`${right})`, "backward", ...rest)}${right}`;
  }
  function repeatWithDepth(pattern, direction, reps, namesInRecursed, hiddenCaptures, addedHiddenCaptures, numCapturesPassed) {
    const startNum = 2;
    const getDepthNum = (i2) => direction === "forward" ? i2 + startNum : reps - i2 + startNum - 1;
    let result = "";
    for (let i2 = 0; i2 < reps; i2++) {
      const depthNum = getDepthNum(i2);
      result += replaceUnescaped(
        pattern,
        r2`${captureDelim}|\\k<(?<backref>[^>]+)>`,
        ({ 0: m4, groups: { captureName, unnamed, backref } }) => {
          if (backref && namesInRecursed && !namesInRecursed.has(backref)) {
            return m4;
          }
          const suffix = `_$${depthNum}`;
          if (unnamed || captureName) {
            const addedCaptureNum = numCapturesPassed + addedHiddenCaptures.length + 1;
            addedHiddenCaptures.push(addedCaptureNum);
            incrementIfAtLeast2(hiddenCaptures, addedCaptureNum);
            return unnamed ? m4 : `(?<${captureName}${suffix}>`;
          }
          return r2`\k<${backref}${suffix}>`;
        },
        Context.DEFAULT
      );
    }
    return result;
  }
  function incrementIfAtLeast2(arr, threshold) {
    for (let i2 = 0; i2 < arr.length; i2++) {
      if (arr[i2] >= threshold) {
        arr[i2]++;
      }
    }
  }
  function mapCaptureTransfers(captureTransfers, left, reps, numCapturesAddedInExpansion, numAddedHiddenCapturesPreExpansion, numCapturesPassed) {
    if (captureTransfers.size && numCapturesAddedInExpansion) {
      let numCapturesInLeft = 0;
      forEachUnescaped(left, captureDelim, () => numCapturesInLeft++, Context.DEFAULT);
      const recursionDelimCaptureNum = numCapturesPassed - numCapturesInLeft + numAddedHiddenCapturesPreExpansion;
      const newCaptureTransfers = /* @__PURE__ */ new Map();
      captureTransfers.forEach((from, to) => {
        const numCapturesInRight = (numCapturesAddedInExpansion - numCapturesInLeft * reps) / reps;
        const numCapturesAddedInLeft = numCapturesInLeft * reps;
        const newTo = to > recursionDelimCaptureNum + numCapturesInLeft ? to + numCapturesAddedInExpansion : to;
        const newFrom = [];
        for (const f2 of from) {
          if (f2 <= recursionDelimCaptureNum) {
            newFrom.push(f2);
          } else if (f2 > recursionDelimCaptureNum + numCapturesInLeft + numCapturesInRight) {
            newFrom.push(f2 + numCapturesAddedInExpansion);
          } else if (f2 <= recursionDelimCaptureNum + numCapturesInLeft) {
            for (let i2 = 0; i2 <= reps; i2++) {
              newFrom.push(f2 + numCapturesInLeft * i2);
            }
          } else {
            for (let i2 = 0; i2 <= reps; i2++) {
              newFrom.push(f2 + numCapturesAddedInLeft + numCapturesInRight * i2);
            }
          }
        }
        newCaptureTransfers.set(newTo, newFrom);
      });
      return newCaptureTransfers;
    }
    return captureTransfers;
  }

  // node_modules/oniguruma-to-es/dist/esm/index.js
  var cp = String.fromCodePoint;
  var r3 = String.raw;
  var envFlags = {};
  var globalRegExp = globalThis.RegExp;
  envFlags.flagGroups = (() => {
    try {
      new globalRegExp("(?i:)");
    } catch {
      return false;
    }
    return true;
  })();
  envFlags.unicodeSets = (() => {
    try {
      new globalRegExp("[[]]", "v");
    } catch {
      return false;
    }
    return true;
  })();
  envFlags.bugFlagVLiteralHyphenIsRange = envFlags.unicodeSets ? (() => {
    try {
      new globalRegExp(r3`[\d\-a]`, "v");
    } catch {
      return true;
    }
    return false;
  })() : false;
  envFlags.bugNestedClassIgnoresNegation = envFlags.unicodeSets && new globalRegExp("[[^a]]", "v").test("a");
  function getNewCurrentFlags(current, { enable, disable }) {
    return {
      dotAll: !disable?.dotAll && !!(enable?.dotAll || current.dotAll),
      ignoreCase: !disable?.ignoreCase && !!(enable?.ignoreCase || current.ignoreCase)
    };
  }
  function getOrInsert(map, key2, defaultValue) {
    if (!map.has(key2)) {
      map.set(key2, defaultValue);
    }
    return map.get(key2);
  }
  function isMinTarget(target, min) {
    return EsVersion[target] >= EsVersion[min];
  }
  function throwIfNullish(value, msg) {
    if (value == null) {
      throw new Error(msg ?? "Value expected");
    }
    return value;
  }
  var EsVersion = {
    ES2025: 2025,
    ES2024: 2024,
    ES2018: 2018
  };
  var Target = (
    /** @type {const} */
    {
      auto: "auto",
      ES2025: "ES2025",
      ES2024: "ES2024",
      ES2018: "ES2018"
    }
  );
  function getOptions(options = {}) {
    if ({}.toString.call(options) !== "[object Object]") {
      throw new Error("Unexpected options");
    }
    if (options.target !== void 0 && !Target[options.target]) {
      throw new Error(`Unexpected target "${options.target}"`);
    }
    const opts = {
      // Sets the level of emulation rigor/strictness.
      accuracy: "default",
      // Disables advanced emulation that relies on returning a `RegExp` subclass, resulting in
      // certain patterns not being emulatable.
      avoidSubclass: false,
      // Oniguruma flags; a string with `i`, `m`, `x`, `D`, `S`, `W`, `y{g}` in any order (all
      // optional). Oniguruma's `m` is equivalent to JavaScript's `s` (`dotAll`).
      flags: "",
      // Include JavaScript flag `g` (`global`) in the result.
      global: false,
      // Include JavaScript flag `d` (`hasIndices`) in the result.
      hasIndices: false,
      // Delay regex construction until first use if the transpiled pattern is at least this length.
      lazyCompileLength: Infinity,
      // JavaScript version used for generated regexes. Using `auto` detects the best value based on
      // your environment. Later targets allow faster processing, simpler generated source, and
      // support for additional features.
      target: "auto",
      // Disables minifications that simplify the pattern without changing the meaning.
      verbose: false,
      ...options,
      // Advanced options that override standard behavior, error checking, and flags when enabled.
      rules: {
        // Useful with TextMate grammars that merge backreferences across patterns.
        allowOrphanBackrefs: false,
        // Use ASCII `\b` and `\B`, which increases search performance of generated regexes.
        asciiWordBoundaries: false,
        // Allow unnamed captures and numbered calls (backreferences and subroutines) when using
        // named capture. This is Oniguruma option `ONIG_OPTION_CAPTURE_GROUP`; on by default in
        // `vscode-oniguruma`.
        captureGroup: false,
        // Change the recursion depth limit from Oniguruma's `20` to an integer `2`–`20`.
        recursionLimit: 20,
        // `^` as `\A`; `$` as`\Z`. Improves search performance of generated regexes without changing
        // the meaning if searching line by line. This is Oniguruma option `ONIG_OPTION_SINGLELINE`.
        singleline: false,
        ...options.rules
      }
    };
    if (opts.target === "auto") {
      opts.target = envFlags.flagGroups ? "ES2025" : envFlags.unicodeSets ? "ES2024" : "ES2018";
    }
    return opts;
  }
  var asciiSpaceChar = "[	-\r ]";
  var CharsWithoutIgnoreCaseExpansion = /* @__PURE__ */ new Set([
    cp(304),
    // İ
    cp(305)
    // ı
  ]);
  var defaultWordChar = r3`[\p{L}\p{M}\p{N}\p{Pc}]`;
  function getIgnoreCaseMatchChars(char) {
    if (CharsWithoutIgnoreCaseExpansion.has(char)) {
      return [char];
    }
    const set = /* @__PURE__ */ new Set();
    const lower = char.toLowerCase();
    const upper = lower.toUpperCase();
    const title = LowerToTitleCaseMap.get(lower);
    const altLower = LowerToAlternativeLowerCaseMap.get(lower);
    const altUpper = LowerToAlternativeUpperCaseMap.get(lower);
    if ([...upper].length === 1) {
      set.add(upper);
    }
    altUpper && set.add(altUpper);
    title && set.add(title);
    set.add(lower);
    altLower && set.add(altLower);
    return [...set];
  }
  var JsUnicodePropertyMap = /* @__PURE__ */ new Map(
    `C Other
Cc Control cntrl
Cf Format
Cn Unassigned
Co Private_Use
Cs Surrogate
L Letter
LC Cased_Letter
Ll Lowercase_Letter
Lm Modifier_Letter
Lo Other_Letter
Lt Titlecase_Letter
Lu Uppercase_Letter
M Mark Combining_Mark
Mc Spacing_Mark
Me Enclosing_Mark
Mn Nonspacing_Mark
N Number
Nd Decimal_Number digit
Nl Letter_Number
No Other_Number
P Punctuation punct
Pc Connector_Punctuation
Pd Dash_Punctuation
Pe Close_Punctuation
Pf Final_Punctuation
Pi Initial_Punctuation
Po Other_Punctuation
Ps Open_Punctuation
S Symbol
Sc Currency_Symbol
Sk Modifier_Symbol
Sm Math_Symbol
So Other_Symbol
Z Separator
Zl Line_Separator
Zp Paragraph_Separator
Zs Space_Separator
ASCII
ASCII_Hex_Digit AHex
Alphabetic Alpha
Any
Assigned
Bidi_Control Bidi_C
Bidi_Mirrored Bidi_M
Case_Ignorable CI
Cased
Changes_When_Casefolded CWCF
Changes_When_Casemapped CWCM
Changes_When_Lowercased CWL
Changes_When_NFKC_Casefolded CWKCF
Changes_When_Titlecased CWT
Changes_When_Uppercased CWU
Dash
Default_Ignorable_Code_Point DI
Deprecated Dep
Diacritic Dia
Emoji
Emoji_Component EComp
Emoji_Modifier EMod
Emoji_Modifier_Base EBase
Emoji_Presentation EPres
Extended_Pictographic ExtPict
Extender Ext
Grapheme_Base Gr_Base
Grapheme_Extend Gr_Ext
Hex_Digit Hex
IDS_Binary_Operator IDSB
IDS_Trinary_Operator IDST
ID_Continue IDC
ID_Start IDS
Ideographic Ideo
Join_Control Join_C
Logical_Order_Exception LOE
Lowercase Lower
Math
Noncharacter_Code_Point NChar
Pattern_Syntax Pat_Syn
Pattern_White_Space Pat_WS
Quotation_Mark QMark
Radical
Regional_Indicator RI
Sentence_Terminal STerm
Soft_Dotted SD
Terminal_Punctuation Term
Unified_Ideograph UIdeo
Uppercase Upper
Variation_Selector VS
White_Space space
XID_Continue XIDC
XID_Start XIDS`.split(/\s/).map((p2) => [w3(p2), p2])
  );
  var LowerToAlternativeLowerCaseMap = /* @__PURE__ */ new Map([
    ["s", cp(383)],
    // s, ſ
    [cp(383), "s"]
    // ſ, s
  ]);
  var LowerToAlternativeUpperCaseMap = /* @__PURE__ */ new Map([
    [cp(223), cp(7838)],
    // ß, ẞ
    [cp(107), cp(8490)],
    // k, K (Kelvin)
    [cp(229), cp(8491)],
    // å, Å (Angstrom)
    [cp(969), cp(8486)]
    // ω, Ω (Ohm)
  ]);
  var LowerToTitleCaseMap = new Map([
    titleEntry(453),
    titleEntry(456),
    titleEntry(459),
    titleEntry(498),
    ...titleRange(8072, 8079),
    ...titleRange(8088, 8095),
    ...titleRange(8104, 8111),
    titleEntry(8124),
    titleEntry(8140),
    titleEntry(8188)
  ]);
  var PosixClassMap = /* @__PURE__ */ new Map([
    ["alnum", r3`[\p{Alpha}\p{Nd}]`],
    ["alpha", r3`\p{Alpha}`],
    ["ascii", r3`\p{ASCII}`],
    ["blank", r3`[\p{Zs}\t]`],
    ["cntrl", r3`\p{Cc}`],
    ["digit", r3`\p{Nd}`],
    ["graph", r3`[\P{space}&&\P{Cc}&&\P{Cn}&&\P{Cs}]`],
    ["lower", r3`\p{Lower}`],
    ["print", r3`[[\P{space}&&\P{Cc}&&\P{Cn}&&\P{Cs}]\p{Zs}]`],
    ["punct", r3`[\p{P}\p{S}]`],
    // Updated value from Onig 6.9.9; changed from Unicode `\p{punct}`
    ["space", r3`\p{space}`],
    ["upper", r3`\p{Upper}`],
    ["word", r3`[\p{Alpha}\p{M}\p{Nd}\p{Pc}]`],
    ["xdigit", r3`\p{AHex}`]
  ]);
  function range(start, end) {
    const range2 = [];
    for (let i2 = start; i2 <= end; i2++) {
      range2.push(i2);
    }
    return range2;
  }
  function titleEntry(codePoint) {
    const char = cp(codePoint);
    return [char.toLowerCase(), char];
  }
  function titleRange(start, end) {
    return range(start, end).map((codePoint) => titleEntry(codePoint));
  }
  var UnicodePropertiesWithSpecificCase = /* @__PURE__ */ new Set([
    "Lower",
    "Lowercase",
    "Upper",
    "Uppercase",
    "Ll",
    "Lowercase_Letter",
    "Lt",
    "Titlecase_Letter",
    "Lu",
    "Uppercase_Letter"
    // The `Changes_When_*` properties (and their aliases) could be included, but they're very rare.
    // Some other properties include a handful of chars with specific cases only, but these chars are
    // generally extreme edge cases and using such properties case insensitively generally produces
    // undesired behavior anyway
  ]);
  function transform(ast, options) {
    const opts = {
      // A couple edge cases exist where options `accuracy` and `bestEffortTarget` are used:
      // - `CharacterSet` kind `text_segment` (`\X`): An exact representation would require heavy
      //   Unicode data; a best-effort approximation requires knowing the target.
      // - `CharacterSet` kind `posix` with values `graph` and `print`: Their complex Unicode
      //   representations would be hard to change to ASCII versions after the fact in the generator
      //   based on `target`/`accuracy`, so produce the appropriate structure here.
      accuracy: "default",
      asciiWordBoundaries: false,
      avoidSubclass: false,
      bestEffortTarget: "ES2025",
      ...options
    };
    addParentProperties(ast);
    const firstPassState = {
      accuracy: opts.accuracy,
      asciiWordBoundaries: opts.asciiWordBoundaries,
      avoidSubclass: opts.avoidSubclass,
      flagDirectivesByAlt: /* @__PURE__ */ new Map(),
      jsGroupNameMap: /* @__PURE__ */ new Map(),
      minTargetEs2024: isMinTarget(opts.bestEffortTarget, "ES2024"),
      passedLookbehind: false,
      strategy: null,
      // Subroutines can appear before the groups they ref, so collect reffed nodes for a second pass 
      subroutineRefMap: /* @__PURE__ */ new Map(),
      supportedGNodes: /* @__PURE__ */ new Set(),
      digitIsAscii: ast.flags.digitIsAscii,
      spaceIsAscii: ast.flags.spaceIsAscii,
      wordIsAscii: ast.flags.wordIsAscii
    };
    S3(ast, FirstPassVisitor, firstPassState);
    const globalFlags = {
      dotAll: ast.flags.dotAll,
      ignoreCase: ast.flags.ignoreCase
    };
    const secondPassState = {
      currentFlags: globalFlags,
      prevFlags: null,
      globalFlags,
      groupOriginByCopy: /* @__PURE__ */ new Map(),
      groupsByName: /* @__PURE__ */ new Map(),
      multiplexCapturesToLeftByRef: /* @__PURE__ */ new Map(),
      openRefs: /* @__PURE__ */ new Map(),
      reffedNodesByReferencer: /* @__PURE__ */ new Map(),
      subroutineRefMap: firstPassState.subroutineRefMap
    };
    S3(ast, SecondPassVisitor, secondPassState);
    const thirdPassState = {
      groupsByName: secondPassState.groupsByName,
      highestOrphanBackref: 0,
      numCapturesToLeft: 0,
      reffedNodesByReferencer: secondPassState.reffedNodesByReferencer
    };
    S3(ast, ThirdPassVisitor, thirdPassState);
    ast._originMap = secondPassState.groupOriginByCopy;
    ast._strategy = firstPassState.strategy;
    return ast;
  }
  var FirstPassVisitor = {
    AbsenceFunction({ node, parent, replaceWith }) {
      const { body: body3, kind } = node;
      if (kind === "repeater") {
        const innerGroup = A2();
        innerGroup.body[0].body.push(
          // Insert own alts as `body`
          K3({ negate: true, body: body3 }),
          Q3("Any")
        );
        const outerGroup = A2();
        outerGroup.body[0].body.push(
          _3("greedy", 0, Infinity, innerGroup)
        );
        replaceWith(setParentDeep(outerGroup, parent), { traverse: true });
      } else {
        throw new Error(`Unsupported absence function "(?~|"`);
      }
    },
    Alternative: {
      enter({ node, parent, key: key2 }, { flagDirectivesByAlt }) {
        const flagDirectives = node.body.filter((el) => el.kind === "flags");
        for (let i2 = key2 + 1; i2 < parent.body.length; i2++) {
          const forwardSiblingAlt = parent.body[i2];
          getOrInsert(flagDirectivesByAlt, forwardSiblingAlt, []).push(...flagDirectives);
        }
      },
      exit({ node }, { flagDirectivesByAlt }) {
        if (flagDirectivesByAlt.get(node)?.length) {
          const flags = getCombinedFlagModsFromFlagNodes(flagDirectivesByAlt.get(node));
          if (flags) {
            const flagGroup = A2({ flags });
            flagGroup.body[0].body = node.body;
            node.body = [setParentDeep(flagGroup, node)];
          }
        }
      }
    },
    Assertion({ node, parent, key: key2, container, root: root2, remove, replaceWith }, state) {
      const { kind, negate } = node;
      const { asciiWordBoundaries, avoidSubclass, supportedGNodes, wordIsAscii } = state;
      if (kind === "text_segment_boundary") {
        throw new Error(`Unsupported text segment boundary "\\${negate ? "Y" : "y"}"`);
      } else if (kind === "line_end") {
        replaceWith(setParentDeep(K3({ body: [
          b3({ body: [F3("string_end")] }),
          b3({ body: [m3(10)] })
          // `\n`
        ] }), parent));
      } else if (kind === "line_start") {
        replaceWith(setParentDeep(parseFragment(r3`(?<=\A|\n(?!\z))`, { skipLookbehindValidation: true }), parent));
      } else if (kind === "search_start") {
        if (supportedGNodes.has(node)) {
          root2.flags.sticky = true;
          remove();
        } else {
          const prev = container[key2 - 1];
          if (prev && isAlwaysNonZeroLength(prev)) {
            replaceWith(setParentDeep(K3({ negate: true }), parent));
          } else if (avoidSubclass) {
            throw new Error(r3`Uses "\G" in a way that requires a subclass`);
          } else {
            replaceWith(setParent(F3("string_start"), parent));
            state.strategy = "clip_search";
          }
        }
      } else if (kind === "string_end" || kind === "string_start") {
      } else if (kind === "string_end_newline") {
        replaceWith(setParentDeep(parseFragment(r3`(?=\n?\z)`), parent));
      } else if (kind === "word_boundary") {
        if (!wordIsAscii && !asciiWordBoundaries) {
          const b4 = `(?:(?<=${defaultWordChar})(?!${defaultWordChar})|(?<!${defaultWordChar})(?=${defaultWordChar}))`;
          const B4 = `(?:(?<=${defaultWordChar})(?=${defaultWordChar})|(?<!${defaultWordChar})(?!${defaultWordChar}))`;
          replaceWith(setParentDeep(parseFragment(negate ? B4 : b4), parent));
        }
      } else {
        throw new Error(`Unexpected assertion kind "${kind}"`);
      }
    },
    Backreference({ node }, { jsGroupNameMap }) {
      let { ref } = node;
      if (typeof ref === "string" && !isValidJsGroupName(ref)) {
        ref = getAndStoreJsGroupName(ref, jsGroupNameMap);
        node.ref = ref;
      }
    },
    CapturingGroup({ node }, { jsGroupNameMap, subroutineRefMap }) {
      let { name } = node;
      if (name && !isValidJsGroupName(name)) {
        name = getAndStoreJsGroupName(name, jsGroupNameMap);
        node.name = name;
      }
      subroutineRefMap.set(node.number, node);
      if (name) {
        subroutineRefMap.set(name, node);
      }
    },
    CharacterClassRange({ node, parent, replaceWith }) {
      if (parent.kind === "intersection") {
        const cc = C3({ body: [node] });
        replaceWith(setParentDeep(cc, parent), { traverse: true });
      }
    },
    CharacterSet({ node, parent, replaceWith }, { accuracy, minTargetEs2024, digitIsAscii, spaceIsAscii, wordIsAscii }) {
      const { kind, negate, value } = node;
      if (digitIsAscii && (kind === "digit" || value === "digit")) {
        replaceWith(setParent(E3("digit", { negate }), parent));
        return;
      }
      if (spaceIsAscii && (kind === "space" || value === "space")) {
        replaceWith(setParentDeep(setNegate(parseFragment(asciiSpaceChar), negate), parent));
        return;
      }
      if (wordIsAscii && (kind === "word" || value === "word")) {
        replaceWith(setParent(E3("word", { negate }), parent));
        return;
      }
      if (kind === "any") {
        replaceWith(setParent(Q3("Any"), parent));
      } else if (kind === "digit") {
        replaceWith(setParent(Q3("Nd", { negate }), parent));
      } else if (kind === "dot") {
      } else if (kind === "text_segment") {
        if (accuracy === "strict") {
          throw new Error(r3`Use of "\X" requires non-strict accuracy`);
        }
        const eBase = "\\p{Emoji}(?:\\p{EMod}|\\uFE0F\\u20E3?|[\\x{E0020}-\\x{E007E}]+\\x{E007F})?";
        const emoji = r3`\p{RI}{2}|${eBase}(?:\u200D${eBase})*`;
        replaceWith(setParentDeep(parseFragment(
          // Close approximation of an extended grapheme cluster; see <unicode.org/reports/tr29/>
          r3`(?>\r\n|${minTargetEs2024 ? r3`\p{RGI_Emoji}` : emoji}|\P{M}\p{M}*)`,
          // Allow JS property `RGI_Emoji` through
          { skipPropertyNameValidation: true }
        ), parent));
      } else if (kind === "hex") {
        replaceWith(setParent(Q3("AHex", { negate }), parent));
      } else if (kind === "newline") {
        replaceWith(setParentDeep(parseFragment(negate ? "[^\n]" : "(?>\r\n?|[\n\v\f\x85\u2028\u2029])"), parent));
      } else if (kind === "posix") {
        if (!minTargetEs2024 && (value === "graph" || value === "print")) {
          if (accuracy === "strict") {
            throw new Error(`POSIX class "${value}" requires min target ES2024 or non-strict accuracy`);
          }
          let ascii = {
            graph: "!-~",
            print: " -~"
          }[value];
          if (negate) {
            ascii = `\0-${cp(ascii.codePointAt(0) - 1)}${cp(ascii.codePointAt(2) + 1)}-\u{10FFFF}`;
          }
          replaceWith(setParentDeep(parseFragment(`[${ascii}]`), parent));
        } else {
          replaceWith(setParentDeep(setNegate(parseFragment(PosixClassMap.get(value)), negate), parent));
        }
      } else if (kind === "property") {
        if (!JsUnicodePropertyMap.has(w3(value))) {
          node.key = "sc";
        }
      } else if (kind === "space") {
        replaceWith(setParent(Q3("space", { negate }), parent));
      } else if (kind === "word") {
        replaceWith(setParentDeep(setNegate(parseFragment(defaultWordChar), negate), parent));
      } else {
        throw new Error(`Unexpected character set kind "${kind}"`);
      }
    },
    Directive({ node, parent, root: root2, remove, replaceWith, removeAllPrevSiblings, removeAllNextSiblings }) {
      const { kind, flags } = node;
      if (kind === "flags") {
        if (!flags.enable && !flags.disable) {
          remove();
        } else {
          const flagGroup = A2({ flags });
          flagGroup.body[0].body = removeAllNextSiblings();
          replaceWith(setParentDeep(flagGroup, parent), { traverse: true });
        }
      } else if (kind === "keep") {
        const firstAlt = root2.body[0];
        const hasWrapperGroup = root2.body.length === 1 && // Not emulatable if within a `CapturingGroup`
        o2(firstAlt, { type: "Group" }) && firstAlt.body[0].body.length === 1;
        const topLevel = hasWrapperGroup ? firstAlt.body[0] : root2;
        if (parent.parent !== topLevel || topLevel.body.length > 1) {
          throw new Error(r3`Uses "\K" in a way that's unsupported`);
        }
        const lookbehind = K3({ behind: true });
        lookbehind.body[0].body = removeAllPrevSiblings();
        replaceWith(setParentDeep(lookbehind, parent));
      } else {
        throw new Error(`Unexpected directive kind "${kind}"`);
      }
    },
    Flags({ node, parent }) {
      if (node.posixIsAscii) {
        throw new Error('Unsupported flag "P"');
      }
      if (node.textSegmentMode === "word") {
        throw new Error('Unsupported flag "y{w}"');
      }
      [
        "digitIsAscii",
        // Flag D
        "extended",
        // Flag x
        "posixIsAscii",
        // Flag P
        "spaceIsAscii",
        // Flag S
        "wordIsAscii",
        // Flag W
        "textSegmentMode"
        // Flag y{g} or y{w}
      ].forEach((f2) => delete node[f2]);
      Object.assign(node, {
        // JS flag g; no Onig equiv
        global: false,
        // JS flag d; no Onig equiv
        hasIndices: false,
        // JS flag m; no Onig equiv but its behavior is always on in Onig. Onig's only line break
        // char is line feed, unlike JS, so this flag isn't used since it would produce inaccurate
        // results (also allows `^` and `$` to be used in the generator for string start and end)
        multiline: false,
        // JS flag y; no Onig equiv, but used for `\G` emulation
        sticky: node.sticky ?? false
        // Note: Regex+ doesn't allow explicitly adding flags it handles implicitly, so leave out
        // properties `unicode` (JS flag u) and `unicodeSets` (JS flag v). Keep the existing values
        // for `ignoreCase` (flag i) and `dotAll` (JS flag s, but Onig flag m)
      });
      parent.options = {
        disable: {
          // Onig uses different rules for flag x than Regex+, so disable the implicit flag
          x: true,
          // Onig has no flag to control "named capture only" mode but contextually applies its
          // behavior when named capturing is used, so disable Regex+'s implicit flag for it
          n: true
        },
        force: {
          // Always add flag v because we're generating an AST that relies on it (it enables JS
          // support for Onig features nested classes, intersection, Unicode properties, etc.).
          // However, the generator might disable flag v based on its `target` option
          v: true
        }
      };
    },
    Group({ node }) {
      if (!node.flags) {
        return;
      }
      const { enable, disable } = node.flags;
      enable?.extended && delete enable.extended;
      disable?.extended && delete disable.extended;
      enable?.dotAll && disable?.dotAll && delete enable.dotAll;
      enable?.ignoreCase && disable?.ignoreCase && delete enable.ignoreCase;
      enable && !Object.keys(enable).length && delete node.flags.enable;
      disable && !Object.keys(disable).length && delete node.flags.disable;
      !node.flags.enable && !node.flags.disable && delete node.flags;
    },
    LookaroundAssertion({ node }, state) {
      const { kind } = node;
      if (kind === "lookbehind") {
        state.passedLookbehind = true;
      }
    },
    NamedCallout({ node, parent, replaceWith }) {
      const { kind } = node;
      if (kind === "fail") {
        replaceWith(setParentDeep(K3({ negate: true }), parent));
      } else {
        throw new Error(`Unsupported named callout "(*${kind.toUpperCase()}"`);
      }
    },
    Quantifier({ node }) {
      if (node.body.type === "Quantifier") {
        const group = A2();
        group.body[0].body.push(node.body);
        node.body = setParentDeep(group, node);
      }
    },
    Regex: {
      enter({ node }, { supportedGNodes }) {
        const leadingGs = [];
        let hasAltWithLeadG = false;
        let hasAltWithoutLeadG = false;
        for (const alt of node.body) {
          if (alt.body.length === 1 && alt.body[0].kind === "search_start") {
            alt.body.pop();
          } else {
            const leadingG = getLeadingG(alt.body);
            if (leadingG) {
              hasAltWithLeadG = true;
              Array.isArray(leadingG) ? leadingGs.push(...leadingG) : leadingGs.push(leadingG);
            } else {
              hasAltWithoutLeadG = true;
            }
          }
        }
        if (hasAltWithLeadG && !hasAltWithoutLeadG) {
          leadingGs.forEach((g) => supportedGNodes.add(g));
        }
      },
      exit(_4, { accuracy, passedLookbehind, strategy }) {
        if (accuracy === "strict" && passedLookbehind && strategy) {
          throw new Error(r3`Uses "\G" in a way that requires non-strict accuracy`);
        }
      }
    },
    Subroutine({ node }, { jsGroupNameMap }) {
      let { ref } = node;
      if (typeof ref === "string" && !isValidJsGroupName(ref)) {
        ref = getAndStoreJsGroupName(ref, jsGroupNameMap);
        node.ref = ref;
      }
    }
  };
  var SecondPassVisitor = {
    Backreference({ node }, { multiplexCapturesToLeftByRef, reffedNodesByReferencer }) {
      const { orphan, ref } = node;
      if (!orphan) {
        reffedNodesByReferencer.set(node, [...multiplexCapturesToLeftByRef.get(ref).map(({ node: node2 }) => node2)]);
      }
    },
    CapturingGroup: {
      enter({
        node,
        parent,
        replaceWith,
        skip
      }, {
        groupOriginByCopy,
        groupsByName,
        multiplexCapturesToLeftByRef,
        openRefs,
        reffedNodesByReferencer
      }) {
        const origin = groupOriginByCopy.get(node);
        if (origin && openRefs.has(node.number)) {
          const recursion2 = setParent(createRecursion(node.number), parent);
          reffedNodesByReferencer.set(recursion2, openRefs.get(node.number));
          replaceWith(recursion2);
          return;
        }
        openRefs.set(node.number, node);
        multiplexCapturesToLeftByRef.set(node.number, []);
        if (node.name) {
          getOrInsert(multiplexCapturesToLeftByRef, node.name, []);
        }
        const multiplexNodes = multiplexCapturesToLeftByRef.get(node.name ?? node.number);
        for (let i2 = 0; i2 < multiplexNodes.length; i2++) {
          const multiplex = multiplexNodes[i2];
          if (
            // This group is from subroutine expansion, and there's a multiplex value from either the
            // origin node or a prior subroutine expansion group with the same origin
            origin === multiplex.node || origin && origin === multiplex.origin || // This group is not from subroutine expansion, and it comes after a subroutine expansion
            // group that refers to this group
            node === multiplex.origin
          ) {
            multiplexNodes.splice(i2, 1);
            break;
          }
        }
        multiplexCapturesToLeftByRef.get(node.number).push({ node, origin });
        if (node.name) {
          multiplexCapturesToLeftByRef.get(node.name).push({ node, origin });
        }
        if (node.name) {
          const groupsWithSameName = getOrInsert(groupsByName, node.name, /* @__PURE__ */ new Map());
          let hasDuplicateNameToRemove = false;
          if (origin) {
            hasDuplicateNameToRemove = true;
          } else {
            for (const groupInfo of groupsWithSameName.values()) {
              if (!groupInfo.hasDuplicateNameToRemove) {
                hasDuplicateNameToRemove = true;
                break;
              }
            }
          }
          groupsByName.get(node.name).set(node, { node, hasDuplicateNameToRemove });
        }
      },
      exit({ node }, { openRefs }) {
        if (openRefs.get(node.number) === node) {
          openRefs.delete(node.number);
        }
      }
    },
    Group: {
      enter({ node }, state) {
        state.prevFlags = state.currentFlags;
        if (node.flags) {
          state.currentFlags = getNewCurrentFlags(state.currentFlags, node.flags);
        }
      },
      exit(_4, state) {
        state.currentFlags = state.prevFlags;
      }
    },
    Subroutine({ node, parent, replaceWith }, state) {
      const { isRecursive, ref } = node;
      if (isRecursive) {
        let reffed = parent;
        while (reffed = reffed.parent) {
          if (reffed.type === "CapturingGroup" && (reffed.name === ref || reffed.number === ref)) {
            break;
          }
        }
        state.reffedNodesByReferencer.set(node, reffed);
        return;
      }
      const reffedGroupNode = state.subroutineRefMap.get(ref);
      const isGlobalRecursion = ref === 0;
      const expandedSubroutine = isGlobalRecursion ? createRecursion(0) : (
        // The reffed group might itself contain subroutines, which are expanded during sub-traversal
        cloneCapturingGroup(reffedGroupNode, state.groupOriginByCopy, null)
      );
      let replacement = expandedSubroutine;
      if (!isGlobalRecursion) {
        const reffedGroupFlagMods = getCombinedFlagModsFromFlagNodes(getAllParents(
          reffedGroupNode,
          (p2) => p2.type === "Group" && !!p2.flags
        ));
        const reffedGroupFlags = reffedGroupFlagMods ? getNewCurrentFlags(state.globalFlags, reffedGroupFlagMods) : state.globalFlags;
        if (!areFlagsEqual(reffedGroupFlags, state.currentFlags)) {
          replacement = A2({
            flags: getFlagModsFromFlags(reffedGroupFlags)
          });
          replacement.body[0].body.push(expandedSubroutine);
        }
      }
      replaceWith(setParentDeep(replacement, parent), { traverse: !isGlobalRecursion });
    }
  };
  var ThirdPassVisitor = {
    Backreference({ node, parent, replaceWith }, state) {
      if (node.orphan) {
        state.highestOrphanBackref = Math.max(state.highestOrphanBackref, node.ref);
        return;
      }
      const reffedNodes = state.reffedNodesByReferencer.get(node);
      const participants = reffedNodes.filter((reffed) => canParticipateWithNode(reffed, node));
      if (!participants.length) {
        replaceWith(setParentDeep(K3({ negate: true }), parent));
      } else if (participants.length > 1) {
        const group = A2({
          atomic: true,
          body: participants.reverse().map((reffed) => b3({
            body: [k3(reffed.number)]
          }))
        });
        replaceWith(setParentDeep(group, parent));
      } else {
        node.ref = participants[0].number;
      }
    },
    CapturingGroup({ node }, state) {
      node.number = ++state.numCapturesToLeft;
      if (node.name) {
        if (state.groupsByName.get(node.name).get(node).hasDuplicateNameToRemove) {
          delete node.name;
        }
      }
    },
    Regex: {
      exit({ node }, state) {
        const numCapsNeeded = Math.max(state.highestOrphanBackref - state.numCapturesToLeft, 0);
        for (let i2 = 0; i2 < numCapsNeeded; i2++) {
          const emptyCapture = P3();
          node.body.at(-1).body.push(emptyCapture);
        }
      }
    },
    Subroutine({ node }, state) {
      if (!node.isRecursive || node.ref === 0) {
        return;
      }
      node.ref = state.reffedNodesByReferencer.get(node).number;
    }
  };
  function addParentProperties(root2) {
    S3(root2, {
      "*"({ node, parent }) {
        node.parent = parent;
      }
    });
  }
  function areFlagsEqual(a2, b4) {
    return a2.dotAll === b4.dotAll && a2.ignoreCase === b4.ignoreCase;
  }
  function canParticipateWithNode(capture, node) {
    let rightmostPoint = node;
    do {
      if (rightmostPoint.type === "Regex") {
        return false;
      }
      if (rightmostPoint.type === "Alternative") {
        continue;
      }
      if (rightmostPoint === capture) {
        return false;
      }
      const kidsOfParent = getKids(rightmostPoint.parent);
      for (const kid of kidsOfParent) {
        if (kid === rightmostPoint) {
          break;
        }
        if (kid === capture || isAncestorOf(kid, capture)) {
          return true;
        }
      }
    } while (rightmostPoint = rightmostPoint.parent);
    throw new Error("Unexpected path");
  }
  function cloneCapturingGroup(obj, originMap, up, up2) {
    const store = Array.isArray(obj) ? [] : {};
    for (const [key2, value] of Object.entries(obj)) {
      if (key2 === "parent") {
        store.parent = Array.isArray(up) ? up2 : up;
      } else if (value && typeof value === "object") {
        store[key2] = cloneCapturingGroup(value, originMap, store, up);
      } else {
        if (key2 === "type" && value === "CapturingGroup") {
          originMap.set(store, originMap.get(obj) ?? obj);
        }
        store[key2] = value;
      }
    }
    return store;
  }
  function createRecursion(ref) {
    const node = O2(ref);
    node.isRecursive = true;
    return node;
  }
  function getAllParents(node, filterFn) {
    const results = [];
    while (node = node.parent) {
      if (!filterFn || filterFn(node)) {
        results.push(node);
      }
    }
    return results;
  }
  function getAndStoreJsGroupName(name, map) {
    if (map.has(name)) {
      return map.get(name);
    }
    const jsName = `$${map.size}_${name.replace(/^[^$_\p{IDS}]|[^$\u200C\u200D\p{IDC}]/ug, "_")}`;
    map.set(name, jsName);
    return jsName;
  }
  function getCombinedFlagModsFromFlagNodes(flagNodes) {
    const flagProps = ["dotAll", "ignoreCase"];
    const combinedFlags = { enable: {}, disable: {} };
    flagNodes.forEach(({ flags }) => {
      flagProps.forEach((prop) => {
        if (flags.enable?.[prop]) {
          delete combinedFlags.disable[prop];
          combinedFlags.enable[prop] = true;
        }
        if (flags.disable?.[prop]) {
          combinedFlags.disable[prop] = true;
        }
      });
    });
    if (!Object.keys(combinedFlags.enable).length) {
      delete combinedFlags.enable;
    }
    if (!Object.keys(combinedFlags.disable).length) {
      delete combinedFlags.disable;
    }
    if (combinedFlags.enable || combinedFlags.disable) {
      return combinedFlags;
    }
    return null;
  }
  function getFlagModsFromFlags({ dotAll, ignoreCase }) {
    const mods = {};
    if (dotAll || ignoreCase) {
      mods.enable = {};
      dotAll && (mods.enable.dotAll = true);
      ignoreCase && (mods.enable.ignoreCase = true);
    }
    if (!dotAll || !ignoreCase) {
      mods.disable = {};
      !dotAll && (mods.disable.dotAll = true);
      !ignoreCase && (mods.disable.ignoreCase = true);
    }
    return mods;
  }
  function getKids(node) {
    if (!node) {
      throw new Error("Node expected");
    }
    const { body: body3 } = node;
    return Array.isArray(body3) ? body3 : body3 ? [body3] : null;
  }
  function getLeadingG(els) {
    const firstToConsider = els.find((el) => el.kind === "search_start" || isLoneGLookaround(el, { negate: false }) || !isAlwaysZeroLength(el));
    if (!firstToConsider) {
      return null;
    }
    if (firstToConsider.kind === "search_start") {
      return firstToConsider;
    }
    if (firstToConsider.type === "LookaroundAssertion") {
      return firstToConsider.body[0].body[0];
    }
    if (firstToConsider.type === "CapturingGroup" || firstToConsider.type === "Group") {
      const gNodesForGroup = [];
      for (const alt of firstToConsider.body) {
        const leadingG = getLeadingG(alt.body);
        if (!leadingG) {
          return null;
        }
        Array.isArray(leadingG) ? gNodesForGroup.push(...leadingG) : gNodesForGroup.push(leadingG);
      }
      return gNodesForGroup;
    }
    return null;
  }
  function isAncestorOf(node, descendant) {
    const kids = getKids(node) ?? [];
    for (const kid of kids) {
      if (kid === descendant || isAncestorOf(kid, descendant)) {
        return true;
      }
    }
    return false;
  }
  function isAlwaysZeroLength({ type }) {
    return type === "Assertion" || type === "Directive" || type === "LookaroundAssertion";
  }
  function isAlwaysNonZeroLength(node) {
    const types = [
      "Character",
      "CharacterClass",
      "CharacterSet"
    ];
    return types.includes(node.type) || node.type === "Quantifier" && node.min && types.includes(node.body.type);
  }
  function isLoneGLookaround(node, options) {
    const opts = {
      negate: null,
      ...options
    };
    return node.type === "LookaroundAssertion" && (opts.negate === null || node.negate === opts.negate) && node.body.length === 1 && o2(node.body[0], {
      type: "Assertion",
      kind: "search_start"
    });
  }
  function isValidJsGroupName(name) {
    return /^[$_\p{IDS}][$\u200C\u200D\p{IDC}]*$/u.test(name);
  }
  function parseFragment(pattern, options) {
    const ast = J3(pattern, {
      ...options,
      // Providing a custom set of Unicode property names avoids converting some JS Unicode
      // properties (ex: `\p{Alpha}`) to Onig POSIX classes
      unicodePropertyMap: JsUnicodePropertyMap
    });
    const alts = ast.body;
    if (alts.length > 1 || alts[0].body.length > 1) {
      return A2({ body: alts });
    }
    return alts[0].body[0];
  }
  function setNegate(node, negate) {
    node.negate = negate;
    return node;
  }
  function setParent(node, parent) {
    node.parent = parent;
    return node;
  }
  function setParentDeep(node, parent) {
    addParentProperties(node);
    node.parent = parent;
    return node;
  }
  function generate(ast, options) {
    const opts = getOptions(options);
    const minTargetEs2024 = isMinTarget(opts.target, "ES2024");
    const minTargetEs2025 = isMinTarget(opts.target, "ES2025");
    const recursionLimit = opts.rules.recursionLimit;
    if (!Number.isInteger(recursionLimit) || recursionLimit < 2 || recursionLimit > 20) {
      throw new Error("Invalid recursionLimit; use 2-20");
    }
    let hasCaseInsensitiveNode = null;
    let hasCaseSensitiveNode = null;
    if (!minTargetEs2025) {
      const iStack = [ast.flags.ignoreCase];
      S3(ast, FlagModifierVisitor, {
        getCurrentModI: () => iStack.at(-1),
        popModI() {
          iStack.pop();
        },
        pushModI(isIOn) {
          iStack.push(isIOn);
        },
        setHasCasedChar() {
          if (iStack.at(-1)) {
            hasCaseInsensitiveNode = true;
          } else {
            hasCaseSensitiveNode = true;
          }
        }
      });
    }
    const appliedGlobalFlags = {
      dotAll: ast.flags.dotAll,
      // - Turn global flag i on if a case insensitive node was used and no case sensitive nodes were
      //   used (to avoid unnecessary node expansion).
      // - Turn global flag i off if a case sensitive node was used (since case sensitivity can't be
      //   forced without the use of ES2025 flag groups)
      ignoreCase: !!((ast.flags.ignoreCase || hasCaseInsensitiveNode) && !hasCaseSensitiveNode)
    };
    let lastNode = ast;
    const state = {
      accuracy: opts.accuracy,
      appliedGlobalFlags,
      captureMap: /* @__PURE__ */ new Map(),
      currentFlags: {
        dotAll: ast.flags.dotAll,
        ignoreCase: ast.flags.ignoreCase
      },
      inCharClass: false,
      lastNode,
      originMap: ast._originMap,
      recursionLimit,
      useAppliedIgnoreCase: !!(!minTargetEs2025 && hasCaseInsensitiveNode && hasCaseSensitiveNode),
      useFlagMods: minTargetEs2025,
      useFlagV: minTargetEs2024,
      verbose: opts.verbose
    };
    function gen(node) {
      state.lastNode = lastNode;
      lastNode = node;
      const fn = throwIfNullish(generator[node.type], `Unexpected node type "${node.type}"`);
      return fn(node, state, gen);
    }
    const result = {
      pattern: ast.body.map(gen).join("|"),
      // Could reset `lastNode` at this point via `lastNode = ast`, but it isn't needed by flags
      flags: gen(ast.flags),
      options: { ...ast.options }
    };
    if (!minTargetEs2024) {
      delete result.options.force.v;
      result.options.disable.v = true;
      result.options.unicodeSetsPlugin = null;
    }
    result._captureTransfers = /* @__PURE__ */ new Map();
    result._hiddenCaptures = [];
    state.captureMap.forEach((value, key2) => {
      if (value.hidden) {
        result._hiddenCaptures.push(key2);
      }
      if (value.transferTo) {
        getOrInsert(result._captureTransfers, value.transferTo, []).push(key2);
      }
    });
    return result;
  }
  var FlagModifierVisitor = {
    "*": {
      enter({ node }, state) {
        if (isAnyGroup(node)) {
          const currentModI = state.getCurrentModI();
          state.pushModI(
            node.flags ? getNewCurrentFlags({ ignoreCase: currentModI }, node.flags).ignoreCase : currentModI
          );
        }
      },
      exit({ node }, state) {
        if (isAnyGroup(node)) {
          state.popModI();
        }
      }
    },
    Backreference(_4, state) {
      state.setHasCasedChar();
    },
    Character({ node }, state) {
      if (charHasCase(cp(node.value))) {
        state.setHasCasedChar();
      }
    },
    CharacterClassRange({ node, skip }, state) {
      skip();
      if (getCasesOutsideCharClassRange(node, { firstOnly: true }).length) {
        state.setHasCasedChar();
      }
    },
    CharacterSet({ node }, state) {
      if (node.kind === "property" && UnicodePropertiesWithSpecificCase.has(node.value)) {
        state.setHasCasedChar();
      }
    }
  };
  var generator = {
    /**
    @param {AlternativeNode} node
    */
    Alternative({ body: body3 }, _4, gen) {
      return body3.map(gen).join("");
    },
    /**
    @param {AssertionNode} node
    */
    Assertion({ kind, negate }) {
      if (kind === "string_end") {
        return "$";
      }
      if (kind === "string_start") {
        return "^";
      }
      if (kind === "word_boundary") {
        return negate ? r3`\B` : r3`\b`;
      }
      throw new Error(`Unexpected assertion kind "${kind}"`);
    },
    /**
    @param {BackreferenceNode} node
    */
    Backreference({ ref }, state) {
      if (typeof ref !== "number") {
        throw new Error("Unexpected named backref in transformed AST");
      }
      if (!state.useFlagMods && state.accuracy === "strict" && state.currentFlags.ignoreCase && !state.captureMap.get(ref).ignoreCase) {
        throw new Error("Use of case-insensitive backref to case-sensitive group requires target ES2025 or non-strict accuracy");
      }
      return "\\" + ref;
    },
    /**
    @param {CapturingGroupNode} node
    */
    CapturingGroup(node, state, gen) {
      const { body: body3, name, number: number2 } = node;
      const data = { ignoreCase: state.currentFlags.ignoreCase };
      const origin = state.originMap.get(node);
      if (origin) {
        data.hidden = true;
        if (number2 > origin.number) {
          data.transferTo = origin.number;
        }
      }
      state.captureMap.set(number2, data);
      return `(${name ? `?<${name}>` : ""}${body3.map(gen).join("|")})`;
    },
    /**
    @param {CharacterNode} node
    */
    Character({ value }, state) {
      const char = cp(value);
      const escaped = getCharEscape(value, {
        escDigit: state.lastNode.type === "Backreference",
        inCharClass: state.inCharClass,
        useFlagV: state.useFlagV
      });
      if (escaped !== char) {
        return escaped;
      }
      if (state.useAppliedIgnoreCase && state.currentFlags.ignoreCase && charHasCase(char)) {
        const cases = getIgnoreCaseMatchChars(char);
        return state.inCharClass ? cases.join("") : cases.length > 1 ? `[${cases.join("")}]` : cases[0];
      }
      return char;
    },
    /**
    @param {CharacterClassNode} node
    */
    CharacterClass(node, state, gen) {
      const { kind, negate, parent } = node;
      let { body: body3 } = node;
      if (kind === "intersection" && !state.useFlagV) {
        throw new Error("Use of character class intersection requires min target ES2024");
      }
      if (envFlags.bugFlagVLiteralHyphenIsRange && state.useFlagV && body3.some(isLiteralHyphen)) {
        body3 = [m3(45), ...body3.filter((kid) => !isLiteralHyphen(kid))];
      }
      const genClass = () => `[${negate ? "^" : ""}${body3.map(gen).join(kind === "intersection" ? "&&" : "")}]`;
      if (!state.inCharClass) {
        if (
          // Already established `kind !== 'intersection'` if `!state.useFlagV`; don't check again
          (!state.useFlagV || envFlags.bugNestedClassIgnoresNegation) && !negate
        ) {
          const negatedChildClasses = body3.filter(
            (kid) => kid.type === "CharacterClass" && kid.kind === "union" && kid.negate
          );
          if (negatedChildClasses.length) {
            const group = A2();
            const groupFirstAlt = group.body[0];
            group.parent = parent;
            groupFirstAlt.parent = group;
            body3 = body3.filter((kid) => !negatedChildClasses.includes(kid));
            node.body = body3;
            if (body3.length) {
              node.parent = groupFirstAlt;
              groupFirstAlt.body.push(node);
            } else {
              group.body.pop();
            }
            negatedChildClasses.forEach((cc) => {
              const newAlt = b3({ body: [cc] });
              cc.parent = newAlt;
              newAlt.parent = group;
              group.body.push(newAlt);
            });
            return gen(group);
          }
        }
        state.inCharClass = true;
        const result = genClass();
        state.inCharClass = false;
        return result;
      }
      const firstEl = body3[0];
      if (
        // Already established that the parent is a char class via `inCharClass`; don't check again
        kind === "union" && !negate && firstEl && // Allows many nested classes to work with `target` ES2018 which doesn't support nesting
        ((!state.useFlagV || !state.verbose) && parent.kind === "union" && !(envFlags.bugFlagVLiteralHyphenIsRange && state.useFlagV) || !state.verbose && parent.kind === "intersection" && // JS doesn't allow intersection with union or ranges
        body3.length === 1 && firstEl.type !== "CharacterClassRange")
      ) {
        return body3.map(gen).join("");
      }
      if (!state.useFlagV && parent.type === "CharacterClass") {
        throw new Error("Uses nested character class in a way that requires min target ES2024");
      }
      return genClass();
    },
    /**
    @param {CharacterClassRangeNode} node
    */
    CharacterClassRange(node, state) {
      const min = node.min.value;
      const max = node.max.value;
      const escOpts = {
        escDigit: false,
        inCharClass: true,
        useFlagV: state.useFlagV
      };
      const minStr = getCharEscape(min, escOpts);
      const maxStr = getCharEscape(max, escOpts);
      const extraChars = /* @__PURE__ */ new Set();
      if (state.useAppliedIgnoreCase && state.currentFlags.ignoreCase) {
        const charsOutsideRange = getCasesOutsideCharClassRange(node);
        const ranges = getCodePointRangesFromChars(charsOutsideRange);
        ranges.forEach((value) => {
          extraChars.add(
            Array.isArray(value) ? `${getCharEscape(value[0], escOpts)}-${getCharEscape(value[1], escOpts)}` : getCharEscape(value, escOpts)
          );
        });
      }
      return `${minStr}-${maxStr}${[...extraChars].join("")}`;
    },
    /**
    @param {CharacterSetNode} node
    */
    CharacterSet({ kind, negate, value, key: key2 }, state) {
      if (kind === "dot") {
        return state.currentFlags.dotAll ? state.appliedGlobalFlags.dotAll || state.useFlagMods ? "." : "[^]" : (
          // Onig's only line break char is line feed, unlike JS
          r3`[^\n]`
        );
      }
      if (kind === "digit") {
        return negate ? r3`\D` : r3`\d`;
      }
      if (kind === "property") {
        if (state.useAppliedIgnoreCase && state.currentFlags.ignoreCase && UnicodePropertiesWithSpecificCase.has(value)) {
          throw new Error(`Unicode property "${value}" can't be case-insensitive when other chars have specific case`);
        }
        return `${negate ? r3`\P` : r3`\p`}{${key2 ? `${key2}=` : ""}${value}}`;
      }
      if (kind === "word") {
        return negate ? r3`\W` : r3`\w`;
      }
      throw new Error(`Unexpected character set kind "${kind}"`);
    },
    /**
    @param {FlagsNode} node
    */
    Flags(node, state) {
      return (
        // The transformer should never turn on the properties for flags d, g, m since Onig doesn't
        // have equivs. Flag m is never used since Onig uses different line break chars than JS
        // (node.hasIndices ? 'd' : '') +
        // (node.global ? 'g' : '') +
        // (node.multiline ? 'm' : '') +
        (state.appliedGlobalFlags.ignoreCase ? "i" : "") + (node.dotAll ? "s" : "") + (node.sticky ? "y" : "")
      );
    },
    /**
    @param {GroupNode} node
    */
    Group({ atomic: atomic2, body: body3, flags, parent }, state, gen) {
      const currentFlags = state.currentFlags;
      if (flags) {
        state.currentFlags = getNewCurrentFlags(currentFlags, flags);
      }
      const contents = body3.map(gen).join("|");
      const result = !state.verbose && body3.length === 1 && // Single alt
      parent.type !== "Quantifier" && !atomic2 && (!state.useFlagMods || !flags) ? contents : `(?${getGroupPrefix(atomic2, flags, state.useFlagMods)}${contents})`;
      state.currentFlags = currentFlags;
      return result;
    },
    /**
    @param {LookaroundAssertionNode} node
    */
    LookaroundAssertion({ body: body3, kind, negate }, _4, gen) {
      const prefix = `${kind === "lookahead" ? "" : "<"}${negate ? "!" : "="}`;
      return `(?${prefix}${body3.map(gen).join("|")})`;
    },
    /**
    @param {QuantifierNode} node
    */
    Quantifier(node, _4, gen) {
      return gen(node.body) + getQuantifierStr(node);
    },
    /**
    @param {SubroutineNode & {isRecursive: true}} node
    */
    Subroutine({ isRecursive, ref }, state) {
      if (!isRecursive) {
        throw new Error("Unexpected non-recursive subroutine in transformed AST");
      }
      const limit = state.recursionLimit;
      return ref === 0 ? `(?R=${limit})` : r3`\g<${ref}&R=${limit}>`;
    }
  };
  var BaseEscapeChars = /* @__PURE__ */ new Set([
    "$",
    "(",
    ")",
    "*",
    "+",
    ".",
    "?",
    "[",
    "\\",
    "]",
    "^",
    "{",
    "|",
    "}"
  ]);
  var CharClassEscapeChars = /* @__PURE__ */ new Set([
    "-",
    "\\",
    "]",
    "^",
    // Literal `[` doesn't require escaping with flag u, but this can help work around regex source
    // linters and regex syntax processors that expect unescaped `[` to create a nested class
    "["
  ]);
  var CharClassEscapeCharsFlagV = /* @__PURE__ */ new Set([
    "(",
    ")",
    "-",
    "/",
    "[",
    "\\",
    "]",
    "^",
    "{",
    "|",
    "}",
    // Double punctuators; also includes already-listed `-` and `^`
    "!",
    "#",
    "$",
    "%",
    "&",
    "*",
    "+",
    ",",
    ".",
    ":",
    ";",
    "<",
    "=",
    ">",
    "?",
    "@",
    "`",
    "~"
  ]);
  var CharCodeEscapeMap = /* @__PURE__ */ new Map([
    [9, r3`\t`],
    // horizontal tab
    [10, r3`\n`],
    // line feed
    [11, r3`\v`],
    // vertical tab
    [12, r3`\f`],
    // form feed
    [13, r3`\r`],
    // carriage return
    [8232, r3`\u2028`],
    // line separator
    [8233, r3`\u2029`],
    // paragraph separator
    [65279, r3`\uFEFF`]
    // ZWNBSP/BOM
  ]);
  var casedRe = /^\p{Cased}$/u;
  function charHasCase(char) {
    return casedRe.test(char);
  }
  function getCasesOutsideCharClassRange(node, options) {
    const firstOnly = !!options?.firstOnly;
    const min = node.min.value;
    const max = node.max.value;
    const found = [];
    if (min < 65 && (max === 65535 || max >= 131071) || min === 65536 && max >= 131071) {
      return found;
    }
    for (let i2 = min; i2 <= max; i2++) {
      const char = cp(i2);
      if (!charHasCase(char)) {
        continue;
      }
      const charsOutsideRange = getIgnoreCaseMatchChars(char).filter((caseOfChar) => {
        const num = caseOfChar.codePointAt(0);
        return num < min || num > max;
      });
      if (charsOutsideRange.length) {
        found.push(...charsOutsideRange);
        if (firstOnly) {
          break;
        }
      }
    }
    return found;
  }
  function getCharEscape(codePoint, { escDigit, inCharClass, useFlagV }) {
    if (CharCodeEscapeMap.has(codePoint)) {
      return CharCodeEscapeMap.get(codePoint);
    }
    if (
      // Control chars, etc.; condition modeled on the Chrome developer console's display for strings
      codePoint < 32 || codePoint > 126 && codePoint < 160 || // Unicode planes 4-16; unassigned, special purpose, and private use area
      codePoint > 262143 || // Avoid corrupting a preceding backref by immediately following it with a literal digit
      escDigit && isDigitCharCode(codePoint)
    ) {
      return codePoint > 255 ? `\\u{${codePoint.toString(16).toUpperCase()}}` : `\\x${codePoint.toString(16).toUpperCase().padStart(2, "0")}`;
    }
    const escapeChars = inCharClass ? useFlagV ? CharClassEscapeCharsFlagV : CharClassEscapeChars : BaseEscapeChars;
    const char = cp(codePoint);
    return (escapeChars.has(char) ? "\\" : "") + char;
  }
  function getCodePointRangesFromChars(chars) {
    const codePoints = chars.map((char) => char.codePointAt(0)).sort((a2, b4) => a2 - b4);
    const values = [];
    let start = null;
    for (let i2 = 0; i2 < codePoints.length; i2++) {
      if (codePoints[i2 + 1] === codePoints[i2] + 1) {
        start ??= codePoints[i2];
      } else if (start === null) {
        values.push(codePoints[i2]);
      } else {
        values.push([start, codePoints[i2]]);
        start = null;
      }
    }
    return values;
  }
  function getGroupPrefix(atomic2, flagMods, useFlagMods) {
    if (atomic2) {
      return ">";
    }
    let mods = "";
    if (flagMods && useFlagMods) {
      const { enable, disable } = flagMods;
      mods = (enable?.ignoreCase ? "i" : "") + (enable?.dotAll ? "s" : "") + (disable ? "-" : "") + (disable?.ignoreCase ? "i" : "") + (disable?.dotAll ? "s" : "");
    }
    return `${mods}:`;
  }
  function getQuantifierStr({ kind, max, min }) {
    let base;
    if (!min && max === 1) {
      base = "?";
    } else if (!min && max === Infinity) {
      base = "*";
    } else if (min === 1 && max === Infinity) {
      base = "+";
    } else if (min === max) {
      base = `{${min}}`;
    } else {
      base = `{${min},${max === Infinity ? "" : max}}`;
    }
    return base + {
      greedy: "",
      lazy: "?",
      possessive: "+"
    }[kind];
  }
  function isAnyGroup({ type }) {
    return type === "CapturingGroup" || type === "Group" || type === "LookaroundAssertion";
  }
  function isDigitCharCode(value) {
    return value > 47 && value < 58;
  }
  function isLiteralHyphen({ type, value }) {
    return type === "Character" && value === 45;
  }
  var EmulatedRegExp = class _EmulatedRegExp extends RegExp {
    /**
    @type {Map<number, {
      hidden?: true;
      transferTo?: number;
    }>}
    */
    #captureMap = /* @__PURE__ */ new Map();
    /**
    @type {RegExp | EmulatedRegExp | null}
    */
    #compiled = null;
    /**
    @type {string}
    */
    #pattern;
    /**
    @type {Map<number, string>?}
    */
    #nameMap = null;
    /**
    @type {string?}
    */
    #strategy = null;
    /**
    Can be used to serialize the instance.
    @type {EmulatedRegExpOptions}
    */
    rawOptions = {};
    // Override the getter with one that works with lazy-compiled regexes
    get source() {
      return this.#pattern || "(?:)";
    }
    /**
    @overload
    @param {string} pattern
    @param {string} [flags]
    @param {EmulatedRegExpOptions} [options]
    */
    /**
    @overload
    @param {EmulatedRegExp} pattern
    @param {string} [flags]
    */
    constructor(pattern, flags, options) {
      const lazyCompile = !!options?.lazyCompile;
      if (pattern instanceof RegExp) {
        if (options) {
          throw new Error("Cannot provide options when copying a regexp");
        }
        const re4 = pattern;
        super(re4, flags);
        this.#pattern = re4.source;
        if (re4 instanceof _EmulatedRegExp) {
          this.#captureMap = re4.#captureMap;
          this.#nameMap = re4.#nameMap;
          this.#strategy = re4.#strategy;
          this.rawOptions = re4.rawOptions;
        }
      } else {
        const opts = {
          hiddenCaptures: [],
          strategy: null,
          transfers: [],
          ...options
        };
        super(lazyCompile ? "" : pattern, flags);
        this.#pattern = pattern;
        this.#captureMap = createCaptureMap(opts.hiddenCaptures, opts.transfers);
        this.#strategy = opts.strategy;
        this.rawOptions = options ?? {};
      }
      if (!lazyCompile) {
        this.#compiled = this;
      }
    }
    /**
    Called internally by all String/RegExp methods that use regexes.
    @override
    @param {string} str
    @returns {RegExpExecArray?}
    */
    exec(str) {
      if (!this.#compiled) {
        const { lazyCompile, ...rest } = this.rawOptions;
        this.#compiled = new _EmulatedRegExp(this.#pattern, this.flags, rest);
      }
      const useLastIndex = this.global || this.sticky;
      const pos = this.lastIndex;
      if (this.#strategy === "clip_search" && useLastIndex && pos) {
        this.lastIndex = 0;
        const match = this.#execCore(str.slice(pos));
        if (match) {
          adjustMatchDetailsForOffset(match, pos, str, this.hasIndices);
          this.lastIndex += pos;
        }
        return match;
      }
      return this.#execCore(str);
    }
    /**
    Adds support for hidden and transfer captures.
    @param {string} str
    @returns
    */
    #execCore(str) {
      this.#compiled.lastIndex = this.lastIndex;
      const match = super.exec.call(this.#compiled, str);
      this.lastIndex = this.#compiled.lastIndex;
      if (!match || !this.#captureMap.size) {
        return match;
      }
      const matchCopy = [...match];
      match.length = 1;
      let indicesCopy;
      if (this.hasIndices) {
        indicesCopy = [...match.indices];
        match.indices.length = 1;
      }
      const mappedNums = [0];
      for (let i2 = 1; i2 < matchCopy.length; i2++) {
        const { hidden, transferTo } = this.#captureMap.get(i2) ?? {};
        if (hidden) {
          mappedNums.push(null);
        } else {
          mappedNums.push(match.length);
          match.push(matchCopy[i2]);
          if (this.hasIndices) {
            match.indices.push(indicesCopy[i2]);
          }
        }
        if (transferTo && matchCopy[i2] !== void 0) {
          const to = mappedNums[transferTo];
          if (!to) {
            throw new Error(`Invalid capture transfer to "${to}"`);
          }
          match[to] = matchCopy[i2];
          if (this.hasIndices) {
            match.indices[to] = indicesCopy[i2];
          }
          if (match.groups) {
            if (!this.#nameMap) {
              this.#nameMap = createNameMap(this.source);
            }
            const name = this.#nameMap.get(transferTo);
            if (name) {
              match.groups[name] = matchCopy[i2];
              if (this.hasIndices) {
                match.indices.groups[name] = indicesCopy[i2];
              }
            }
          }
        }
      }
      return match;
    }
  };
  function adjustMatchDetailsForOffset(match, offset, input, hasIndices) {
    match.index += offset;
    match.input = input;
    if (hasIndices) {
      const indices = match.indices;
      for (let i2 = 0; i2 < indices.length; i2++) {
        const arr = indices[i2];
        if (arr) {
          indices[i2] = [arr[0] + offset, arr[1] + offset];
        }
      }
      const groupIndices = indices.groups;
      if (groupIndices) {
        Object.keys(groupIndices).forEach((key2) => {
          const arr = groupIndices[key2];
          if (arr) {
            groupIndices[key2] = [arr[0] + offset, arr[1] + offset];
          }
        });
      }
    }
  }
  function createCaptureMap(hiddenCaptures, transfers) {
    const captureMap = /* @__PURE__ */ new Map();
    for (const num of hiddenCaptures) {
      captureMap.set(num, {
        hidden: true
      });
    }
    for (const [to, from] of transfers) {
      for (const num of from) {
        getOrInsert(captureMap, num, {}).transferTo = to;
      }
    }
    return captureMap;
  }
  function createNameMap(pattern) {
    const re4 = /(?<capture>\((?:\?<(?![=!])(?<name>[^>]+)>|(?!\?)))|\\?./gsu;
    const map = /* @__PURE__ */ new Map();
    let numCharClassesOpen = 0;
    let numCaptures = 0;
    let match;
    while (match = re4.exec(pattern)) {
      const { 0: m4, groups: { capture, name } } = match;
      if (m4 === "[") {
        numCharClassesOpen++;
      } else if (!numCharClassesOpen) {
        if (capture) {
          numCaptures++;
          if (name) {
            map.set(numCaptures, name);
          }
        }
      } else if (m4 === "]") {
        numCharClassesOpen--;
      }
    }
    return map;
  }
  function toRegExp(pattern, options) {
    const d3 = toRegExpDetails(pattern, options);
    if (d3.options) {
      return new EmulatedRegExp(d3.pattern, d3.flags, d3.options);
    }
    return new RegExp(d3.pattern, d3.flags);
  }
  function toRegExpDetails(pattern, options) {
    const opts = getOptions(options);
    const onigurumaAst = J3(pattern, {
      flags: opts.flags,
      normalizeUnknownPropertyNames: true,
      rules: {
        captureGroup: opts.rules.captureGroup,
        singleline: opts.rules.singleline
      },
      skipBackrefValidation: opts.rules.allowOrphanBackrefs,
      unicodePropertyMap: JsUnicodePropertyMap
    });
    const regexPlusAst = transform(onigurumaAst, {
      accuracy: opts.accuracy,
      asciiWordBoundaries: opts.rules.asciiWordBoundaries,
      avoidSubclass: opts.avoidSubclass,
      bestEffortTarget: opts.target
    });
    const generated = generate(regexPlusAst, opts);
    const recursionResult = recursion(generated.pattern, {
      captureTransfers: generated._captureTransfers,
      hiddenCaptures: generated._hiddenCaptures,
      mode: "external"
    });
    const possessiveResult = possessive(recursionResult.pattern);
    const atomicResult = atomic(possessiveResult.pattern, {
      captureTransfers: recursionResult.captureTransfers,
      hiddenCaptures: recursionResult.hiddenCaptures
    });
    const details = {
      pattern: atomicResult.pattern,
      flags: `${opts.hasIndices ? "d" : ""}${opts.global ? "g" : ""}${generated.flags}${generated.options.disable.v ? "u" : "v"}`
    };
    if (opts.avoidSubclass) {
      if (opts.lazyCompileLength !== Infinity) {
        throw new Error("Lazy compilation requires subclass");
      }
    } else {
      const hiddenCaptures = atomicResult.hiddenCaptures.sort((a2, b4) => a2 - b4);
      const transfers = Array.from(atomicResult.captureTransfers);
      const strategy = regexPlusAst._strategy;
      const lazyCompile = details.pattern.length >= opts.lazyCompileLength;
      if (hiddenCaptures.length || transfers.length || strategy || lazyCompile) {
        details.options = {
          ...hiddenCaptures.length && { hiddenCaptures },
          ...transfers.length && { transfers },
          ...strategy && { strategy },
          ...lazyCompile && { lazyCompile }
        };
      }
    }
    return details;
  }

  // node_modules/@shikijs/engine-javascript/dist/engine-compile.mjs
  function defaultJavaScriptRegexConstructor(pattern, options) {
    return toRegExp(pattern, {
      global: true,
      hasIndices: true,
      lazyCompileLength: 3e3,
      rules: {
        allowOrphanBackrefs: true,
        asciiWordBoundaries: true,
        captureGroup: true,
        recursionLimit: 5,
        singleline: true
      },
      ...options
    });
  }
  function createJavaScriptRegexEngine(options = {}) {
    const _options = {
      target: "auto",
      cache: /* @__PURE__ */ new Map(),
      ...options
    };
    _options.regexConstructor ||= (pattern) => defaultJavaScriptRegexConstructor(pattern, { target: _options.target });
    return {
      createScanner(patterns) {
        return new JavaScriptScanner(patterns, _options);
      },
      createString: createJavaScriptEngineString
    };
  }

  // node_modules/@shikijs/themes/dist/dark-plus.mjs
  var dark_plus_default = Object.freeze(JSON.parse('{"colors":{"actionBar.toggledBackground":"#383a49","activityBarBadge.background":"#007ACC","checkbox.border":"#6B6B6B","editor.background":"#1E1E1E","editor.foreground":"#D4D4D4","editor.inactiveSelectionBackground":"#3A3D41","editor.selectionHighlightBackground":"#ADD6FF26","editorIndentGuide.activeBackground1":"#707070","editorIndentGuide.background1":"#404040","input.placeholderForeground":"#A6A6A6","list.activeSelectionIconForeground":"#FFF","list.dropBackground":"#383B3D","menu.background":"#252526","menu.border":"#454545","menu.foreground":"#CCCCCC","menu.selectionBackground":"#0078d4","menu.separatorBackground":"#454545","ports.iconRunningProcessForeground":"#369432","sideBarSectionHeader.background":"#0000","sideBarSectionHeader.border":"#ccc3","sideBarTitle.foreground":"#BBBBBB","statusBarItem.remoteBackground":"#16825D","statusBarItem.remoteForeground":"#FFF","tab.lastPinnedBorder":"#ccc3","tab.selectedBackground":"#222222","tab.selectedForeground":"#ffffffa0","terminal.inactiveSelectionBackground":"#3A3D41","widget.border":"#303031"},"displayName":"Dark Plus","name":"dark-plus","semanticHighlighting":true,"semanticTokenColors":{"customLiteral":"#DCDCAA","newOperator":"#C586C0","numberLiteral":"#b5cea8","stringLiteral":"#ce9178"},"tokenColors":[{"scope":["meta.embedded","source.groovy.embedded","string meta.image.inline.markdown","variable.legacy.builtin.python"],"settings":{"foreground":"#D4D4D4"}},{"scope":"emphasis","settings":{"fontStyle":"italic"}},{"scope":"strong","settings":{"fontStyle":"bold"}},{"scope":"header","settings":{"foreground":"#000080"}},{"scope":"comment","settings":{"foreground":"#6A9955"}},{"scope":"constant.language","settings":{"foreground":"#569cd6"}},{"scope":["constant.numeric","variable.other.enummember","keyword.operator.plus.exponent","keyword.operator.minus.exponent"],"settings":{"foreground":"#b5cea8"}},{"scope":"constant.regexp","settings":{"foreground":"#646695"}},{"scope":"entity.name.tag","settings":{"foreground":"#569cd6"}},{"scope":["entity.name.tag.css","entity.name.tag.less"],"settings":{"foreground":"#d7ba7d"}},{"scope":"entity.other.attribute-name","settings":{"foreground":"#9cdcfe"}},{"scope":["entity.other.attribute-name.class.css","source.css entity.other.attribute-name.class","entity.other.attribute-name.id.css","entity.other.attribute-name.parent-selector.css","entity.other.attribute-name.parent.less","source.css entity.other.attribute-name.pseudo-class","entity.other.attribute-name.pseudo-element.css","source.css.less entity.other.attribute-name.id","entity.other.attribute-name.scss"],"settings":{"foreground":"#d7ba7d"}},{"scope":"invalid","settings":{"foreground":"#f44747"}},{"scope":"markup.underline","settings":{"fontStyle":"underline"}},{"scope":"markup.bold","settings":{"fontStyle":"bold","foreground":"#569cd6"}},{"scope":"markup.heading","settings":{"fontStyle":"bold","foreground":"#569cd6"}},{"scope":"markup.italic","settings":{"fontStyle":"italic"}},{"scope":"markup.strikethrough","settings":{"fontStyle":"strikethrough"}},{"scope":"markup.inserted","settings":{"foreground":"#b5cea8"}},{"scope":"markup.deleted","settings":{"foreground":"#ce9178"}},{"scope":"markup.changed","settings":{"foreground":"#569cd6"}},{"scope":"punctuation.definition.quote.begin.markdown","settings":{"foreground":"#6A9955"}},{"scope":"punctuation.definition.list.begin.markdown","settings":{"foreground":"#6796e6"}},{"scope":"markup.inline.raw","settings":{"foreground":"#ce9178"}},{"scope":"punctuation.definition.tag","settings":{"foreground":"#808080"}},{"scope":["meta.preprocessor","entity.name.function.preprocessor"],"settings":{"foreground":"#569cd6"}},{"scope":"meta.preprocessor.string","settings":{"foreground":"#ce9178"}},{"scope":"meta.preprocessor.numeric","settings":{"foreground":"#b5cea8"}},{"scope":"meta.structure.dictionary.key.python","settings":{"foreground":"#9cdcfe"}},{"scope":"meta.diff.header","settings":{"foreground":"#569cd6"}},{"scope":"storage","settings":{"foreground":"#569cd6"}},{"scope":"storage.type","settings":{"foreground":"#569cd6"}},{"scope":["storage.modifier","keyword.operator.noexcept"],"settings":{"foreground":"#569cd6"}},{"scope":["string","meta.embedded.assembly"],"settings":{"foreground":"#ce9178"}},{"scope":"string.tag","settings":{"foreground":"#ce9178"}},{"scope":"string.value","settings":{"foreground":"#ce9178"}},{"scope":"string.regexp","settings":{"foreground":"#d16969"}},{"scope":["punctuation.definition.template-expression.begin","punctuation.definition.template-expression.end","punctuation.section.embedded"],"settings":{"foreground":"#569cd6"}},{"scope":["meta.template.expression"],"settings":{"foreground":"#d4d4d4"}},{"scope":["support.type.vendored.property-name","support.type.property-name","source.css variable","source.coffee.embedded"],"settings":{"foreground":"#9cdcfe"}},{"scope":"keyword","settings":{"foreground":"#569cd6"}},{"scope":"keyword.control","settings":{"foreground":"#569cd6"}},{"scope":"keyword.operator","settings":{"foreground":"#d4d4d4"}},{"scope":["keyword.operator.new","keyword.operator.expression","keyword.operator.cast","keyword.operator.sizeof","keyword.operator.alignof","keyword.operator.typeid","keyword.operator.alignas","keyword.operator.instanceof","keyword.operator.logical.python","keyword.operator.wordlike"],"settings":{"foreground":"#569cd6"}},{"scope":"keyword.other.unit","settings":{"foreground":"#b5cea8"}},{"scope":["punctuation.section.embedded.begin.php","punctuation.section.embedded.end.php"],"settings":{"foreground":"#569cd6"}},{"scope":"support.function.git-rebase","settings":{"foreground":"#9cdcfe"}},{"scope":"constant.sha.git-rebase","settings":{"foreground":"#b5cea8"}},{"scope":["storage.modifier.import.java","variable.language.wildcard.java","storage.modifier.package.java"],"settings":{"foreground":"#d4d4d4"}},{"scope":"variable.language","settings":{"foreground":"#569cd6"}},{"scope":["entity.name.function","support.function","support.constant.handlebars","source.powershell variable.other.member","entity.name.operator.custom-literal"],"settings":{"foreground":"#DCDCAA"}},{"scope":["support.class","support.type","entity.name.type","entity.name.namespace","entity.other.attribute","entity.name.scope-resolution","entity.name.class","storage.type.numeric.go","storage.type.byte.go","storage.type.boolean.go","storage.type.string.go","storage.type.uintptr.go","storage.type.error.go","storage.type.rune.go","storage.type.cs","storage.type.generic.cs","storage.type.modifier.cs","storage.type.variable.cs","storage.type.annotation.java","storage.type.generic.java","storage.type.java","storage.type.object.array.java","storage.type.primitive.array.java","storage.type.primitive.java","storage.type.token.java","storage.type.groovy","storage.type.annotation.groovy","storage.type.parameters.groovy","storage.type.generic.groovy","storage.type.object.array.groovy","storage.type.primitive.array.groovy","storage.type.primitive.groovy"],"settings":{"foreground":"#4EC9B0"}},{"scope":["meta.type.cast.expr","meta.type.new.expr","support.constant.math","support.constant.dom","support.constant.json","entity.other.inherited-class","punctuation.separator.namespace.ruby"],"settings":{"foreground":"#4EC9B0"}},{"scope":["keyword.control","source.cpp keyword.operator.new","keyword.operator.delete","keyword.other.using","keyword.other.directive.using","keyword.other.operator","entity.name.operator"],"settings":{"foreground":"#C586C0"}},{"scope":["variable","meta.definition.variable.name","support.variable","entity.name.variable","constant.other.placeholder"],"settings":{"foreground":"#9CDCFE"}},{"scope":["variable.other.constant","variable.other.enummember"],"settings":{"foreground":"#4FC1FF"}},{"scope":["meta.object-literal.key"],"settings":{"foreground":"#9CDCFE"}},{"scope":["support.constant.property-value","support.constant.font-name","support.constant.media-type","support.constant.media","constant.other.color.rgb-value","constant.other.rgb-value","support.constant.color"],"settings":{"foreground":"#CE9178"}},{"scope":["punctuation.definition.group.regexp","punctuation.definition.group.assertion.regexp","punctuation.definition.character-class.regexp","punctuation.character.set.begin.regexp","punctuation.character.set.end.regexp","keyword.operator.negation.regexp","support.other.parenthesis.regexp"],"settings":{"foreground":"#CE9178"}},{"scope":["constant.character.character-class.regexp","constant.other.character-class.set.regexp","constant.other.character-class.regexp","constant.character.set.regexp"],"settings":{"foreground":"#d16969"}},{"scope":["keyword.operator.or.regexp","keyword.control.anchor.regexp"],"settings":{"foreground":"#DCDCAA"}},{"scope":"keyword.operator.quantifier.regexp","settings":{"foreground":"#d7ba7d"}},{"scope":["constant.character","constant.other.option"],"settings":{"foreground":"#569cd6"}},{"scope":"constant.character.escape","settings":{"foreground":"#d7ba7d"}},{"scope":"entity.name.label","settings":{"foreground":"#C8C8C8"}}],"type":"dark"}'));

  // node_modules/@shikijs/themes/dist/light-plus.mjs
  var light_plus_default = Object.freeze(JSON.parse('{"colors":{"actionBar.toggledBackground":"#dddddd","activityBarBadge.background":"#007ACC","checkbox.border":"#919191","diffEditor.unchangedRegionBackground":"#f8f8f8","editor.background":"#FFFFFF","editor.foreground":"#000000","editor.inactiveSelectionBackground":"#E5EBF1","editor.selectionHighlightBackground":"#ADD6FF80","editorIndentGuide.activeBackground1":"#939393","editorIndentGuide.background1":"#D3D3D3","editorSuggestWidget.background":"#F3F3F3","input.placeholderForeground":"#767676","list.activeSelectionIconForeground":"#FFF","list.focusAndSelectionOutline":"#90C2F9","list.hoverBackground":"#E8E8E8","menu.border":"#D4D4D4","notebook.cellBorderColor":"#E8E8E8","notebook.selectedCellBackground":"#c8ddf150","ports.iconRunningProcessForeground":"#369432","searchEditor.textInputBorder":"#CECECE","settings.numberInputBorder":"#CECECE","settings.textInputBorder":"#CECECE","sideBarSectionHeader.background":"#0000","sideBarSectionHeader.border":"#61616130","sideBarTitle.foreground":"#6F6F6F","statusBarItem.errorBackground":"#c72e0f","statusBarItem.remoteBackground":"#16825D","statusBarItem.remoteForeground":"#FFF","tab.lastPinnedBorder":"#61616130","tab.selectedBackground":"#ffffffa5","tab.selectedForeground":"#333333b3","terminal.inactiveSelectionBackground":"#E5EBF1","widget.border":"#d4d4d4"},"displayName":"Light Plus","name":"light-plus","semanticHighlighting":true,"semanticTokenColors":{"customLiteral":"#795E26","newOperator":"#AF00DB","numberLiteral":"#098658","stringLiteral":"#a31515"},"tokenColors":[{"scope":["meta.embedded","source.groovy.embedded","string meta.image.inline.markdown","variable.legacy.builtin.python"],"settings":{"foreground":"#000000ff"}},{"scope":"emphasis","settings":{"fontStyle":"italic"}},{"scope":"strong","settings":{"fontStyle":"bold"}},{"scope":"meta.diff.header","settings":{"foreground":"#000080"}},{"scope":"comment","settings":{"foreground":"#008000"}},{"scope":"constant.language","settings":{"foreground":"#0000ff"}},{"scope":["constant.numeric","variable.other.enummember","keyword.operator.plus.exponent","keyword.operator.minus.exponent"],"settings":{"foreground":"#098658"}},{"scope":"constant.regexp","settings":{"foreground":"#811f3f"}},{"scope":"entity.name.tag","settings":{"foreground":"#800000"}},{"scope":"entity.name.selector","settings":{"foreground":"#800000"}},{"scope":"entity.other.attribute-name","settings":{"foreground":"#e50000"}},{"scope":["entity.other.attribute-name.class.css","source.css entity.other.attribute-name.class","entity.other.attribute-name.id.css","entity.other.attribute-name.parent-selector.css","entity.other.attribute-name.parent.less","source.css entity.other.attribute-name.pseudo-class","entity.other.attribute-name.pseudo-element.css","source.css.less entity.other.attribute-name.id","entity.other.attribute-name.scss"],"settings":{"foreground":"#800000"}},{"scope":"invalid","settings":{"foreground":"#cd3131"}},{"scope":"markup.underline","settings":{"fontStyle":"underline"}},{"scope":"markup.bold","settings":{"fontStyle":"bold","foreground":"#000080"}},{"scope":"markup.heading","settings":{"fontStyle":"bold","foreground":"#800000"}},{"scope":"markup.italic","settings":{"fontStyle":"italic"}},{"scope":"markup.strikethrough","settings":{"fontStyle":"strikethrough"}},{"scope":"markup.inserted","settings":{"foreground":"#098658"}},{"scope":"markup.deleted","settings":{"foreground":"#a31515"}},{"scope":"markup.changed","settings":{"foreground":"#0451a5"}},{"scope":["punctuation.definition.quote.begin.markdown","punctuation.definition.list.begin.markdown"],"settings":{"foreground":"#0451a5"}},{"scope":"markup.inline.raw","settings":{"foreground":"#800000"}},{"scope":"punctuation.definition.tag","settings":{"foreground":"#800000"}},{"scope":["meta.preprocessor","entity.name.function.preprocessor"],"settings":{"foreground":"#0000ff"}},{"scope":"meta.preprocessor.string","settings":{"foreground":"#a31515"}},{"scope":"meta.preprocessor.numeric","settings":{"foreground":"#098658"}},{"scope":"meta.structure.dictionary.key.python","settings":{"foreground":"#0451a5"}},{"scope":"storage","settings":{"foreground":"#0000ff"}},{"scope":"storage.type","settings":{"foreground":"#0000ff"}},{"scope":["storage.modifier","keyword.operator.noexcept"],"settings":{"foreground":"#0000ff"}},{"scope":["string","meta.embedded.assembly"],"settings":{"foreground":"#a31515"}},{"scope":["string.comment.buffered.block.pug","string.quoted.pug","string.interpolated.pug","string.unquoted.plain.in.yaml","string.unquoted.plain.out.yaml","string.unquoted.block.yaml","string.quoted.single.yaml","string.quoted.double.xml","string.quoted.single.xml","string.unquoted.cdata.xml","string.quoted.double.html","string.quoted.single.html","string.unquoted.html","string.quoted.single.handlebars","string.quoted.double.handlebars"],"settings":{"foreground":"#0000ff"}},{"scope":"string.regexp","settings":{"foreground":"#811f3f"}},{"scope":["punctuation.definition.template-expression.begin","punctuation.definition.template-expression.end","punctuation.section.embedded"],"settings":{"foreground":"#0000ff"}},{"scope":["meta.template.expression"],"settings":{"foreground":"#000000"}},{"scope":["support.constant.property-value","support.constant.font-name","support.constant.media-type","support.constant.media","constant.other.color.rgb-value","constant.other.rgb-value","support.constant.color"],"settings":{"foreground":"#0451a5"}},{"scope":["support.type.vendored.property-name","support.type.property-name","source.css variable","source.coffee.embedded"],"settings":{"foreground":"#e50000"}},{"scope":["support.type.property-name.json"],"settings":{"foreground":"#0451a5"}},{"scope":"keyword","settings":{"foreground":"#0000ff"}},{"scope":"keyword.control","settings":{"foreground":"#0000ff"}},{"scope":"keyword.operator","settings":{"foreground":"#000000"}},{"scope":["keyword.operator.new","keyword.operator.expression","keyword.operator.cast","keyword.operator.sizeof","keyword.operator.alignof","keyword.operator.typeid","keyword.operator.alignas","keyword.operator.instanceof","keyword.operator.logical.python","keyword.operator.wordlike"],"settings":{"foreground":"#0000ff"}},{"scope":"keyword.other.unit","settings":{"foreground":"#098658"}},{"scope":["punctuation.section.embedded.begin.php","punctuation.section.embedded.end.php"],"settings":{"foreground":"#800000"}},{"scope":"support.function.git-rebase","settings":{"foreground":"#0451a5"}},{"scope":"constant.sha.git-rebase","settings":{"foreground":"#098658"}},{"scope":["storage.modifier.import.java","variable.language.wildcard.java","storage.modifier.package.java"],"settings":{"foreground":"#000000"}},{"scope":"variable.language","settings":{"foreground":"#0000ff"}},{"scope":["entity.name.function","support.function","support.constant.handlebars","source.powershell variable.other.member","entity.name.operator.custom-literal"],"settings":{"foreground":"#795E26"}},{"scope":["support.class","support.type","entity.name.type","entity.name.namespace","entity.other.attribute","entity.name.scope-resolution","entity.name.class","storage.type.numeric.go","storage.type.byte.go","storage.type.boolean.go","storage.type.string.go","storage.type.uintptr.go","storage.type.error.go","storage.type.rune.go","storage.type.cs","storage.type.generic.cs","storage.type.modifier.cs","storage.type.variable.cs","storage.type.annotation.java","storage.type.generic.java","storage.type.java","storage.type.object.array.java","storage.type.primitive.array.java","storage.type.primitive.java","storage.type.token.java","storage.type.groovy","storage.type.annotation.groovy","storage.type.parameters.groovy","storage.type.generic.groovy","storage.type.object.array.groovy","storage.type.primitive.array.groovy","storage.type.primitive.groovy"],"settings":{"foreground":"#267f99"}},{"scope":["meta.type.cast.expr","meta.type.new.expr","support.constant.math","support.constant.dom","support.constant.json","entity.other.inherited-class","punctuation.separator.namespace.ruby"],"settings":{"foreground":"#267f99"}},{"scope":["keyword.control","source.cpp keyword.operator.new","source.cpp keyword.operator.delete","keyword.other.using","keyword.other.directive.using","keyword.other.operator","entity.name.operator"],"settings":{"foreground":"#AF00DB"}},{"scope":["variable","meta.definition.variable.name","support.variable","entity.name.variable","constant.other.placeholder"],"settings":{"foreground":"#001080"}},{"scope":["variable.other.constant","variable.other.enummember"],"settings":{"foreground":"#0070C1"}},{"scope":["meta.object-literal.key"],"settings":{"foreground":"#001080"}},{"scope":["support.constant.property-value","support.constant.font-name","support.constant.media-type","support.constant.media","constant.other.color.rgb-value","constant.other.rgb-value","support.constant.color"],"settings":{"foreground":"#0451a5"}},{"scope":["punctuation.definition.group.regexp","punctuation.definition.group.assertion.regexp","punctuation.definition.character-class.regexp","punctuation.character.set.begin.regexp","punctuation.character.set.end.regexp","keyword.operator.negation.regexp","support.other.parenthesis.regexp"],"settings":{"foreground":"#d16969"}},{"scope":["constant.character.character-class.regexp","constant.other.character-class.set.regexp","constant.other.character-class.regexp","constant.character.set.regexp"],"settings":{"foreground":"#811f3f"}},{"scope":"keyword.operator.quantifier.regexp","settings":{"foreground":"#000000"}},{"scope":["keyword.operator.or.regexp","keyword.control.anchor.regexp"],"settings":{"foreground":"#EE0000"}},{"scope":["constant.character","constant.other.option"],"settings":{"foreground":"#0000ff"}},{"scope":"constant.character.escape","settings":{"foreground":"#EE0000"}},{"scope":"entity.name.label","settings":{"foreground":"#000000"}}],"type":"light"}'));

  // src/webview/syntaxes/rocq.tmLanguage.json
  var rocq_tmLanguage_default = {
    fileTypes: [
      "v"
    ],
    name: "Rocq",
    patterns: [
      {
        match: "\\b(From|Require|Import|Export|Local|Global|Include)\\b",
        comment: "Vernacular import keywords",
        name: "keyword.control.import.rocq"
      },
      {
        match: "\\b((Open|Close|Delimit|Undelimit|Bind|Declare)\\s+Scope)\\b",
        comment: "Vernacular scope keywords",
        name: "keyword.control.import.rocq"
      },
      {
        match: "\\b(Theorem|Lemma|Remark|Fact|Corollary|Property|Proposition)\\s+((\\p{L}|[_\\u00A0])(\\p{L}|[0-9_\\u00A0'])*)",
        comment: "Theorem declarations",
        captures: {
          "1": {
            name: "keyword.source.rocq"
          },
          "2": {
            name: "entity.name.function.theorem.rocq"
          }
        }
      },
      {
        match: "\\bGoal\\b",
        name: "keyword.source.rocq"
      },
      {
        match: "\\b(Parameters?|Axioms?|Conjectures?|Variables?|Hypothesis|Hypotheses)(\\s+Inline)?\\b\\s*\\(?\\s*((\\p{L}|[_\\u00A0])(\\p{L}|[0-9_\\u00A0'])*)",
        comment: "Assumptions",
        captures: {
          "1": {
            name: "keyword.source.rocq"
          },
          "2": {
            name: "keyword.source.rocq"
          },
          "3": {
            name: "entity.name.assumption.rocq"
          }
        }
      },
      {
        match: "\\b(Context)\\b\\s*`?\\s*(\\(|\\{)?\\s*((\\p{L}|[_\\u00A0])(\\p{L}|[0-9_\\u00A0'])*)",
        comment: "Context",
        captures: {
          "1": {
            name: "keyword.source.rocq"
          },
          "3": {
            name: "entity.name.assumption.rocq"
          }
        }
      },
      {
        match: "(\\b(?:Program|Local)\\s+)?\\b(Definition|Fixpoint|CoFixpoint|Function|Example|Let(?:\\s+Fixpoint|\\s+CoFixpoint)?|Instance|Equations|Equations?)\\s+((\\p{L}|[_\\u00A0])(\\p{L}|[0-9_\\u00A0'])*)",
        comment: "Definitions",
        captures: {
          "1": {
            name: "keyword.source.rocq"
          },
          "2": {
            name: "keyword.source.rocq"
          },
          "3": {
            name: "entity.name.function.rocq"
          }
        }
      },
      {
        match: "\\b((Show\\s+)?Obligation\\s+Tactic|Obligations\\s+of|Obligation|Next\\s+Obligation(\\s+of)?|Solve\\s+Obligations(\\s+of)?|Solve\\s+All\\s+Obligations|Admit\\s+Obligations(\\s+of)?|Instance)\\b",
        comment: "Obligations",
        captures: {
          "1": {
            name: "keyword.source.rocq"
          }
        }
      },
      {
        match: "\\b(CoInductive|Inductive|Variant|Record|Structure|Class)\\s+(>\\s*)?((\\p{L}|[_\\u00A0])(\\p{L}|[0-9_\\u00A0'])*)",
        comment: "Type declarations",
        captures: {
          "1": {
            name: "keyword.source.rocq"
          },
          "3": {
            name: "entity.name.type.rocq"
          }
        }
      },
      {
        match: "\\b(Ltac)\\s+((\\p{L}|[_\\u00A0])(\\p{L}|[0-9_\\u00A0'])*)",
        comment: "Ltac declarations",
        captures: {
          "1": {
            name: "keyword.source.rocq"
          },
          "2": {
            name: "entity.name.function.ltac"
          }
        }
      },
      {
        match: "\\b(Ltac2)\\s+(mutable\\s+)?(rec\\s+)?((\\p{L}|[_\\u00A0])(\\p{L}|[0-9_\\u00A0'])*)",
        comment: "Ltac2 declarations",
        captures: {
          "1": {
            name: "keyword.source.rocq"
          },
          "2": {
            name: "keyword.source.rocq"
          },
          "3": {
            name: "entity.name.function.ltac"
          }
        }
      },
      {
        match: "\\b(Hint(\\s+Mode)?|Create\\s+HintDb|Constructors|Resolve|Rewrite|Ltac|Ltac2|Implicit(\\s+Types?)?|Set|Unset|Remove\\s+Printing|Arguments|((Tactic|Reserved)\\s+)?Notation|Infix|Section|Module(\\s+Type)?|End|Check|Print(\\s+All)?|Eval|Compute|Search|Universe|Coercions|Generalizable(\\s+(All|Variable))?|Existing(\\s+(Class|Instance))?|Canonical|About|Locate|Collection|Typeclasses\\s+(Opaque|Transparent))\\b",
        comment: "Vernacular keywords",
        name: "keyword.source.rocq"
      },
      {
        match: "\\b(Proof|Qed|Defined|Save|Abort(\\s+All)?|Undo(\\s+To)?|Restart|Focus|Unfocus|Unfocused|Show\\s+Proof|Show\\s+Existentials|Show|Unshelve)\\b",
        comment: "Proof keywords",
        name: "keyword.source.rocq"
      },
      {
        match: "\\b(Quit|Drop|Time|Redirect|Timeout|Fail)\\b",
        comment: "Vernacular Debug keywords",
        name: "keyword.debug.rocq"
      },
      {
        match: "\\b(admit|Admitted)\\b",
        comment: "Admits are bad",
        name: "invalid.illegal.admit.rocq"
      },
      {
        match: ":|\\||=|<|>|\\*|\\+|-|\\{|\\}|\u2260|\u2228|\u2227|\u2194|\xAC|\u2192|\u2264|\u2265",
        comment: "Operators",
        name: "keyword.operator.rocq"
      },
      {
        match: "\\b(forall|exists|Type|Set|Prop|nat|bool|option|list|unit|sum|prod|comparison|Empty_set)\\b|\u2200|\u2203",
        comment: "Type keywords",
        name: "support.type.rocq"
      },
      {
        match: "\\b(try|repeat|rew|progress|fresh|solve|now|first|tryif|at|once|do|only)\\b",
        comment: "Ltac keywords",
        name: "keyword.control.ltac"
      },
      {
        match: "\\b(into|with|eqn|by|move|as|using)\\b",
        comment: "Common Ltac connectors",
        name: "keyword.control.ltac"
      },
      {
        match: "\\b(match|lazymatch|multimatch|match!|lazy_match!|multi_match!|fun|with|return|end|let|in|if|then|else|fix|for|where|and)\\b|\u03BB",
        comment: "Gallina keywords",
        name: "keyword.control.gallina"
      },
      {
        match: "\\b(intro|intros|revert|induction|destruct|auto|eauto|tauto|eassumption|apply|eapply|assumption|constructor|econstructor|reflexivity|inversion|injection|assert|split|esplit|omega|fold|unfold|specialize|rewrite|erewrite|change|symmetry|refine|simpl|intuition|firstorder|generalize|idtac|exist|exists|eexists|elim|eelim|rename|subst|congruence|trivial|left|right|set|pose|discriminate|clear|clearbody|contradict|contradiction|exact|dependent|remember|case|easy|unshelve|pattern|transitivity|etransitivity|f_equal|exfalso|replace|abstract|cycle|swap|revgoals|shelve|unshelve)\\b",
        comment: "Ltac builtins",
        name: "support.function.builtin.ltac"
      },
      {
        applyEndPatternLast: 1,
        begin: "\\(\\*\\*(?!\\*)",
        end: "\\*\\)",
        name: "comment.doc.rocq",
        patterns: [
          {
            include: "#doc_comment"
          },
          {
            include: "#block_comment"
          },
          {
            include: "#block_double_quoted_string"
          }
        ]
      },
      {
        applyEndPatternLast: 1,
        begin: "\\(\\*(?!#)",
        end: "\\*\\)",
        name: "comment.block.rocq",
        patterns: [
          {
            include: "#block_comment"
          },
          {
            include: "#block_double_quoted_string"
          }
        ]
      },
      {
        match: "\\b((0(x|X)[0-9a-fA-F]+)|([0-9]+(\\.[0-9]+)?))\\b",
        name: "constant.numeric.gallina"
      },
      {
        match: "\\b(True|False|tt|false|true|Some|None|nil|cons|pair|inl|inr|O|S|Eq|Lt|Gt|id|ex|all|unique)\\b",
        comment: "Gallina builtin constructors",
        name: "constant.language.constructor.gallina"
      },
      {
        match: "\\b_\\b",
        name: "constant.language.wildcard.rocq"
      },
      {
        begin: '"',
        beginCaptures: {
          "0": {
            name: "punctuation.definition.string.begin.rocq"
          }
        },
        end: '"',
        endCaptures: {
          "0": {
            name: "punctuation.definition.string.end.rocq"
          }
        },
        name: "string.quoted.double.rocq"
      }
    ],
    repository: {
      doc_comment: {
        applyEndPatternLast: 1,
        begin: "\\(\\*\\*(?!\\*)",
        end: "\\*\\)",
        name: "comment.doc.rocq",
        patterns: [
          {
            include: "#doc_comment"
          },
          {
            include: "#block_comment"
          },
          {
            include: "#block_double_quoted_string"
          }
        ]
      },
      block_comment: {
        applyEndPatternLast: 1,
        begin: "\\(\\*(?!#)",
        end: "\\*\\)",
        name: "comment.block.rocq",
        patterns: [
          {
            include: "#block_comment"
          },
          {
            include: "#block_double_quoted_string"
          }
        ]
      },
      block_double_quoted_string: {
        applyEndPatternLast: 1,
        begin: '"',
        beginCaptures: {
          "0": {
            name: "punctuation.definition.string.begin.rocq"
          }
        },
        end: '"',
        endCaptures: {
          "0": {
            name: "punctuation.definition.string.end.rocq"
          }
        },
        name: "string.quoted.double.rocq"
      }
    },
    scopeName: "source.rocq",
    uuid: "CDE1AD3A-C094-457D-B321-93009C6BCFDA"
  };

  // src/webview/syntaxes/lean4.json
  var lean4_default = {
    name: "Lean 4",
    scopeName: "source.lean4",
    fileTypes: [],
    patterns: [
      { include: "#comments" },
      { match: "\\b(Prop|Type|Sort)\\b", name: "storage.type.lean4" },
      {
        match: "\\b(attribute\\b\\s*)(?:(\\[[^\\]\\s]*\\])|\\[([^\\]\\s]*))",
        captures: {
          "1": { name: "storage.modifier.lean4" },
          "2": { name: "storage.modifier.lean4" },
          "3": { name: "storage.modifier.lean4" }
        }
      },
      {
        match: "(@)(?:(\\[[^\\]\\s]*\\])|\\[([^\\]\\s]*))",
        captures: {
          "1": { name: "storage.modifier.lean4" },
          "2": { name: "storage.modifier.lean4" },
          "3": { name: "storage.modifier.lean4" }
        }
      },
      {
        match: "\\b(?<!\\.)(local|scoped|partial|unsafe|nonrec|public|private|protected|noncomputable|meta)(?!\\.)\\b",
        name: "storage.modifier.lean4"
      },
      { match: "\\b(sorry|admit|#exit)\\b", name: "invalid.illegal.lean4" },
      {
        match: "#(print|eval|eval!|reduce|synth|widget|where|version|with_exporting|check|check_tactic|check_tactic_failure|check_failure|check_simp|discr_tree_key|discr_tree_simp_key|guard|guard_expr|guard_msgs)\\b",
        name: "keyword.other.lean4"
      },
      {
        match: "\\bderiving\\s+instance\\b",
        name: "keyword.other.command.lean4"
      },
      {
        begin: "\\b(?<!\\.)(inductive|coinductive|structure|theorem|axiom|abbrev|lemma|def|instance|class)\\b\\s+(\\{[^}]*\\})?",
        beginCaptures: {
          "1": { name: "keyword.other.definitioncommand.lean4" }
        },
        patterns: [{ include: "#comments" }, { include: "#definitionName" }, { match: "," }],
        end: "(?=\\bwith\\b|\\bextends\\b|\\bwhere\\b|[:\\|\\(\\[\\{\u2983<>])",
        name: "meta.definitioncommand.lean4"
      },
      {
        match: "\\b(?<!\\.)(theorem|show|have|using|haveI|from|suffices|nomatch|nofun|no_index|def|class|structure|instance|elab|set_option|initialize|builtin_initialize|example|inductive_fixpoint|inductive|coinductive_fixpoint|coinductive|termination_by\\?|termination_by|decreasing_by|partial_fixpoint|axiom|universe|variable|module|import all|import|open|export|prelude|renaming|hiding|do|by\\?|by|let|letI|let_expr|extends|mutual|mut|where|rec|declare_syntax_cat|syntax|macro_rules|macro|binop_lazy%|binop%|unop%|binrel_no_prop%|binrel%|leftact%|rightact%|max_prec|leading_parser|elab_rules|deriving|fun|section|namespace|end|prefix|postfix|infixl|infixr|infix|notation|abbrev|if|bif|then|else|calc|matches|match_expr|match|with|forall|for|while|repeat|unless|until|panic!|unreachable!|assert!|try|catch|finally|return|continue|break|exists|mod_cast|exact\\?%|include_str|include|in|trailing_parser|tactic_tag|tactic_alt|tactic_extension|register_tactic_tag|type_of%|binder_predicate|grind_propagator|builtin_grind_propagator|grind_pattern|simproc|builtin_simproc|simproc_pattern%|builtin_simproc_pattern%|simproc_decl|builtin_simproc_decl|dsimproc|builtin_dsimproc|dsimproc_decl|builtin_dsimproc_decl|show_panel_widgets|show_term|seal|unseal|nat_lit|norm_cast_add_elim|println!|private_decl%|declare_config_elab|decl_name%|register_error_explanation|register_builtin_option|register_option|register_parser_alias|register_simp_attr|register_linter_set|register_label_attr|recommended_spelling|reportIssue!|reprove|run_elab|run_cmd|run_meta|value_of%|add_decl_doc|omit|opaque|json%|dbg_trace|trace_goal\\[[^\\]\\s]*\\]|trace\\[[^\\]\\s]*\\]|throwErrorAt|throwError|throwNamedErrorAt|throwNamedError|logNamedWarningAt|logNamedWarning|logNamedErrorAt|logNamedError)(?!\\.)\\b",
        name: "keyword.other.lean4"
      },
      { begin: "\xAB", end: "\xBB", contentName: "entity.name.lean4" },
      {
        begin: '(s!|m!|throwError|dbg_trace|panic!|reportIssue!|(?:trace_goal|trace)\\[[^\\]\\s]*\\])\\s*"',
        end: '"',
        name: "string.interpolated.lean4",
        beginCaptures: {
          "1": { name: "keyword.other.lean4" }
        },
        patterns: [
          {
            begin: "(\\{)",
            end: "(\\})",
            beginCaptures: { "1": { name: "keyword.other.lean4" } },
            endCaptures: { "1": { name: "keyword.other.lean4" } },
            patterns: [{ include: "$self" }]
          },
          { match: `\\\\[\\\\"ntr']`, name: "constant.character.escape.lean4" },
          { match: "\\\\x[0-9A-Fa-f][0-9A-Fa-f]", name: "constant.character.escape.lean4" },
          {
            match: "\\\\u[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]",
            name: "constant.character.escape.lean4"
          }
        ]
      },
      {
        begin: '"',
        end: '"',
        name: "string.quoted.double.lean4",
        patterns: [
          { match: `\\\\[\\\\"ntr']`, name: "constant.character.escape.lean4" },
          { match: "\\\\x[0-9A-Fa-f][0-9A-Fa-f]", name: "constant.character.escape.lean4" },
          {
            match: "\\\\u[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]",
            name: "constant.character.escape.lean4"
          }
        ]
      },
      { name: "constant.language.lean4", match: "\\b(true|false)\\b" },
      { name: "string.quoted.single.lean4", match: "(?<!\\]|\\w)'[^\\\\']'" },
      {
        name: "string.quoted.single.lean4",
        match: "(?<!\\]|\\w)'(\\\\(x[0-9A-Fa-f][0-9A-Fa-f]|u[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]|.))'",
        captures: { "1": { name: "constant.character.escape.lean4" } }
      },
      {
        match: "\\b([0-9]+|0([xX][0-9a-fA-F]+)|[-]?(0|[1-9][0-9]*)(\\.[0-9]+)?([eE][+-]?[0-9]+)?)\\b",
        name: "constant.numeric.lean4"
      }
    ],
    repository: {
      definitionName: {
        patterns: [
          {
            match: "\\b[^:\xAB\xBB\\(\\)\\{\\}[:space:]=\u2192\u03BB\u2200?][^:\xAB\xBB\\(\\)\\{\\}[:space:]]*",
            name: "entity.name.function.lean4"
          },
          { begin: "\xAB", end: "\xBB", contentName: "entity.name.function.lean4" }
        ]
      },
      dashComment: {
        begin: "--",
        end: "$",
        name: "comment.line.double-dash.lean4",
        patterns: [{ include: "source.lean4.markdown" }]
      },
      docComment: {
        begin: "/--",
        end: "-/",
        name: "comment.block.documentation.lean4",
        patterns: [{ include: "source.lean4.markdown" }, { include: "#blockComment" }]
      },
      modDocComment: {
        begin: "/-!",
        end: "-/",
        name: "comment.block.documentation.lean4",
        patterns: [{ include: "source.lean4.markdown" }, { include: "#blockComment" }]
      },
      blockComment: {
        begin: "/-",
        end: "-/",
        name: "comment.block.lean4",
        patterns: [{ include: "source.lean4.markdown" }, { include: "#blockComment" }]
      },
      comments: {
        patterns: [
          { include: "#dashComment" },
          { include: "#docComment" },
          { include: "#modDocComment" },
          { include: "#blockComment" }
        ]
      }
    }
  };

  // src/webview/syntaxHighlighter.js
  var enhancedRocq = {
    ...rocq_tmLanguage_default,
    name: "rocq",
    aliases: ["coq"],
    patterns: [
      {
        match: "^([a-zA-Z_][\\w\\u00A0']*(?:\\s*,\\s*[a-zA-Z_][\\w\\u00A0']*)*)\\s*(?=:)",
        name: "variable.other.hypothesis.rocq"
      },
      ...rocq_tmLanguage_default.patterns
    ]
  };
  var enhancedLean = {
    ...lean4_default,
    name: "lean4",
    aliases: ["lean"],
    patterns: [
      {
        match: "^([a-zA-Z_][\\w']*(?:\\s*,\\s*[a-zA-Z_][\\w']*)*)\\s*(?=:)",
        name: "variable.other.hypothesis.lean4"
      },
      {
        match: "\\b(Nat|Int|String|Bool|Char|Float|Option|List|Array|Vector|Fin|UInt8|UInt16|UInt32|UInt64|USize)\\b",
        name: "support.type.lean4"
      },
      {
        match: "\u22A2|\\|-",
        name: "keyword.operator.turnstile.lean4"
      },
      ...lean4_default.patterns
    ]
  };
  var highlighterPromise = null;
  var highlighterInstance = null;
  async function getHighlighter() {
    if (highlighterInstance) {
      return highlighterInstance;
    }
    if (!highlighterPromise) {
      highlighterPromise = createHighlighterCore({
        engine: createJavaScriptRegexEngine(),
        langs: [enhancedRocq, enhancedLean],
        themes: [dark_plus_default, light_plus_default]
      }).then((h2) => {
        highlighterInstance = h2;
        return h2;
      }).catch((err) => {
        console.error("Failed to initialize Shiki highlighter:", err);
        highlighterPromise = null;
        throw err;
      });
    }
    return highlighterPromise;
  }
  function isThemeLight() {
    return typeof document !== "undefined" && document.body.classList.contains("vscode-light");
  }
  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function highlightCodeHtml(code, lang = "rocq") {
    if (!highlighterInstance || !code) {
      return escapeHtml(code);
    }
    const theme = isThemeLight() ? "light-plus" : "dark-plus";
    const targetLang = lang === "lean" || lang === "lean4" ? "lean4" : "rocq";
    try {
      return highlighterInstance.codeToHtml(code, {
        lang: targetLang,
        theme,
        structure: "inline"
      });
    } catch {
      return escapeHtml(code);
    }
  }

  // src/webview/chatStreamUi.js
  getHighlighter().catch(() => {
  });
  d.use({
    renderer: {
      code({ text: text3, lang }) {
        const cleanLang = (lang || "").trim().toLowerCase();
        const highlighted = highlightCodeHtml(text3, cleanLang);
        return `<pre><code class="language-${cleanLang || "text"}">${highlighted}</code></pre>`;
      }
    }
  });
  var chatLog = null;
  var chatTypingIndicator = null;
  var currentTurnElem = null;
  var mainResponseElem = null;
  var toolDetailsElem = null;
  var toolSummaryElem = null;
  var toolLogElem = null;
  var streamBuffer = "";
  var toolCallCount = 0;
  function initChatStreamUi(options = {}) {
    chatLog = options.chatLog ?? document.getElementById("chatLog");
    chatTypingIndicator = options.chatTypingIndicator ?? document.getElementById("chatTypingIndicator");
  }
  function setTypingIndicator(visible) {
    if (chatTypingIndicator) {
      chatTypingIndicator.classList.toggle("visible", !!visible);
      chatTypingIndicator.setAttribute("aria-hidden", !visible);
    }
  }
  function renderMarkdownWithMath(text3) {
    if (!text3) {
      return "";
    }
    const blockPlaceholders = [];
    const inlinePlaceholders = [];
    const s2 = String(text3).replace(/\$\$([\s\S]*?)\$\$/g, (_4, math2) => {
      const i2 = blockPlaceholders.length;
      blockPlaceholders.push(math2.trim());
      return `{{MATHB_${i2}}}`;
    }).replace(/\$([^$\n]+)\$/g, (_4, math2) => {
      const i2 = inlinePlaceholders.length;
      inlinePlaceholders.push(math2.trim());
      return `{{MATHI_${i2}}}`;
    });
    let html5 = d.parse(s2);
    const katexOpts = { throwOnError: false, output: "html" };
    blockPlaceholders.forEach((math2, i2) => {
      try {
        html5 = html5.replace(
          `{{MATHB_${i2}}}`,
          katex.renderToString(math2, { ...katexOpts, displayMode: true })
        );
      } catch (_4) {
        html5 = html5.replace(`{{MATHB_${i2}}}`, `<span class="katex-error">$$${math2}$$</span>`);
      }
    });
    inlinePlaceholders.forEach((math2, i2) => {
      try {
        html5 = html5.replace(
          `{{MATHI_${i2}}}`,
          katex.renderToString(math2, { ...katexOpts, displayMode: false })
        );
      } catch (_4) {
        html5 = html5.replace(`{{MATHI_${i2}}}`, `<span class="katex-error">$${math2}$</span>`);
      }
    });
    return html5;
  }
  function scrollChatToBottom() {
    if (chatLog) {
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  }
  function updateToolSummary() {
    if (!toolSummaryElem) {
      return;
    }
    const n = toolCallCount;
    const label = n === 0 ? "Tool activity" : n === 1 ? "1 tool call" : `${n} tool calls`;
    toolSummaryElem.innerHTML = `<span class="tool-summary-icon">\u2699</span> <span class="tool-summary-label">${label}</span>`;
  }
  function ensureAssistantTurn() {
    if (!chatLog) {
      return;
    }
    if (!currentTurnElem) {
      setTypingIndicator(true);
      currentTurnElem = document.createElement("div");
      currentTurnElem.className = "chatMessage assistant streaming";
      const header = document.createElement("div");
      header.className = "chat-message-header assistant-header";
      const role = document.createElement("span");
      role.className = "chat-role-badge assistant-badge";
      role.textContent = "Assistant";
      header.appendChild(role);
      const body3 = document.createElement("div");
      body3.className = "chat-message-body assistant-body";
      mainResponseElem = document.createElement("div");
      mainResponseElem.className = "chat-response-main";
      toolDetailsElem = document.createElement("details");
      toolDetailsElem.className = "chat-tool-activity";
      toolSummaryElem = document.createElement("summary");
      toolSummaryElem.className = "chat-tool-activity-summary";
      toolLogElem = document.createElement("div");
      toolLogElem.className = "chat-tool-activity-log";
      toolDetailsElem.appendChild(toolSummaryElem);
      toolDetailsElem.appendChild(toolLogElem);
      body3.appendChild(mainResponseElem);
      body3.appendChild(toolDetailsElem);
      currentTurnElem.appendChild(header);
      currentTurnElem.appendChild(body3);
      chatLog.appendChild(currentTurnElem);
      streamBuffer = "";
      toolCallCount = 0;
      updateToolSummary();
    }
  }
  function formatToolActivityLabel(activity) {
    const name = activity.toolName ? activity.toolName : "agent";
    switch (activity.kind) {
      case "call":
        return `Model requested: ${name}`;
      case "executing":
        return `Running: ${name}`;
      case "result":
        return `Result: ${name}`;
      case "error":
        return `Error: ${name}`;
      default:
        return activity.toolName ? `Status: ${name}` : "Status";
    }
  }
  function appendChatMessage(text3, cls = "assistant") {
    if (!chatLog) {
      return null;
    }
    const el = document.createElement("div");
    el.className = "chatMessage " + cls;
    const isUser = cls === "user";
    const header = document.createElement("div");
    header.className = `chat-message-header ${isUser ? "user-header" : "assistant-header"}`;
    const role = document.createElement("span");
    role.className = `chat-role-badge ${isUser ? "user-badge" : "assistant-badge"}`;
    if (isUser) {
      role.textContent = "You";
    } else if (text3.startsWith("Suggestion:")) {
      role.textContent = "Suggestion";
    } else if (text3.includes("Prover Agent:")) {
      role.textContent = "Prover Agent";
    } else {
      role.textContent = "Assistant";
    }
    header.appendChild(role);
    const contentElem = document.createElement("div");
    contentElem.className = isUser ? "chat-message-bubble user-bubble" : "chat-message-body assistant-body";
    contentElem.innerHTML = renderMarkdownWithMath(text3);
    el.appendChild(header);
    el.appendChild(contentElem);
    chatLog.appendChild(el);
    scrollChatToBottom();
    return el;
  }
  function appendChatStreamPart(text3) {
    if (!text3 || !chatLog) {
      return;
    }
    ensureAssistantTurn();
    streamBuffer += text3;
    if (currentTurnElem && streamBuffer.includes("Prover Agent:")) {
      const badge = currentTurnElem.querySelector(".assistant-badge");
      if (badge && badge.textContent !== "Prover Agent") {
        badge.textContent = "Prover Agent";
      }
    }
    if (mainResponseElem) {
      mainResponseElem.innerHTML = renderMarkdownWithMath(streamBuffer);
    }
    scrollChatToBottom();
  }
  function appendToolActivity(activity) {
    if (!activity?.detail || !chatLog) {
      return;
    }
    ensureAssistantTurn();
    if (activity.kind === "call") {
      toolCallCount += 1;
      updateToolSummary();
    }
    if (toolDetailsElem) {
      toolDetailsElem.hidden = false;
    }
    const entry = document.createElement("div");
    entry.className = "chat-tool-activity-entry chat-tool-activity-" + (activity.kind || "status");
    const label = document.createElement("div");
    label.className = "chat-tool-activity-entry-label";
    label.textContent = formatToolActivityLabel(activity);
    const body3 = document.createElement("pre");
    body3.className = "chat-tool-activity-entry-body";
    body3.textContent = activity.detail;
    entry.appendChild(label);
    entry.appendChild(body3);
    if (toolLogElem) {
      toolLogElem.appendChild(entry);
    }
    scrollChatToBottom();
  }
  function finalizeChatStream() {
    setTypingIndicator(false);
    if (currentTurnElem) {
      currentTurnElem.classList.remove("streaming");
      if (toolDetailsElem && toolCallCount === 0 && !toolLogElem?.childElementCount) {
        toolDetailsElem.remove();
      }
      if (mainResponseElem && !streamBuffer.trim()) {
        mainResponseElem.remove();
      }
    }
    currentTurnElem = null;
    mainResponseElem = null;
    toolDetailsElem = null;
    toolSummaryElem = null;
    toolLogElem = null;
    streamBuffer = "";
    toolCallCount = 0;
  }
  function resetChatStream() {
    finalizeChatStream();
  }

  // src/webview/chatPanel.js
  var vscode = typeof acquireVsCodeApi !== "undefined" ? acquireVsCodeApi() : null;
  var chatInput = document.getElementById("chatInput");
  var chatSend = document.getElementById("chatSend");
  var chatStop = document.getElementById("chatStop");
  var synthesizingIndicator = document.getElementById("synthesizingIndicator");
  var popBackBtn = document.getElementById("popBackChat");
  initChatStreamUi({
    chatLog: document.getElementById("chatLog"),
    chatTypingIndicator: document.getElementById("chatTypingIndicator")
  });
  function setSynthesizingIndicator(visible) {
    if (synthesizingIndicator) {
      synthesizingIndicator.classList.toggle("visible", !!visible);
      synthesizingIndicator.setAttribute("aria-hidden", !visible);
    }
  }
  if (chatSend && chatInput && vscode) {
    chatSend.addEventListener("click", () => {
      const prompt = (chatInput.value || "").trim();
      if (!prompt) return;
      appendChatMessage(prompt, "user");
      chatInput.value = "";
      resetChatStream();
      vscode.postMessage({ command: "chat", prompt });
      vscode.postMessage({ type: "chatLogContent", content: (document.getElementById("chatLog") || {}).innerHTML || "" });
    });
  }
  if (chatInput && chatSend) {
    chatInput.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        chatSend.click();
      }
    });
  }
  if (popBackBtn && vscode) {
    popBackBtn.addEventListener("click", () => {
      vscode.postMessage({ command: "popBackChat" });
    });
  }
  var activeModelBadgeChat = document.getElementById("activeModelBadgeChat");
  if (activeModelBadgeChat && vscode) {
    activeModelBadgeChat.addEventListener("click", () => {
      vscode.postMessage({ command: "changeModel" });
    });
  }
  if (chatStop && vscode) {
    chatStop.addEventListener("click", () => {
      vscode.postMessage({ command: "stopGeneration" });
    });
  }
  if (vscode) {
    window.addEventListener("message", (event) => {
      const msg = event.data;
      if (!msg || !msg.type) return;
      switch (msg.type) {
        case "initialChatLogContent":
        case "setChatLogContent": {
          const chatLog2 = document.getElementById("chatLog");
          if (chatLog2 && msg.content != null) {
            chatLog2.innerHTML = msg.content;
            chatLog2.scrollTop = chatLog2.scrollHeight;
          }
          break;
        }
        case "activeModelChanged": {
          const label = document.getElementById("activeModelLabelChat");
          if (label) {
            const provider = msg.provider || "AI";
            const model = msg.model || "Default";
            label.textContent = `Model: ${model} (${provider})`;
          }
          break;
        }
        case "chatResponsePart":
          appendChatStreamPart(msg.text);
          break;
        case "chatToolActivity":
          appendToolActivity(msg.activity);
          break;
        case "chatResponseDone":
          finalizeChatStream();
          vscode.postMessage({ type: "chatLogContent", content: (document.getElementById("chatLog") || {}).innerHTML || "" });
          break;
        case "suggestionNotice":
        case "suggestion": {
          const s2 = msg.suggestion;
          if (!s2 || s2.suggestedValue == null || s2.suggestedValue === "") {
            break;
          }
          const hypName = (s2.hypothesisName || "").trim();
          const isGoal = ["goal", "\u22A2", "|-"].includes(hypName.toLowerCase()) || hypName === "\u22A2" || hypName === "|-";
          const origVal = s2.originalValue != null && String(s2.originalValue).trim() !== "" && String(s2.originalValue).trim() !== "undefined" ? String(s2.originalValue).trim() : "";
          const isAdd = !isGoal && origVal === "";
          const text3 = isAdd ? `Suggestion: Add hypothesis "${s2.hypothesisName} : ${s2.suggestedValue}"${s2.reason ? ` (${s2.reason})` : ""}` : isGoal && !origVal ? `Suggestion: Update goal to "${s2.suggestedValue}"${s2.reason ? ` (${s2.reason})` : ""}` : `Suggestion: Replace "${origVal || "current value"}" with "${s2.suggestedValue}" in hypothesis "${s2.hypothesisName || "Goal"}"${s2.reason ? ` (${s2.reason})` : ""}`;
          appendChatMessage(text3, "assistant");
          break;
        }
        case "proverAgentStarted":
          setSynthesizingIndicator(true);
          break;
        case "proverAgentDone":
        case "proofSuggestionApplied":
          setSynthesizingIndicator(false);
          break;
        default:
          break;
      }
    });
  }
})();
