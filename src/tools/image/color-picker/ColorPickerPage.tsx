import { useState, useCallback } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolInput } from '@/components/tools/ToolInput';
import { ToolOutput } from '@/components/tools/ToolOutput';
import styles from './ColorPickerPage.module.css';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPickerPage() {
  const [color, setColor] = useState('#3b82f6');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleColorChange = useCallback((hex: string) => {
    setColor(hex);
    const rgb = hexToRgb(hex);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setOutput(`HEX: ${hex}\nRGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\nHSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    }
  }, []);

  const handleInputConvert = useCallback(() => {
    if (!input.trim()) { setOutput(''); return; }
    const val = input.trim();
    const rgb = hexToRgb(val.startsWith('#') ? val : '#' + val);
    if (rgb && val.match(/^#?[a-f\d]{6}$/i)) {
      handleColorChange(val.startsWith('#') ? val : '#' + val);
      return;
    }
    const rgbaMatch = val.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (rgbaMatch) {
      const r = Number(rgbaMatch[1]), g = Number(rgbaMatch[2]), b = Number(rgbaMatch[3]);
      const hex = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
      handleColorChange(hex);
      return;
    }
    setOutput('无法解析，请输入 HEX (#3b82f6) 或 RGB (rgb(59,130,246)) 格式');
  }, [input]);

  return (
    <div className={styles.page}>
      <ToolHeader title="颜色选择器" description="颜色拾取与 HEX/RGB/HSL 格式转换" />
      <div className={styles.workspace}>
        <div className={styles.colorRow}>
          <input type="color" value={color} onChange={(e) => handleColorChange(e.target.value)} className={styles.picker} />
          <div className={styles.swatch} style={{ backgroundColor: color }} />
          <span className={styles.hexValue}>{color}</span>
        </div>
        <ToolOutput value={output} label="颜色值" showCopy={false} />
        <div className={styles.divider}>或输入颜色值转换</div>
        <div className={styles.controls}>
          <ToolInput value={input} onChange={setInput} placeholder="输入 HEX (#fff) 或 RGB (rgb(255,255,255))..." rows={2} />
          <button className={styles.btn} onClick={handleInputConvert}>转换</button>
        </div>
      </div>
    </div>
  );
}
