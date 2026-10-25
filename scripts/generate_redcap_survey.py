import csv
import xml.etree.ElementTree as ET
from xml.dom import minidom

# Data Dictionary definition
fields = [
    {
        "name": "record_id",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "text",
        "label": "Participant ID",
        "choices": "",
        "note": "",
        "matrix": "",
    },
    # Part 1: Background
    {
        "name": "itp_experience",
        "form": "pilot_study_evaluation",
        "section": "Part 1: Background & Prior Experience",
        "type": "radio",
        "label": "How would you rate your overall experience with Interactive Theorem Provers (Coq, Lean, Isabelle, etc.)?",
        "choices": "1, Novice (Learned concepts, but rarely write independent proofs) | 2, Intermediate (Comfortable with basic tactics, standard datatypes, and induction) | 3, Advanced (Regularly formalize non-trivial math/software verified projects)",
        "note": "",
        "matrix": "",
    },
    {
        "name": "lean4_familiarity",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "Specifically in Lean 4, how familiar are you with its syntax, Mathlib, and tactic vocabulary?",
        "choices": "1, 1 - Never used Lean 4 | 2, 2 - Beginner (tutorial level) | 3, 3 - Intermediate (casual user) | 4, 4 - Advanced (regular user) | 5, 5 - Daily / Expert user",
        "note": "",
        "matrix": "",
    },
    {
        "name": "ai_search_usage",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "In your normal proof workflow, how often do you rely on LLMs (e.g., ChatGPT, Claude) or web search?",
        "choices": "1, Never | 2, Occasionally | 3, Frequently | 4, Almost Always",
        "note": "",
        "matrix": "",
    },
    # Part 2: NASA-TLX Baseline
    {
        "name": "tlx_base_mental",
        "form": "pilot_study_evaluation",
        "section": "Part 2: Cognitive Load (NASA-TLX) - Baseline (Free Web & LLMs)",
        "type": "radio",
        "label": "Mental Demand: How mentally demanding was the baseline task?",
        "choices": "1, 1 - Very Low | 2, 2 | 3, 3 | 4, 4 - Moderate | 5, 5 | 6, 6 | 7, 7 - Very High",
        "note": "",
        "matrix": "nasa_tlx_base",
    },
    {
        "name": "tlx_base_temporal",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "Temporal Demand: How hurried or rushed did you feel to finish within 30 minutes?",
        "choices": "1, 1 - Very Low | 2, 2 | 3, 3 | 4, 4 - Moderate | 5, 5 | 6, 6 | 7, 7 - Very High",
        "note": "",
        "matrix": "nasa_tlx_base",
    },
    {
        "name": "tlx_base_perf",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "Self-Rated Performance: How successful do you think you were in completing the proof? (1 = Failure, 7 = Perfect)",
        "choices": "1, 1 - Very Low | 2, 2 | 3, 3 | 4, 4 - Moderate | 5, 5 | 6, 6 | 7, 7 - Very High",
        "note": "",
        "matrix": "nasa_tlx_base",
    },
    {
        "name": "tlx_base_effort",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "Effort: How hard did you have to work to achieve your level of performance?",
        "choices": "1, 1 - Very Low | 2, 2 | 3, 3 | 4, 4 - Moderate | 5, 5 | 6, 6 | 7, 7 - Very High",
        "note": "",
        "matrix": "nasa_tlx_base",
    },
    {
        "name": "tlx_base_frust",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "Frustration: How insecure, discouraged, irritated, or stressed did you feel?",
        "choices": "1, 1 - Very Low | 2, 2 | 3, 3 | 4, 4 - Moderate | 5, 5 | 6, 6 | 7, 7 - Very High",
        "note": "",
        "matrix": "nasa_tlx_base",
    },
    # Part 2: NASA-TLX ODTP
    {
        "name": "tlx_odtp_mental",
        "form": "pilot_study_evaluation",
        "section": "Part 2: Cognitive Load (NASA-TLX) - Treatment (ODTP Tool Only)",
        "type": "radio",
        "label": "Mental Demand: How mentally demanding was the ODTP tool task?",
        "choices": "1, 1 - Very Low | 2, 2 | 3, 3 | 4, 4 - Moderate | 5, 5 | 6, 6 | 7, 7 - Very High",
        "note": "",
        "matrix": "nasa_tlx_odtp",
    },
    {
        "name": "tlx_odtp_temporal",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "Temporal Demand: How hurried or rushed did you feel to finish within 30 minutes?",
        "choices": "1, 1 - Very Low | 2, 2 | 3, 3 | 4, 4 - Moderate | 5, 5 | 6, 6 | 7, 7 - Very High",
        "note": "",
        "matrix": "nasa_tlx_odtp",
    },
    {
        "name": "tlx_odtp_perf",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "Self-Rated Performance: How successful do you think you were in completing the proof? (1 = Failure, 7 = Perfect)",
        "choices": "1, 1 - Very Low | 2, 2 | 3, 3 | 4, 4 - Moderate | 5, 5 | 6, 6 | 7, 7 - Very High",
        "note": "",
        "matrix": "nasa_tlx_odtp",
    },
    {
        "name": "tlx_odtp_effort",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "Effort: How hard did you have to work to achieve your level of performance?",
        "choices": "1, 1 - Very Low | 2, 2 | 3, 3 | 4, 4 - Moderate | 5, 5 | 6, 6 | 7, 7 - Very High",
        "note": "",
        "matrix": "nasa_tlx_odtp",
    },
    {
        "name": "tlx_odtp_frust",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "Frustration: How insecure, discouraged, irritated, or stressed did you feel?",
        "choices": "1, 1 - Very Low | 2, 2 | 3, 3 | 4, 4 - Moderate | 5, 5 | 6, 6 | 7, 7 - Very High",
        "note": "",
        "matrix": "nasa_tlx_odtp",
    },
    # Part 3: Understanding Baseline
    {
        "name": "und_base_overview",
        "form": "pilot_study_evaluation",
        "section": "Part 3: Understanding & Proof Structure - Baseline",
        "type": "radio",
        "label": "I felt I had a clear overview of the high-level proof structure at all times (Baseline).",
        "choices": "1, 1 - Strongly Disagree | 2, 2 | 3, 3 | 4, 4 - Neutral | 5, 5 | 6, 6 | 7, 7 - Strongly Agree",
        "note": "",
        "matrix": "und_base",
    },
    {
        "name": "und_base_why",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "When a proof step succeeded, I clearly understood why it worked mathematically (Baseline).",
        "choices": "1, 1 - Strongly Disagree | 2, 2 | 3, 3 | 4, 4 - Neutral | 5, 5 | 6, 6 | 7, 7 - Strongly Agree",
        "note": "",
        "matrix": "und_base",
    },
    {
        "name": "und_base_math",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "I spent more time thinking about high-level math strategy rather than fighting syntax or tactic names (Baseline).",
        "choices": "1, 1 - Strongly Disagree | 2, 2 | 3, 3 | 4, 4 - Neutral | 5, 5 | 6, 6 | 7, 7 - Strongly Agree",
        "note": "",
        "matrix": "und_base",
    },
    # Part 3: Understanding ODTP
    {
        "name": "und_odtp_overview",
        "form": "pilot_study_evaluation",
        "section": "Part 3: Understanding & Proof Structure - ODTP Tool",
        "type": "radio",
        "label": "I felt I had a clear overview of the high-level proof structure at all times (ODTP Tool).",
        "choices": "1, 1 - Strongly Disagree | 2, 2 | 3, 3 | 4, 4 - Neutral | 5, 5 | 6, 6 | 7, 7 - Strongly Agree",
        "note": "",
        "matrix": "und_odtp",
    },
    {
        "name": "und_odtp_why",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "When a proof step succeeded, I clearly understood why it worked mathematically (ODTP Tool).",
        "choices": "1, 1 - Strongly Disagree | 2, 2 | 3, 3 | 4, 4 - Neutral | 5, 5 | 6, 6 | 7, 7 - Strongly Agree",
        "note": "",
        "matrix": "und_odtp",
    },
    {
        "name": "und_odtp_math",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "I spent more time thinking about high-level math strategy rather than fighting syntax or tactic names (ODTP Tool).",
        "choices": "1, 1 - Strongly Disagree | 2, 2 | 3, 3 | 4, 4 - Neutral | 5, 5 | 6, 6 | 7, 7 - Strongly Agree",
        "note": "",
        "matrix": "und_odtp",
    },
    {
        "name": "und_open_diff",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "notes",
        "label": "How did your understanding of the theorem's proof steps differ between using the ODTP tool vs. searching the internet / prompting an external LLM?",
        "choices": "",
        "note": "",
        "matrix": "",
    },
    # Part 4: Getting Stuck & Recovering
    {
        "name": "stuck_base_identify",
        "form": "pilot_study_evaluation",
        "section": "Part 4: Getting Stuck & Recovering (Obstacle Navigation)",
        "type": "radio",
        "label": "When I encountered a roadblock, it was easy to identify what was blocking progress (Baseline).",
        "choices": "1, 1 - Strongly Disagree | 2, 2 | 3, 3 | 4, 4 - Neutral | 5, 5 | 6, 6 | 7, 7 - Strongly Agree",
        "note": "",
        "matrix": "stuck_eval",
    },
    {
        "name": "stuck_odtp_identify",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "When I encountered a roadblock, it was easy to identify what was blocking progress (ODTP Tool).",
        "choices": "1, 1 - Strongly Disagree | 2, 2 | 3, 3 | 4, 4 - Neutral | 5, 5 | 6, 6 | 7, 7 - Strongly Agree",
        "note": "",
        "matrix": "stuck_eval",
    },
    {
        "name": "stuck_base_recover",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "I was able to recover quickly from dead ends or incorrect directions (Baseline).",
        "choices": "1, 1 - Strongly Disagree | 2, 2 | 3, 3 | 4, 4 - Neutral | 5, 5 | 6, 6 | 7, 7 - Strongly Agree",
        "note": "",
        "matrix": "stuck_eval",
    },
    {
        "name": "stuck_odtp_recover",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "I was able to recover quickly from dead ends or incorrect directions (ODTP Tool).",
        "choices": "1, 1 - Strongly Disagree | 2, 2 | 3, 3 | 4, 4 - Neutral | 5, 5 | 6, 6 | 7, 7 - Strongly Agree",
        "note": "",
        "matrix": "stuck_eval",
    },
    {
        "name": "stuck_open_moment",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "notes",
        "label": "Describe a specific moment during either task where you felt completely stuck. What caused you to get stuck, and what helped you get unstuck (or kept you stuck)?",
        "choices": "",
        "note": "",
        "matrix": "",
    },
    # Part 5: Collaboration & Agency with ODTP
    {
        "name": "odtp_direct_manip",
        "form": "pilot_study_evaluation",
        "section": "Part 5: ODTP Tool Collaboration & Agency (Treatment Condition)",
        "type": "radio",
        "label": "Direct Manipulation: Editing the proof state directly (output-directed) felt more intuitive than constructing tactic commands manually.",
        "choices": "1, 1 - Strongly Disagree | 2, 2 | 3, 3 | 4, 4 - Neutral | 5, 5 | 6, 6 | 7, 7 - Strongly Agree",
        "note": "",
        "matrix": "odtp_collab",
    },
    {
        "name": "odtp_cognitive_align",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "Cognitive Alignment: The tactics synthesized by the agent matched the mathematical steps I had envisioned in my head.",
        "choices": "1, 1 - Strongly Disagree | 2, 2 | 3, 3 | 4, 4 - Neutral | 5, 5 | 6, 6 | 7, 7 - Strongly Agree",
        "note": "",
        "matrix": "odtp_collab",
    },
    {
        "name": "odtp_division_labor",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "Division of Labor: I felt in control of the high-level strategy (identifying subproblems/lemmas), while the tool handled syntactic execution.",
        "choices": "1, 1 - Strongly Disagree | 2, 2 | 3, 3 | 4, 4 - Neutral | 5, 5 | 6, 6 | 7, 7 - Strongly Agree",
        "note": "",
        "matrix": "odtp_collab",
    },
    {
        "name": "odtp_trust",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "Trust & Transparency: I trusted the suggestions made by the agent without needing to audit them extensively.",
        "choices": "1, 1 - Strongly Disagree | 2, 2 | 3, 3 | 4, 4 - Neutral | 5, 5 | 6, 6 | 7, 7 - Strongly Agree",
        "note": "",
        "matrix": "odtp_collab",
    },
    {
        "name": "odtp_open_rejection",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "notes",
        "label": "When the agent proposed a tactic that you rejected or had to modify, why did you reject it? (e.g., solved wrong goal, unnatural syntax, took the proof in an undesirable direction)",
        "choices": "",
        "note": "",
        "matrix": "",
    },
    # Part 6: Head-to-Head & Reflection
    {
        "name": "compare_speed",
        "form": "pilot_study_evaluation",
        "section": "Part 6: Head-to-Head Comparison & Reflection",
        "type": "radio",
        "label": "Which condition allowed you to make progress faster?",
        "choices": "1, Condition 1 (Baseline: Free Internet / External LLMs) | 2, Condition 2 (Treatment: ODTP Tool Only) | 3, Both felt about the same",
        "note": "",
        "matrix": "",
    },
    {
        "name": "compare_preference",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "radio",
        "label": "If you were formalizing proofs in Lean tomorrow, which approach would you prefer?",
        "choices": "1, Standard Lean editor + browser / ChatGPT / Claude in another tab | 2, Lean editor + Output-Directed Theorem Prover panel | 3, A hybrid of both",
        "note": "",
        "matrix": "",
    },
    {
        "name": "odtp_frustration",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "notes",
        "label": "What was the single most frustrating or unintuitive part of using the ODTP tool?",
        "choices": "",
        "note": "",
        "matrix": "",
    },
    {
        "name": "odtp_helpful",
        "form": "pilot_study_evaluation",
        "section": "",
        "type": "notes",
        "label": "What was the single most helpful or powerful part of using the ODTP tool?",
        "choices": "",
        "note": "",
        "matrix": "",
    },
]

