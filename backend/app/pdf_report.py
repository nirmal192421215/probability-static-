from io import BytesIO
from datetime import datetime

from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.shapes import Drawing
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

NAVY = colors.HexColor("#0B1F3A")
BLUE = colors.HexColor("#1D4ED8")
LIGHT = colors.HexColor("#F4F7FB")
MUTED = colors.HexColor("#64748B")


def build_student_pdf(student: dict, stats: dict, pred: dict, recs: list, cond: dict, bayes: dict) -> bytes:
    buf = BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
        title=f"Academic Report — {student.get('name')}",
    )
    styles = getSampleStyleSheet()
    title = ParagraphStyle("T", parent=styles["Title"], textColor=NAVY, fontSize=16, spaceAfter=6)
    h2 = ParagraphStyle("H2", parent=styles["Heading2"], textColor=NAVY, fontSize=12, spaceBefore=10, spaceAfter=6)
    body = ParagraphStyle("B", parent=styles["BodyText"], textColor=colors.HexColor("#1E293B"), fontSize=9, leading=13)
    small = ParagraphStyle("S", parent=styles["BodyText"], textColor=MUTED, fontSize=8)

    story = [
        Paragraph("EduWise Academic Intelligence", title),
        Paragraph(
            "Statistical Analysis and Prediction of Student Academic Performance Using Probability Models",
            small,
        ),
        Paragraph(datetime.utcnow().strftime("Generated %d %b %Y, %H:%M UTC"), small),
        Spacer(1, 8),
        Paragraph("Student Information", h2),
    ]

    info = [
        ["Student ID", student.get("studentId"), "Name", student.get("name")],
        ["Department", student.get("department"), "Semester", str(student.get("semester"))],
        ["Attendance", f"{student.get('attendance')}%", "Study Hours", str(student.get("studyHours"))],
        ["Current GPA", str(student.get("currentGPA")), "Previous GPA", str(student.get("previousGPA"))],
        ["Internal Marks", str(student.get("internalMarks")), "Assignment Marks", str(student.get("assignmentMarks"))],
    ]
    t = Table(info, colWidths=[32 * mm, 48 * mm, 38 * mm, 48 * mm])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), LIGHT),
                ("BACKGROUND", (2, 0), (2, -1), LIGHT),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("TEXTCOLOR", (0, 0), (0, -1), NAVY),
                ("TEXTCOLOR", (2, 0), (2, -1), NAVY),
                ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#E2E8F0")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(t)

    story.append(Paragraph("Subject Marks", h2))
    marks = student.get("subjectMarks") or {}
    rows = [["Subject", "Marks %"]] + [[k, str(v)] for k, v in marks.items()]
    mt = Table(rows, colWidths=[90 * mm, 76 * mm])
    mt.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#E2E8F0")),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT]),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(mt)

    story.append(Paragraph("Statistical Summary (cohort parameter snapshot)", h2))
    if stats:
        srows = [
            ["Mean", str(stats.get("mean")), "Median", str(stats.get("median"))],
            ["Std. Deviation", str(stats.get("standardDeviation")), "Variance", str(stats.get("variance"))],
            ["Minimum", str(stats.get("minimum")), "Maximum", str(stats.get("maximum"))],
            ["Q1", str(stats.get("q1")), "Q3", str(stats.get("q3"))],
        ]
        st = Table(srows, colWidths=[40 * mm, 43 * mm, 40 * mm, 43 * mm])
        st.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#E2E8F0")),
                    ("FONTSIZE", (0, 0), (-1, -1), 8),
                    ("BACKGROUND", (0, 0), (0, -1), LIGHT),
                    ("BACKGROUND", (2, 0), (2, -1), LIGHT),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ]
            )
        )
        story.append(st)

    story.append(Paragraph("Probability Analysis", h2))
    story.append(
        Paragraph(
            f"Conditional P(High Performance | High Attendance) = {cond.get('probability')} "
            f"({cond.get('percent')}%). {cond.get('interpretation', '')}",
            body,
        )
    )
    story.append(
        Paragraph(
            f"Bayes posterior P(At Risk | Academic Factors) = {bayes.get('posterior')} "
            f"(prior {bayes.get('prior')}, likelihood {bayes.get('likelihood')}, evidence {bayes.get('evidence')}).",
            body,
        )
    )

    story.append(Paragraph("Performance Prediction & Risk", h2))
    prow = [
        ["Predicted Category", pred.get("predictedPerformance"), "Risk Level", pred.get("riskLevel")],
        ["Pass Probability", f"{pred.get('passProbability')}%", "Fail Probability", f"{pred.get('failProbability')}%"],
        ["Predicted GPA", str(pred.get("predictedGPA")), "Method", "Weighted logistic mapping"],
    ]
    pt = Table(prow, colWidths=[40 * mm, 43 * mm, 40 * mm, 43 * mm])
    pt.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#E2E8F0")),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("BACKGROUND", (0, 0), (0, -1), LIGHT),
                ("BACKGROUND", (2, 0), (2, -1), LIGHT),
                ("TEXTCOLOR", (3, 0), (3, 0), BLUE),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(pt)

    marks = student.get("subjectMarks") or {}
    if marks:
        story.append(Paragraph("Subject Performance Chart", h2))
        drawing = Drawing(400, 160)
        chart = VerticalBarChart()
        chart.x = 40
        chart.y = 20
        chart.height = 120
        chart.width = 340
        chart.data = [list(marks.values())]
        chart.categoryAxis.categoryNames = list(marks.keys())
        chart.valueAxis.valueMin = 0
        chart.valueAxis.valueMax = 100
        chart.bars[0].fillColor = BLUE
        drawing.add(chart)
        story.append(drawing)

    story.append(Paragraph("Recommendations", h2))
    for r in recs:
        story.append(
            Paragraph(
                f"<b>{r.get('priority')} — {r.get('issue')}</b><br/>Evidence: {r.get('evidence')}<br/>"
                f"Recommendation: {r.get('recommendation')}",
                body,
            )
        )
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 12))
    story.append(
        Paragraph(
            "This report is generated by EduWise for academic demonstration. "
            "All statistical measures and probabilities are computed from the current student dataset.",
            small,
        )
    )
    doc.build(story)
    return buf.getvalue()
