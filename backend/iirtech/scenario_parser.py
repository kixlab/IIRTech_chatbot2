from django.contrib.staticfiles.templatetags.staticfiles import static
import openpyxl

def parser(fname="scenario/L4-M99-S186-107.xlsx"):
    scenario = static(fname)
    wb = openpyxl.load_workbook(scenario, read_only=True, data_only=True)
    sheet_ranges = wb['Sheet 1']
    _level = ''
    _process = ''
    lines = ''
    for idx, row in enumerate(sheet_ranges.rows):
        if idx <5:
            for cell in row:
                if cell.value:
                    print(cell,idx, cell.value)
        else:
            _type = ''
            _content = ''
            for cell in row:
                if cell.value:
                    if cell.column=="A":
                        _level = cell.value
                    elif cell.column=="B":
                        _process = cell.value
                    elif cell.column=="C":
                        _type = cell.value
                        if _type == "교사":
                            _type= '<bw>'
                        elif _type == "학생":
                            _type = '<uw>'
                    elif cell.column=="D":
                        _content = cell.value
                        _content = _content.format(name="사용자")
            if _type and _content:
                lines = lines + _type + _content + '\n'
                print("%s %s %s %s" %(_level, _process, _type, _content))
    return (lines.strip())
# parser()