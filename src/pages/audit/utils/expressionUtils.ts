import type { ApprovalContext } from './types';

/**
 * 解析并评估审批规则表达式
 * @param expression 规则表达式，如 "A && (B || C)"
 * @param context 上下文对象，包含每个审批人的审批状态
 * @returns 表达式评估结果
 */
export const evaluateRule = (expression: string, context: ApprovalContext): boolean => {
  try {
    // 验证表达式只包含合法的操作符和变量
    validateExpression(expression);

    // 替换表达式中的变量为实际值
    let jsExpression = expression;

    // 替换所有变量为其在上下文中的值
    Object.entries(context).forEach(([key, value]) => {
      // 使用正则表达式确保只替换完整的变量名
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      jsExpression = jsExpression.replace(regex, value ? 'true' : 'false');
    });

    // 安全地评估表达式
    return evaluateExpression(jsExpression);
  } catch (error) {
    console.error('表达式解析错误:', error, { expression });
    return false;
  }
};

/**
 * 验证表达式是否只包含合法的操作符和变量
 * @param expression 规则表达式
 * @throws 如果表达式包含非法字符
 */
const validateExpression = (expression: string): void => {
  // 只允许变量名、逻辑操作符和括号
  const validExpressionRegex = /^[A-Za-z0-9_\s&|!()]+$/;
  if (!validExpressionRegex.test(expression)) {
    throw new Error('表达式包含非法字符');
  }

  // 检查括号是否匹配
  let bracketCount = 0;
  for (const char of expression) {
    if (char === '(') bracketCount++;
    if (char === ')') bracketCount--;
    if (bracketCount < 0) throw new Error('表达式括号不匹配');
  }
  if (bracketCount !== 0) throw new Error('表达式括号不匹配');
};

/**
 * 安全地评估布尔表达式
 * @param expression 已替换变量的表达式
 * @returns 表达式评估结果
 */
const evaluateExpression = (expression: string): boolean => {
  // 替换所有变量名为true或false后，表达式应该只包含true、false、&&、||、!和括号
  const validResultExpressionRegex = /^[truefalse\s&|!()]+$/;
  if (!validResultExpressionRegex.test(expression)) {
    throw new Error('表达式包含未替换的变量');
  }

  // 使用递归下降解析器评估表达式
  const tokens = tokenize(expression);
  const parser = new ExpressionParser(tokens);
  return parser.parse();
};

/**
 * 将表达式字符串转换为标记数组
 * @param expression 表达式字符串
 * @returns 标记数组
 */
const tokenize = (expression: string): string[] => {
  const result: string[] = [];
  let current = '';

  for (const char of expression) {
    if (char === ' ' || char === '\t' || char === '\n') {
      if (current) {
        result.push(current);
        current = '';
      }
      continue;
    }

    if (char === '(' || char === ')' || char === '&' || char === '|' || char === '!') {
      if (current) {
        result.push(current);
        current = '';
      }

      if (char === '&' || char === '|') {
        // 处理 && 和 ||
        if (result.length > 0 && result[result.length - 1] === char) {
          result[result.length - 1] += char;
        } else {
          result.push(char);
        }
      } else {
        result.push(char);
      }
    } else {
      current += char;
    }
  }

  if (current) {
    result.push(current);
  }

  return result;
};

/**
 * 表达式解析器类
 */
class ExpressionParser {
  private tokens: string[];
  private position = 0;

  constructor(tokens: string[]) {
    this.tokens = tokens;
  }

  /**
   * 解析表达式
   * @returns 表达式评估结果
   */
  parse(): boolean {
    return this.parseExpression();
  }

  /**
   * 解析表达式
   * @returns 表达式评估结果
   */
  private parseExpression(): boolean {
    return this.parseOr();
  }

  /**
   * 解析或表达式
   * @returns 表达式评估结果
   */
  private parseOr(): boolean {
    let result = this.parseAnd();

    while (this.position < this.tokens.length && this.tokens[this.position] === '||') {
      this.position++;
      result = result || this.parseAnd();
    }

    return result;
  }

  /**
   * 解析与表达式
   * @returns 表达式评估结果
   */
  private parseAnd(): boolean {
    let result = this.parseNot();

    while (this.position < this.tokens.length && this.tokens[this.position] === '&&') {
      this.position++;
      result = result && this.parseNot();
    }

    return result;
  }

  /**
   * 解析非表达式
   * @returns 表达式评估结果
   */
  private parseNot(): boolean {
    if (this.position < this.tokens.length && this.tokens[this.position] === '!') {
      this.position++;
      return !this.parseNot();
    }

    return this.parsePrimary();
  }

  /**
   * 解析基本表达式
   * @returns 表达式评估结果
   */
  private parsePrimary(): boolean {
    if (this.position >= this.tokens.length) {
      throw new Error('表达式不完整');
    }

    const token = this.tokens[this.position];
    this.position++;

    if (token === '(') {
      const result = this.parseExpression();

      if (this.position >= this.tokens.length || this.tokens[this.position] !== ')') {
        throw new Error('缺少右括号');
      }

      this.position++;
      return result;
    }

    if (token === 'true') return true;
    if (token === 'false') return false;

    throw new Error(`无效的标记: ${token}`);
  }
}

/**
 * 检查表达式中是否包含指定的审批人
 * @param expression 规则表达式
 * @param approverCode 审批人编码
 * @returns 是否包含该审批人
 */
export const expressionContainsApprover = (expression: string, approverCode: string): boolean => {
  // 使用正则表达式检查完整的变量名
  const regex = new RegExp(`\\b${approverCode}\\b`);
  return regex.test(expression);
};