# 1. Generate CSV Data Dictionary
csv_path = "survey/odtp_pilot_survey_data_dictionary.csv"
fieldnames = [
    "Variable / Field Name",
    "Form Name",
    "Section Header",
    "Field Type",
    "Field Label",
    "Choices, Calculations, OR Slider Labels",
    "Field Note",
    "Text Validation Type OR Show Slider Number",
    "Text Validation Min",
    "Text Validation Max",
    "Identifier?",
    "Branching Logic (Show field only if...)",
    "Required Field?",
    "Custom Alignment",
    "Question Number (surveys only)",
    "Matrix Group Name",
    "Matrix Ranking?",
    "Field Annotation",
]

with open(csv_path, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    for item in fields:
        writer.writerow({
            "Variable / Field Name": item["name"],
            "Form Name": item["form"],
            "Section Header": item["section"],
            "Field Type": item["type"],
            "Field Label": item["label"],
            "Choices, Calculations, OR Slider Labels": item["choices"],
            "Field Note": item["note"],
            "Text Validation Type OR Show Slider Number": "",
            "Text Validation Min": "",
            "Text Validation Max": "",
            "Identifier?": "",
            "Branching Logic (Show field only if...)": "",
            "Required Field?": "y" if item["type"] != "notes" else "",
            "Custom Alignment": "",
            "Question Number (surveys only)": "",
            "Matrix Group Name": item["matrix"],
            "Matrix Ranking?": "",
            "Field Annotation": "",
        })

print(f"Generated {csv_path}")

# 2. Generate CDISC ODM XML
ET.register_namespace("", "http://www.cdisc.org/ns/odm/v1.3")
ET.register_namespace("redcap", "https://projectredcap.org")

odm = ET.Element("{http://www.cdisc.org/ns/odm/v1.3}ODM", {
    "ODMVersion": "1.3.1",
    "FileOID": "04c6e7f6-odtp-survey",
    "FileType": "Snapshot",
    "Description": "ODTP Pilot User Study Survey",
    "CreationDateTime": "2026-10-25T01:36:00",
})

study = ET.SubElement(odm, "{http://www.cdisc.org/ns/odm/v1.3}Study", {"OID": "Project.ODTP_Pilot_Study"})
gv = ET.SubElement(study, "{http://www.cdisc.org/ns/odm/v1.3}GlobalVariables")
ET.SubElement(gv, "{http://www.cdisc.org/ns/odm/v1.3}StudyName").text = "ODTP Pilot User Study Evaluation"
ET.SubElement(gv, "{http://www.cdisc.org/ns/odm/v1.3}StudyDescription").text = "Evaluation survey comparing baseline interactive theorem proving against Output-Directed Theorem Proving in Lean 4."
ET.SubElement(gv, "{http://www.cdisc.org/ns/odm/v1.3}ProtocolName").text = "ODTP_Pilot_Evaluation"
ET.SubElement(gv, "{https://projectredcap.org}SurveysEnabled").text = "1"
ET.SubElement(gv, "{https://projectredcap.org}RecordIdFieldName").text = "record_id"

# Survey definition
surveys_group = ET.SubElement(gv, "{https://projectredcap.org}SurveysGroup")
survey_node = ET.SubElement(surveys_group, "{https://projectredcap.org}Surveys", {
    "form_name": "pilot_study_evaluation",
    "title": "ODTP Pilot User Study Evaluation Survey",
    "instructions": "<p>Thank you for participating in our Output-Directed Theorem Proving pilot study. Please answer the following questions regarding your experience across the two tasks.</p>",
    "acknowledgement": "<p>Thank you! Your feedback has been recorded.</p>",
})

mdv = ET.SubElement(study, "{http://www.cdisc.org/ns/odm/v1.3}MetaDataVersion", {
    "OID": "Metadata.ODTP_Pilot_Study_1",
    "Name": "ODTP Pilot Study Evaluation Metadata",
})

protocol = ET.SubElement(mdv, "{http://www.cdisc.org/ns/odm/v1.3}Protocol")
ET.SubElement(protocol, "{http://www.cdisc.org/ns/odm/v1.3}StudyEventRef", {"StudyEventOID": "Event.1", "Mandatory": "Yes"})

form_def = ET.SubElement(mdv, "{http://www.cdisc.org/ns/odm/v1.3}FormDef", {
    "OID": "Form.pilot_study_evaluation",
    "Name": "Pilot Study Evaluation",
    "Repeating": "No",
    "{https://projectredcap.org}FormName": "pilot_study_evaluation",
})
ET.SubElement(form_def, "{http://www.cdisc.org/ns/odm/v1.3}ItemGroupRef", {
    "ItemGroupOID": "ItemGroup.pilot_study_evaluation",
    "Mandatory": "Yes",
})

item_group_def = ET.SubElement(mdv, "{http://www.cdisc.org/ns/odm/v1.3}ItemGroupDef", {
    "OID": "ItemGroup.pilot_study_evaluation",
    "Name": "Pilot Study Evaluation Fields",
    "Repeating": "No",
})

# Build ItemDefs and CodeLists
code_lists = {}

for item in fields:
    ET.SubElement(item_group_def, "{http://www.cdisc.org/ns/odm/v1.3}ItemRef", {
        "ItemOID": f"Item.{item['name']}",
        "Mandatory": "Yes" if item["type"] != "notes" else "No",
    })

    item_attrs = {
        "OID": f"Item.{item['name']}",
        "Name": item["name"],
        "{https://projectredcap.org}FieldType": item["type"],
    }
    if item["section"]:
        item_attrs["{https://projectredcap.org}SectionHeader"] = item["section"]
    if item["matrix"]:
        item_attrs["{https://projectredcap.org}MatrixGroupName"] = item["matrix"]

    if item["type"] == "text":
        item_attrs["DataType"] = "text"
    elif item["type"] == "notes":
        item_attrs["DataType"] = "text"
    elif item["type"] == "radio":
        item_attrs["DataType"] = "integer"

    item_def = ET.SubElement(mdv, "{http://www.cdisc.org/ns/odm/v1.3}ItemDef", item_attrs)
    q = ET.SubElement(item_def, "{http://www.cdisc.org/ns/odm/v1.3}Question")
    ET.SubElement(q, "{http://www.cdisc.org/ns/odm/v1.3}TranslatedText").text = item["label"]

    if item["choices"]:
        cl_oid = f"CodeList.{item['name']}"
        ET.SubElement(item_def, "{http://www.cdisc.org/ns/odm/v1.3}CodeListRef", {"CodeListOID": cl_oid})
        code_lists[cl_oid] = (item["name"], item["choices"])

for cl_oid, (cl_name, raw_choices) in code_lists.items():
    cl = ET.SubElement(mdv, "{http://www.cdisc.org/ns/odm/v1.3}CodeList", {
        "OID": cl_oid,
        "Name": cl_name,
        "DataType": "integer",
    })
    for part in raw_choices.split(" | "):
        val_str, label_str = part.split(", ", 1)
        cli = ET.SubElement(cl, "{http://www.cdisc.org/ns/odm/v1.3}CodeListItem", {"CodedValue": val_str.strip()})
        dec = ET.SubElement(cli, "{http://www.cdisc.org/ns/odm/v1.3}Decode")
        ET.SubElement(dec, "{http://www.cdisc.org/ns/odm/v1.3}TranslatedText").text = label_str.strip()

xml_str = ET.tostring(odm, encoding="utf-8")
parsed = minidom.parseString(xml_str)
pretty_xml = parsed.toprettyxml(indent="  ", encoding="utf-8")

xml_path = "survey/odtp_pilot_survey_redcap.xml"
with open(xml_path, "wb") as f:
    f.write(pretty_xml)

print(f"Generated {xml_path}")
