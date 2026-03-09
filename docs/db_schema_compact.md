# DB Schema Compact Reference

> db_schema.json (261개 테이블) 자동 생성 요약
> grep 한 줄로 테이블 컬럼 확인 가능

## company (66개)

| 테이블 | 행 수 | 컬럼 |
|--------|-------|------|
| dart_company_info | 3,942 | corp_code, corp_name, corp_name_eng, stock_name, stock_code, ceo_nm, corp_cls, jurir_no, bizr_no, adres, hm_url, ir_url, phn_no, fax_no, induty_code, est_dt, acc_mt |
| dart_execshare_info | 23,778 | rcept_no, rcept_dt, corp_code, corp_name, repror, isu_exctv_rgist_at, isu_exctv_ofcps, isu_main_shrholdr, sp_stock_lmp_cnt, sp_stock_lmp_irds_cnt, sp_stock_lmp_rate, sp_stock_lmp_irds_rate |
| dart_fs_bs | 3,076,643 | bsns_year, reprt_code, corp_name, corp_code, code, induty_code, sj_div, account_id, account_nm, ifrs_account_nm_eng, ifrs_account_nm_kor, class1, class2, class3, class4, thstrm_amount |
| dart_fs_cf | 2,805,791 | bsns_year, reprt_code, corp_name, corp_code, code, induty_code, sj_div, account_id, account_nm, ifrs_account_nm_eng, ifrs_account_nm_kor, class1, class2, class3, thstrm_amount |
| dart_fs_cis | 1,526,022 | bsns_year, reprt_code, corp_name, corp_code, code, induty_code, sj_div, account_id, account_nm, ifrs_account_nm_eng, ifrs_account_nm_kor, class1, class2, class3, thstrm_amount |
| dart_fs_fscore | 86,031 | bsns_year, reprt_code, corp_name, corp_code, code, f_score, f1, f2, f3, f4, f5, f6, f7, f8, f9, profitloss, cashflowsfromusedinoperatingactivities, roa, roa_prev, ltr, ltr_prev, lcr, lcr_prev, issueofequity, gpm, gpm_prev, atr, atr_prev |
| dart_fs_is | 117,961 | bsns_year, reprt_code, corp_name, corp_code, code, induty_code, sj_div, account_id, account_nm, ifrs_account_nm_eng, ifrs_account_nm_kor, class1, class2, class3, thstrm_amount |
| dart_fs_sce | 445,596 | bsns_year, reprt_code, corp_name, corp_code, code, induty_code, sj_div, account_id, account_nm, ifrs_account_nm_eng, ifrs_account_nm_kor, class1, class2, class3, thstrm_amount |
| dart_major_stock | 952 | rcept_dt, corp_code, corp_name, repror, stkqy |
| dart_maxshare_info | 96,378 | rcept_no, corp_cls, corp_code, corp_name, stock_knd, nm, relate, bsis_posesn_stock_co, bsis_posesn_stock_qota_rt, trmend_posesn_stock_co, trmend_posesn_stock_qota_rt, rm, bsns_year, stlm_dt |
| dart_smallshare_info | 11,166 | rcept_no, corp_cls, corp_code, corp_name, se, shrholdr_co, shrholdr_tot_co, shrholdr_rate, hold_stock_co, stock_tot_co, hold_stock_rate, bsns_year, stlm_dt |
| dart_stock_total_info | 101,832 | rowno, rcept_no, stlm_dt, corp_cls, corp_code, corp_name, reprt_code, se, isu_stock_totqy, now_to_isu_stock_totqy, now_to_dcrs_stock_totqy, redc, profit_incnr, rdmstk_repy, etc, istc_totqy, tesstk_co, distb_stock_co |
| dart_stock_total_info2 | 101,782 | rowno, rcept_no, stlm_dt, corp_cls, corp_code, corp_name, reprt_code, se, isu_stock_totqy, now_to_isu_stock_totqy, now_to_dcrs_stock_totqy, redc, profit_incnr, rdmstk_repy, etc, istc_totqy, tesstk_co, distb_stock_co |
| ftc_corp_grp_afflt_info | 3,318 | corp_name, afflt_cp_name, ceo_nm, est_dt, afflt_dt, induty_code, induty_name, emply_cnt, acc_dt, shrmt_dt, ipo_dt, asst_amt, debt_amt, tot_capital_amt, capital_stock, sales_amt, net_income, pbl_clss |
| ftc_corp_grp_ipo | 88 | base_ym, corp_name, asst_cls, pbl_cls, cp_cnt_all, cp_cnt_ipo, cp_cnt_ipo_rto, cp_cnt_yoy_rto, capital_all, capital_ipo, capital_ipo_rto, capital_yoy_rto |
| ftc_corp_grp_list | 88 | corp_name, own_name, afflt_cnt, asst_amt, pbl_cls |
| init_dart_corp_info | 114,190 | corp_code, corp_name, corp_eng_name, stock_code, modify_date |
| kis_15min_candles | 268,213 | stock_code, stck_bsop_date, stck_cntg_hour, open, high, low, close, volume, acml_vol, ma_3, ma_5, ma_10, ma_20, ma_60, ma_100 |
| kis_auto_trade_buy | 12,408 | id, date, start_time, end_time, recorded_at, code, name, close, pct_chng, program_trade_value_prev1, program_trade_value, macd, signal, hist_prev2, hist_prev1, hist, rsi, ma_short, ma_long, bid_price, ask_price, trade_qty, holding_qty |
| kis_auto_trade_buy_backtest | 1,810 | id, date, start_time, end_time, recorded_at, code, name, close, pct_chng, program_trade_value_prev1, program_trade_value, macd, signal, hist_prev2, hist_prev1, hist, rsi, ma_short, ma_long, bid_price, ask_price, trade_qty, holding_qty |
| kis_auto_trade_sell | 8,626 | id, date, start_time, end_time, recorded_at, code, name, close, pct_chng, program_trade_value_prev1, program_trade_value, macd, signal, hist_prev2, hist_prev1, hist, rsi, ma_short, ma_long, bid_price, ask_price, trade_qty, holding_qty, reason, return_rate, buy_price, buy_time |
| kis_auto_trade_sell_backtest | 204 | id, date, start_time, end_time, recorded_at, code, name, close, pct_chng, program_trade_value_prev1, program_trade_value, macd, signal, hist_prev2, hist_prev1, hist, rsi, ma_short, ma_long, bid_price, ask_price, trade_qty, holding_qty, reason, return_rate, buy_price, buy_time |
| kis_closing_price_sale | 103 | date, stock_code, cap, trading_amount, close, open, select_reason, stock_name |
| kis_closing_price_sale2 | 46 | date, stock_code, cap, trading_amount, prev_close, prev_open, close, open, stock_name, trading_amount_category, prev_day |
| kis_closing_price_sale3 | 90 | date, stock_code, cap, trading_amount, prev_close, prev_open, close, open, prev_day, stock_name, trading_amount_category |
| kis_closing_sale_of_fear1 | 7 | base_date, select_date, stock_code, stock_name, cap, close, select_price, open, trend_flg |
| kis_closing_sale_of_fear2 | 240 | base_date, select_date, stock_code, result, stock_name, close, open, cap |
| kis_dividend_schedules | 14,810 | record_date, stock_code, stock_name, dividend_kind, face_value, cash_dividend_per_share, cash_dividend_rate, stock_dividend_rate, cash_dividend_pay_date, stock_dividend_pay_date, odd_lot_pay_date, stock_type, high_dividend_flag |
| kis_investor_trend_est | 245,825 | date, time, code, name, frgn_fake_ntby_qty, orgn_fake_ntby_qty, sum_fake_ntby_qty |
| kis_ipo_schedules | 108 | record_date, sht_cd, isin_name, fix_subscr_pri, face_value, subscr_dt, pay_dt, refund_dt, list_dt, lead_mgr, pub_bf_cap, pub_af_cap, assign_stk_qty |
| kis_kosdaq_info | 1,820 | shortcode, standardcode, koreanname, securitiesgroupcode, marketcapsizegroupcode, indexsectorlargeclasscode, indexsectormidclasscode, indexsectorsmallclasscode, ventureenterpriseflag, lowliquidityflag, krxstockflag, etpproducttypecode, krx100stockflag, krxautoflag, krxsemiconductorflag, krxbioflag, krxbankflag, acquisitionpurposecompanyflag, krxenergychemicalflag, krxsteelflag, overheatingstockclassificationcode, krxmediatelecomflag, krxconstructionflag, kosdaqinvestmentalertflag, krxsecuritiesclassification, krxshipclassification, krxsectorindex_insuranceflag, krxsectorindex_transportationflag, kosdaq150indexflag, baseprice, regularmarkettradingunit, afterhoursmarkettradingunit, tradinghaltflag, liquidationsaleflag, managementstockflag, marketwarningclassificationcode, marketwarningrisknoticeflag, inadequatedisclosureflag, circumventionlistingflag, lockclassificationcode, parvaluechangeclassificationcode, capitalincreasetypecode, marginratio, creditorderavailableflag, creditperiod, previoustradingvolume, parvalue, listingdate, listedshares, capitalstock, settlementmonth, publicofferprice, preferredsharesclassificationcode, shortsellingoverheatingstockflag, sharprisestockflag, krx300stockflag, sales, operatingprofit, grossprofit, netincome, roe, referenceyearmonth, previousdaymarketcap, subsidiarycode, companycreditlimitexceededflag, collateralloanavailableflag, largeshareholdingpossibleflag |
| kis_kospi_info | 2,485 | shortcode, standardcode, koreanname, groupcode, marketcapsize, indexsectorlargeclass, indexsectormidclass, indexsectorsmallclass, manufacturing, lowliquidity, dominantstructureindexstock, kospi200sectorindustry, kospi100, kospi50, krx, etp, elwissuance, krx100, krxauto, krxsemiconductor, krxbio, krxbank, spac, krxenergychemical, krxsteel, overheating, krxmediatelecom, krxconstruction, non1, krxsecurities, krxship, krxsector_insurance, krxsector_transportation, sri, baseprice, tradingunit, afterhourstradingunit, tradinghalt, liquidationsale, managementstock, marketwarning, warningnotice, inadequatedisclosure, circumventionlisting, lockclassification, parvaluechange, capitalincreasetype, marginratio, creditavailable, creditperiod, previoustradingvolume, parvalue, listingdate, listedshares, capitalstock, settlementmonth, publicofferprice, preferredshares, shortsellingoverheating, sharprise, krx300, kospi, sales, operatingprofit, grossprofit, netincome, roe, referenceyearmonth, marketcap, subsidiarycode, companycreditlimitexceeded, collateralloanavailable, largeshareholdingpossible |
| kis_notice_schedules | 201,231 | srno, date, time, title, source, code, name |
| kis_ovtm_by_stock | 488,567 | date, code, ovtm_untp_prpr, ovtm_untp_prdy_vrss, ovtm_untp_prdy_vrss_sign, ovtm_untp_prdy_ctrt, ovtm_untp_vol, stck_clpr, prdy_vrss, prdy_vrss_sign, prdy_ctrt, acml_vol, ovtm_untp_tr_pbmn |
| kis_program_trade_by_stock | 3,833,170 | date, code, bsop_hour, stck_prpr, prdy_vrss, prdy_vrss_sign, prdy_ctrt, acml_vol, whol_smtn_seln_vol, whol_smtn_shnu_vol, whol_smtn_ntby_qty, whol_smtn_seln_tr_pbmn, whol_smtn_shnu_tr_pbmn, whol_smtn_ntby_tr_pbmn, whol_ntby_vol_icdc, whol_ntby_tr_pbmn_icdc |
| kis_real_time_auto_trade | ? | id, date, start_time, end_time, code, name, open, high, low, close, close_chg_rt, volume, acc_volume, value, acc_value, ema12, ema26, macd, signal, hist, rsi, bb_upper, bb_lower, ma_short, ma_long, cross_signal, pro_buy_volume, pro_sell_volume, pro_net_volume, pro_buy_value, pro_sell_value, pro_net_value, pro_bid_remain, pro_ask_remain, pro_net_remain, pro_order_imbalance, trading_strength, turnover_rate, bid_price, ask_price, bid_remain, ask_remain, net_remain, order_imbalance |
| kis_real_time_auto_trade_hist | 2,488,624 | id, date, start_time, end_time, code, name, open, high, low, close, close_chg_rt, volume, acc_volume, value, acc_value, ema12, ema26, macd, signal, hist, rsi, bb_upper, bb_lower, ma_short, ma_long, cross_signal, pro_buy_volume, pro_sell_volume, pro_net_volume, pro_buy_value, pro_sell_value, pro_net_value, pro_bid_remain, pro_ask_remain, pro_net_remain, pro_order_imbalance, trading_strength, turnover_rate, bid_price, ask_price, bid_remain, ask_remain, net_remain, order_imbalance |
| kis_real_time_price | ? | id, date, trade_time, code, open, high, low, close, close_chg, close_chg_rt, w_avg_close, bid_price, ask_price, volume, acc_volume, acc_value, sell_trade_count, buy_trade_count, net_trade_count, trading_strength, sell_volume, buy_volume, trade_cls, buy_ratio, prev_vol_rate, open_time, open_vs_sign, open_vs, high_time, high_vs_sign, high_vs, low_time, low_vs_sign, low_vs, halt_flag, ask_remain, bid_remain, total_ask_remain, total_bid_remain, turnover_rate, prev_hour_acc_vol, prev_hour_acc_vol_rate, vi_ref_price, recorded_at |
| kis_real_time_price_hist | 6,823,395 | id, date, trade_time, code, open, high, low, close, close_chg, close_chg_rt, w_avg_close, bid_price, ask_price, volume, acc_volume, acc_value, sell_trade_count, buy_trade_count, net_trade_count, trading_strength, sell_volume, buy_volume, trade_cls, buy_ratio, prev_vol_rate, open_time, open_vs_sign, open_vs, high_time, high_vs_sign, high_vs, low_time, low_vs_sign, low_vs, halt_flag, ask_remain, bid_remain, total_ask_remain, total_bid_remain, turnover_rate, prev_hour_acc_vol, prev_hour_acc_vol_rate, vi_ref_price, recorded_at |
| kis_real_time_program_trade | ? | id, date, trade_time, code, recorded_at, sell_volume, sell_value, buy_volume, buy_value, net_volume, net_value, ask_remain, bid_remain, net_remain |
| kis_real_time_program_trade_hist | 753,861 | id, date, trade_time, code, recorded_at, sell_volume, sell_value, buy_volume, buy_value, net_volume, net_value, ask_remain, bid_remain, net_remain |
| kis_sector_code | 486 | sector_code, sector_name |
| kis_theme_code | 5,528 | theme_code, theme_name, stock_code |
| kis_today | 2,879 | date, code, stock_name, stck_oprc, stck_hgpr, stck_lwpr, stck_clpr, acml_vol, acml_tr_pbmn |
| kis_today_ma | 334,106 | date, stock_code, stock_name, open, high, low, close, volume, trade_value, ma3, ma5, ma10, ma20, ma50, ma60, ma120, macd, signal, rsi |
| kis_today_ma_tmp | 354,395 | date, stock_code, stock_name, open, high, low, close, volume, ma3, ma5, ma10, ma20, ma60, ma120, macd, signal, rsi |
| krx_company_info | 2,879 | name, code, close, stocks, marcap, amount, volume, low, high, open, changesratio, changes, changecode, dept, market, isu_cd, marketid |
| krx_ir_schedules | 9,838 | date, time, stock_code, stock_name, ir_title, location |
| krx_stocks_52wk_highprice | 2,750 | date, code, volume, diff_rate, diff_price, closing_price, current_price, high_price, name |
| krx_stocks_52wk_lowprice | 2,901 | date, code, volume, diff_rate, diff_price, closing_price, current_price, high_price, name |
| krx_stocks_cap | 4,072,417 | date, code, cap, number_shares |
| krx_stocks_foreign_shares_info | 4,058,024 | date, code, share_ownership_foreign, shareholding_ratio_foreign, limit_quantity_foreign, exhaustion_rate_foreign |
| krx_stocks_fundamental_info | 3,796,633 | date, code, bps, per, eps, div, dps, pbr |
| krx_stocks_investor_shares_trading_info | 29,012,876 | date, investor, code, name, sell_trade_vol, buy_trade_vol, net_trade_vol, sell_trade_amt, buy_trade_amt, net_trade_amt |
| krx_stocks_ohlcv | 4,072,417 | date, code, open, high, low, close, volume, trade_value, day_range |
| krx_stocks_ohlcv_raw | 4,072,417 | date, code, open, high, low, close, volume, trade_value, day_range |
| krx_stocks_short_selling | 3,891,603 | date, code, short_selling, remaining_quantity, short_selling_amount, balance_amount |
| master_company_list | 3,854 | corp_cls, asst_cls, corp_group, wics_code, wics_name1, wics_name2, wics_name3, corp_code, corp_name, stock_code, stock_name, jurir_no, bizr_no, revenue |
| naver_ipo_schedules | 115 | stock_name, stock_code, market, industry, detail_url, ceo_name, found_date, address, homepage, main_product, major_holder, major_hold_ratio, company_class, employee_count, hope_publish, publish_price, final_price, offering_amount, offering_shares, retail_shares, inst_comp_ratio, retail_comp_ratio, underwriter, pre_review_date, approval_date, reg_statement_date, demand_dates, subscription_dates, allocation_notice, refund_date, payment_date, listing_date |
| naver_theme | 6,771 | theme_code, theme_name, theme_info, stock_code, stock_name, stock_info |
| nxt_stocks_ohlcv | 424,311 | date, market_class, code, name, group_name, change_value, change_rate, open, high, low, close, volume, trading_value, tradable_market, stop_reason |
| public_loan_detail | 10,014 | date, invpnclsfdtlnm, lndecclstckamt, lndecclstckamtrto, borcclstckamt, borcclstckamtrto |
| public_loan_pro | 1,091 | date, cclstckcnt, rdptstckcnt, balnstckcnt, balnstckamt |
| public_loan_tran | 1,701,241 | date, code, name, mrktclsfnm, cclstckcnt, rdptstckcnt, balnstckcnt, balnstckamt |
| seibro_div_detail | 27,964 | stock_code, stock_name, report_date, stock_type, net_income, retained_earnings, total_dividends, cash_dividends, stock_dividends, payout_ratio, dps, dps_cash, dps_stock, dividend_yield_cash |
| seibro_div_list | 33,380 | allocation_date, cash_date, stock_date, in_kind_dated, stock_code, stock_name, market_type, dividend_type, transfer_agent, stock_type, dsp, dsp_special, payout_ratio_cash, payout_ratio_stock, special_payout_cash, special_payout_stock, stock_dividend_ratio, special_stock_dividend_ratio, fractional_price, face_value, fiscal_month, div_freq |

---

## fin_prod (31개)

| 테이블 | 행 수 | 컬럼 |
|--------|-------|------|
| actual_expense_insurance | ? | date, prdt_nm, mog, comp_cd, age, comp_nm, type, male_insurance_cost, female_insurance_cost, inst_name |
| fss_annuity_save_prod | 17,888 | dcls_month, fin_co_no, fin_prdt_cd, kor_co_nm, fin_prdt_nm, join_way, pnsn_kind, pnsn_kind_nm, sale_strt_day, mntn_cnt, prdt_type, prdt_type_nm, avg_prft_rate, dcls_rate, guar_rate, btrm_prft_rate_1, btrm_prft_rate_2, btrm_prft_rate_3, etc, sale_co, dcls_strt_day, dcls_end_day, fin_co_subm_day, pnsn_recp_trm, pnsn_recp_trm_nm, pnsn_entr_age, pnsn_entr_age_nm, mon_paym_atm, mon_paym_atm_nm, paym_prd, paym_prd_nm, pnsn_strt_age, pnsn_strt_age_nm, pnsn_recp_amt |
| fss_credit_loan | 567 | dcls_month, fin_co_no, fin_prdt_cd, crdt_prdt_type_x, kor_co_nm, fin_prdt_nm, join_way, cb_name, crdt_prdt_type_nm, dcls_strt_day, dcls_end_day, fin_co_subm_day, crdt_prdt_type_y, crdt_lend_rate_type, crdt_lend_rate_type_nm, crdt_grad_1, crdt_grad_4, crdt_grad_5, crdt_grad_6, crdt_grad_10, crdt_grad_11, crdt_grad_12, crdt_grad_13, crdt_grad_avg, column25 |
| fss_deposit_prod | 5,548 | dcls_month, fin_co_no, fin_prdt_cd, kor_co_nm, fin_prdt_nm, join_way, mtrt_int, spcl_cnd, join_deny, join_member, etc_note, max_limit, dcls_strt_day, dcls_end_day, fin_co_subm_day, intr_rate_type, intr_rate_type_nm, save_trm, intr_rate, intr_rate2, m |
| fss_fin_company | 2,856 | dcls_month, fin_co_no, kor_co_nm, dcls_chrg_man, homp_url, cal_tel, area_cd, area_nm, exis_yn |
| fss_mortgage_loan | 615 | dcls_month, fin_co_no, fin_prdt_cd, kor_co_nm, fin_prdt_nm, join_way, loan_inci_expn, erly_rpay_fee, dly_rate, loan_lmt, dcls_strt_day, dcls_end_day, fin_co_subm_day, mrtg_type, mrtg_type_nm, rpay_type, rpay_type_nm, lend_rate_type, lend_rate_type_nm, lend_rate_min, lend_rate_max, lend_rate_avg |
| fss_pbl_ps_stat | 45 | year, item, value |
| fss_ps_corp | 1,952 | year, quarter, area, company, reserve, reserve1, reserve2, reserve3, earnrate, earnrate1, earnrate2, earnrate3, feerate1, feerate2, feerate3, avgearnrate3, avgearnrate5, avgearnrate7, avgearnrate10, avgfeerate3, avgfeerate5, avgfeerate7, avgfeerate10 |
| fss_ps_grtd_prod | 97 | reportdate, area, channel, company, product, publishedinterestrate, guaranteedinterestrate, fpfeedesc_1, fpfeedesc_2, agentfeedesc_1, agentfeedesc_2, onlinefeedesc_1, onlinefeedesc_2, tel |
| fss_ps_prod | 62,304 | year, quarter, area, company, product, launchdate, producttype, rcvmethod, feetype, sells, withdraws, guarantees, balance, balance1, balance2, balance3, reserve, reserve1, reserve2, reserve3, earnrate, earnrate1, earnrate2, earnrate3, feerate1, feerate2, feerate3, avgearnrate3, avgearnrate5, avgearnrate7, avgearnrate10, avgfeerate3, avgfeerate5, avgfeerate7, avgfeerate10 |
| fss_ps_stat | 27 | year, item, value |
| fss_psn_ps_stat | 90 | stat, year, item, value |
| fss_rent_house_loan | 225 | dcls_month, fin_co_no, fin_prdt_cd, kor_co_nm, fin_prdt_nm, join_way, loan_inci_expn, erly_rpay_fee, dly_rate, loan_lmt, dcls_strt_day, dcls_end_day, fin_co_subm_day, rpay_type, rpay_type_nm, lend_rate_type, lend_rate_type_nm, lend_rate_min, lend_rate_max, lend_rate_avg |
| fss_rp_corp_brdn_rto | 297 | year, area, company, dbtotalcostrate, dbtotalfee, dboprtmngfee, dbasstmngfee, dbfundtotalcost, dctotalcostrate, dctotalfee, dcoprtmngfee, dcasstmngfee, dcfundtotalcost, irptotalcostrate, irptotalfee, irpoprtmngfee, irpasstmngfee, irpfundtotalcost |
| fss_rp_corp_cstm_fee | 21,240 | company, term, reserve, totalfeerate, oprtfeerate, asstfeerate, totalyearlyfee, oprtyearlyfee, asstyearlyfee, extra, tel, url |
| fss_rp_corp_rslt | 210 | year, quarter, company, area, division, dbreserve, dbearnrate, dbearnrate3, dbearnrate5, dbearnrate7, dbearnrate10, dcreserve, dcearnrate, dcearnrate3, dcearnrate5, dcearnrate7, dcearnrate10, irpreserve, irpearnrate, irpearnrate3, irpearnrate5, irpearnrate7, irpearnrate10 |
| fss_rp_grtd_prod_sply | 616 | area, supplier, limitamount, interestrate, totalamount, seller, supplyamount, remainderamount |
| fss_rtm_ps_stat | 72 | stat, year, item, value |
| fss_save_prod | 3,090 | dcls_month, fin_co_no, fin_prdt_cd, kor_co_nm, fin_prdt_nm, join_way, mtrt_int, spcl_cnd, join_deny, join_member, etc_note, max_limit, dcls_strt_day, dcls_end_day, fin_co_subm_day, intr_rate_type, intr_rate_type_nm, rsrv_type, rsrv_type_nm, save_trm, intr_rate, intr_rate2 |
| kis_etf_deviation | 92 | code, name, inav, deviation, dev_avg, z200, askp1, askp_rsqn1, bidp1, bidp_rsqn1, std_deviation200, avg_deviation200, min_deviation200, std_deviation20, avg_deviation20 |
| kis_etf_orderbook | 94 | code, name, bsop_hour, hour_cls_code, askp1, askp2, askp3, askp4, askp5, askp6, askp7, askp8, askp9, askp10, bidp1, bidp2, bidp3, bidp4, bidp5, bidp6, bidp7, bidp8, bidp9, bidp10, askp_rsqn1, askp_rsqn2, askp_rsqn3, askp_rsqn4, askp_rsqn5, askp_rsqn6, askp_rsqn7, askp_rsqn8, askp_rsqn9, askp_rsqn10, bidp_rsqn1, bidp_rsqn2, bidp_rsqn3, bidp_rsqn4, bidp_rsqn5, bidp_rsqn6, bidp_rsqn7, bidp_rsqn8, bidp_rsqn9, bidp_rsqn10, total_askp_rsqn, total_bidp_rsqn, ovtm_total_askp_rsqn, ovtm_total_bidp_rsqn, antc_cnpr, antc_cnqn, antc_vol, antc_cntg_vrss, antc_cntg_vrss_sign, antc_cntg_prdy_ctrt, acml_vol, total_askp_rsqn_icdc, total_bidp_rsqn_icdc, ovtm_total_askp_icdc, ovtm_total_bidp_icdc |
| kis_inav | 92 | bsop_hour, code, name, inav, avg_deviation200, std_deviation200, min_deviation200, avg_deviation20, std_deviation20 |
| kofia_etf_fee | 1,048 | code, amc, kor_full_nm, fund_type, set_date, mgmt_fee, sales_fee, cust_fee, admin_fee, fee_sum, peer_avg_fee, othr_cost, ter, front_fee, back_fee, broker_fee, kofia_code |
| krx_etf_info | 1,072 | isin, code, kor_full_name, kor_name, eng_name, list_date, idx_name, idx_calc_inst, leverage, replica_method, idx_mkt_clss, idx_asst_clss, list_shrs, amc, cu_qty, total_fee, tax_type |
| krx_etf_investor | 276,173 | date, code, inst_tot, fin_inst, insur, inv_fund, priv_fund, bank, othr_fin, pension, corp_othr, retail, frgn_tot, frgn, frgn_othr, tot |
| krx_etf_ohlcv | 11,706,915 | date, code, isin, name, type, open, high, low, close, price_change, change_rate, volume, trading_value, cap, nav_or_iv, total_nav_or_iv, list_shares, benchmark_name, benchmark_close, benchmark_change, benchmark_change_rate, price_deviation, tracking_error |
| krx_etf_pdf | 32,478,878 | date, etf_code, etf_isin, etf_name, code, isin, name, market, shares, value_amount, cap, cap_ratio |
| retirement_pension | ? | date, fnd_cd, fnd_nm, comp_cd, comp_nm, base_price, net_asset_amt, inst_name |
| seibro_etf_div | 5,418 | isin, code, kor_name, mng_name, etf_type, base_date, pay_date, div_type, div_per_share, tax_base_price, div_yield |
| seibro_unlisted_structured_notes | 15,628 | issuer, code, name, security_type, issue_date, maturity_date, total_issue_amount, payment_amount, issue_type, issue_currency, underlying_asset_type, underlying_asset_count, asset1_name, asset1_reference_price, asset1_prev_close, asset1_change, asset2_name, asset2_reference_price, asset2_prev_close, asset2_change, asset3_name, asset3_reference_price, asset3_prev_close, asset3_change, lower_barrier_level, lower_barrier_hit, upper_barrier_level, upper_barrier_hit |
| variable_insurance | 3,556,274 | date, fnd_cd, fnd_nm, comp_cd, comp_nm, base_price, net_asset_amt |

---

## industry (9개)

| 테이블 | 행 수 | 컬럼 |
|--------|-------|------|
| ecos_all_original | 312 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_all_weather | 312 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_manufacture_original | 1,473 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_manufacture_weather | 1,473 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_service_bulbyun | 312 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_service_gyungsang | 312 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_service_weather | 312 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| wics_industry_code | 2,757 | market, code, name, industry_name, wics_name, wics_code |
| wiseindex_wics_code | 2,769 | code, wics_code, wics_name, market_info |

---

## llm (3개)

| 테이블 | 행 수 | 컬럼 |
|--------|-------|------|
| naver_stock_report | 82,671 | date, name, code, anal_com, target_price, inv_opi, title, title_url, summary, pdf_url |
| stock_anly_reports | 1,379,186 | id, text, metadata, embedding |
| stock_anly_reports2 | 1,320,949 | id, text, metadata, embedding |

---

## market (74개)

| 테이블 | 행 수 | 컬럼 |
|--------|-------|------|
| binance_bitcoin_all | 3,112 | datetime, open, high, low, close, volume, closetime, quoteassetvolume, numtrades, takerbuybaseassetvolume, takerbuyquoteassetvolume, ignore, end_dt_timestamp, date, timezone |
| ecos_bop_gyungsang | 552 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_construction_inter | 982 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_currency_all | 33,153 | date, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_currency_eop | 1,106 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_gdp_deflator | 526 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_gdp_gni_all | 6,049 | yyyymm, stat_code, stat_name, item_code, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_gdp_original_all | 21 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_gdp_weather_all | 21 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_manufacture_durable | 7,856 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_market_interest | 1,513 | date, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_market_interest_debenture | 10,331 | yyyymm, stat_code, stat_name, item_code, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_payment_dishonored | 6,523 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_saengsan_mulga | 73 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_saengsan_mulga_all | 733 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_sobi_mulga_all | 733 | yyyymm, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| ecos_stocks_cashdvd | 7,764 | stock_code, long_code, rgt_std_dt, cash_aloc_amt, martp_div_rate, year, setacc_tpcd |
| google_trends_data | 87,401 | date, name, inter_degree, day_range |
| google_trends_ranked | 100 | date, name, inter_degree, day_range, rank |
| invest_resource_all | 4,705 | date, price, big_cate, small_cate, per, market, seq |
| kis_dividend_info | ? | record_date, stock_code, stock_name, dividend_type, face_value, cash_dividend, cash_dividend_rate, stock_dividend_rate, cash_dividend_payment_date, stock_dividend_payment_date, odd_lot_payment_date, stock_type, high_dividend_yn |
| kis_major_market_index | 239,699 | date, code, kor_name, eng_name, open, high, low, close, acml_vol |
| kosis_apartment_building | 6,168 | tbl_nm, yyyymm, kosis_id, itm_id, itm_nm, unit_nm, unit_nm_eng, values, code1, code1_nm, code2, code2_nm, code3, code3_nm |
| kosis_capacity_index | 88,656 | tbl_nm, yyyymm, kosis_id, itm_id, itm_nm, itm_nm_eng, values, code, code_nm |
| kosis_consumer_sentiment | 5,383 | tbl_nm, yyyymm, kosis_id, itm_id, itm_nm, itm_nm_eng, values, code, code_nm, code_nm_eng |
| kosis_diffusion_index | 807 | tbl_nm, yyyymm, kosis_id, values, code, code_nm, code_nm_eng |
| kosis_domestic_index | 110,391 | tbl_nm, yyyymm, kosis_id, itm_id, itm_nm, values, code1, code1_nm, code2, code2_nm |
| kosis_economic_index | 13,308 | tbl_nm, yyyymm, kosis_id, itm_nm, itm_nm_han, values, code, code_nm, code_nm_han |
| kosis_economic_index_raw | 7,260 | tbl_nm, yyyymm, kosis_id, itm_nm, values, code, code_nm |
| kosis_economic_index_raw_kospi_treaury | 3,036 | tbl_nm, yyyymm, kosis_id, itm_nm, values, code, code_nm |
| kosis_economic_sentiment | 554 | tbl_nm, yyyymm, kosis_id, itm_id, itm_nm, itm_nm_eng, values, code, code_nm, code_nm_eng |
| kosis_economically_index | 23,040 | tbl_nm, yyyymm, kosis_id, itm_nm, itm_nm_eng, itm_id, unit_nm, unit_nm_eng, values, code, code_nm, code_nm_eng |
| kosis_energy_consumption | 371 | tbl_nm, year, kosis_id, unit_nm, values, code1, code1_nm, code2, code2_nm |
| kosis_export_import_amount | 911 | tbl_nm, yyyymm, kosis_id, itm_id, itm_nm, itm_nm_eng, values, code, code_nm |
| kosis_facility_investment_index | 370 | tbl_nm, yyyymm, kosis_id, values, code, code_nm, code_nm_eng |
| kosis_gross_domestic_product | 183 | tbl_nm, yyyymm, kosis_id, values, code, code_nm |
| kosis_indices_index | 4,128 | tbl_nm, yyyymm, kosis_id, values, code, code_nm, code_nm_eng |
| kosis_industry_index | 1,560 | tbl_nm, yyyymm, kosis_id, itm_nm, itm_nm_eng, unit_nm, values, code, code_nm, code_nm_eng |
| kosis_inventory_mart | 1,090 | tbl_nm, yyyymm, kosis_id, values, code, code_nm |
| kosis_inventory_ratio | 492 | tbl_nm, yyyymm, kosis_id, values, code, code_nm |
| kosis_lf_end | 1,300 | tbl_nm, yyyymm, kosis_id, unit_nm, unit_nm_eng, values, code, code_nm, code_nm_eng |
| kosis_machinery_index | 4,718 | tbl_nm, yyyymm, kosis_id, itm_id, itm_nm, itm_nm_eng, values, code, code_nm, code_nm_eng |
| kosis_machinery_order | 410,944 | tbl_nm, yyyymm, kosis_id, unit_nm, unit_nm_eng, values, code1, code1_nm, code1_nm_eng, code2, code2_nm, code2_nm_eng |
| kosis_main_indicators | 5,994 | tbl_nm, year, kosis_id, values, code, code_nm, code_nm_eng |
| kosis_manufacturing_index | 107,982 | tbl_nm, yyyymm, kosis_id, itm_id, itm_nm, values, code1, code1_nm, code2, code2_nm |
| kosis_mulga_index | 6,649 | tbl_nm, yyyymm, kosis_id, itm_id, itm_nm, itm_nm_eng, values, code, code_nm, code_nm_eng |
| kosis_mulga_rate | 732 | yyyymm, expected_rate, core_rate, mulga_rate |
| kosis_national_tendency_index | 36,147 | tbl_nm, yyyymm, kosis_id, values, code1, code1_nm, code1_nm_eng, code2, code2_nm, code2_nm_eng |
| kosis_production_index | 74,736 | tbl_nm, yyyymm, kosis_id, itm_nm, itm_nm_eng, itm_id, unit_nm, unit_nm_eng, values, code, code_nm, code_nm_eng |
| kosis_received_order | 266,424 | tbl_nm, yyyymm, kosis_id, unit_nm, unit_nm_eng, values, code1, code1_nm, code1_nm_eng, code2, code2_nm, code2_nm_eng |
| kosis_retail_sales_index | 13,104 | tbl_nm, yyyymm, kosis_id, itm_id, itm_nm, itm_nm_eng, values, code, code_nm, code_nm_eng |
| kosis_utilization_rate | 552 | tbl_nm, yyyymm, kosis_id, itm_nm, itm_nm_eng, unit_nm, unit_nm_eng, values, code, code_nm, code_nm_eng |
| krx_stocks_kosdaq_index | 1,511 | date, closing_price, diff_price, diff_rate, opening_price, high_price, low_price, volume, tran_amount, market_value |
| krx_stocks_kosdaqaccm | 1,514 | date, amount_inst, amount_etc_corp, amount_indiv, amount_forgn, volume_inst, volume_etc_corp, volume_indiv, volume_forgn |
| krx_stocks_kospi_index | 1,511 | date, closing_price, diff_price, diff_rate, opening_price, high_price, low_price, volume, tran_amount, market_value |
| krx_stocks_kospiaccm | 1,511 | date, amount_inst, amount_etc_corp, amount_indiv, amount_forgn, volume_inst, volume_etc_corp, volume_indiv, volume_forgn |
| oecd_composite_leading_indicators | 9,129 | yyyymm, ref_area, values |
| opinet_oilprice | 2,960 | date, location, diesel, gasoline |
| pubdata_ceo_inq | 34,367 | date, crno, corpnm, ceofnm, sexcd, sexcdnm, ceobornym, ceojbttnm, rgstexutyn, fltmsvyn, ceochrgbzwrctt, ceomaincrrctt, ownonskcnt, ownpfstcnt, maxsthdrltnm, ceohdftermctt, ceotrmxprydt |
| pubdata_exec_comp | 4,188 | date, crno, rgstdrtrcnt, rgstdrtrtrmramt, rgstdrtravgrmramt, rgstdrtrrmkctt, otdrcnt, otdrtrmramt, otdravgrmramt, otdrrmkctt, corpaudtnopecnt, audpntrmramt, audpnavgrmramt, audtrmkctt |
| pubdata_exec_info | 408,159 | date, crno, datasqno, exutfnm, exutbornym, exutjbttnm, rgstexutyn, rgstexutctt, fltmsvyn, fltmsvctt, exutchrgbzwrnm, exutmaincrrctt, ownonskcnt, ownpfstcnt, exuthdftermctt, exutjbttxprydt, sexcd, sexcdnm, exutownonskcnt, exutownpfstcnt |
| pubdata_fcommission_corpgov_shareholder | 1,433,761 | date, crno, sthdsqno, sthdfnm, maxsthdrltnm, stckcsfnm, sthdeotestckcnt, sthdeoteshrratctt |
| pubdata_nps_kstock_holdings | 5,863 | date, corp_name, eval_amount, asset_weight_pct, shareholding_ratio |
| purchase_timing | 474,141 | stock_code, date, close, reason |
| sentiment_analysis_results | 119 | news_date, stock_name, sentiment, score |
| visual_index_corr | 12 | oecd, utilization_rate, inventory_rate, production_index, leading_c_f, short_long_interest_rate, kospi, leading_composite, economic_psychology_c_f, economic_sentiment, the_amount_of_exports, consumer_sentiment_index, index_nm |
| yfin_amex_composite_index | 1,771 | date, open, high, low, close, volume, dividen, stock_spl |
| yfin_cboe_interest_rate10 | 1,642 | date, open, high, low, close, volume, dividen, stock_spl |
| yfin_dowjones_index | 1,642 | date, open, high, low, close, volume, dividen, stock_spl |
| yfin_nasdaq100_index | 1,645 | date, open, high, low, close, volume, dividen, stock_spl |
| yfin_nasdaq_composite_index | 1,642 | date, open, high, low, close, volume, dividen, stock_spl |
| yfin_nasdaq_global_index | 1,642 | date, open, high, low, close, volume, dividen, stock_spl |
| yfin_nyse_composite_index | 1,642 | date, open, high, low, close, volume, dividen, stock_spl |
| yfin_sp500_index | 1,642 | date, open, high, low, close, volume, dividen, stock_spl |

---

## public (28개)

| 테이블 | 행 수 | 컬럼 |
|--------|-------|------|
| account_emailaddress | 6 | id, email, verified, primary, user_id |
| account_emailconfirmation | ? | id, created, sent, key, email_address_id |
| auth_group | 1 | id, name |
| auth_group_permissions | 40 | id, group_id, permission_id |
| auth_permission | 384 | id, name, content_type_id, codename |
| auth_user | 33 | id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined, permission_group_id, permission_expire_at |
| auth_user_groups | ? | id, user_id, group_id |
| auth_user_user_permissions | ? | id, user_id, permission_id |
| board | 19 | id, title, content, author_id, password, is_notice, priority, created_at, updated_at, status |
| board_comment | 6 | id, board_id, author_id, content, password, created_at, updated_at |
| dart_company_info | ? | corp_code, corp_name, corp_name_eng, stock_name, stock_code, ceo_nm, corp_cls, jurir_no, bizr_no, adres, hm_url, ir_url, phn_no, fax_no, induty_code, est_dt, acc_mt |
| dart_treasury_stock_txn2 | 74,651 | no, rcept_no, stlm_dt, corp_cls, corp_code, corp_name, report_code, se, isu_stock_totqy, now_to_isu_stock_totqy, now_to_dcrs_stock_totqy, redc, profit_incnr, rdmstk_repy, etc, istc_totqy, tesstk_co, distb_stock_co |
| django_admin_log | 554 | id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id |
| django_content_type | 103 | id, app_label, model |
| django_logging | 12,808 | id, date, username, ip, country, device, os, event_type, result, message, browser, region, city |
| django_migrations | 43 | id, app, name, applied |
| django_session | 3,851 | session_key, session_data, expire_date |
| django_site | 2 | id, domain, name |
| invest_resource_all | 1,926 | date, price, big_cate, small_cate, per, market, seq |
| menu_list | 85 | seq1, seq2, seq3, big_category, mid_category, small_category, category_label, link1, link2, link3, param1, param2, param3, param4, param5, class_icon, use_yn, id |
| permission_menu_group | 3 | id, name, explain, price, is_preparing |
| permission_menu_group_menu_items | 47 | id, permission_menu_group_id, menuitem_id |
| socialaccount_socialaccount | 18 | id, provider, uid, last_login, date_joined, extra_data, user_id |
| socialaccount_socialapp | 3 | id, provider, name, client_id, secret, key, provider_id, settings |
| socialaccount_socialapp_sites | 6 | id, socialapp_id, site_id |
| socialaccount_socialtoken | ? | id, token, token_secret, expires_at, account_id, app_id |
| user_payments | 47 | id, user_id, tid, amount, currency, status, plan, start_date, end_date, prev_plan, prev_end_date, created_at, updated_at, refund_amount, payment_method, goods_name |
| your_table_name | 2 | stock_code, date, rsi, macd, volume |

---

## visual (50개)

| 테이블 | 행 수 | 컬럼 |
|--------|-------|------|
| auto_trade_history | 96 | id, date, stock_code, stock_name, buy_time, buy_price, quantity, sell_time, sell_price, return_rate, status |
| test | 1,707,762 | d_date, w_date, m_date, stock_code, stock_name, wics_name, d_open, d_high, d_low, d_close, d_volume, d_ma5, d_ma10, d_ma20, d_ma60, w_open, w_high, w_low, w_close, w_avg_volume, w_ma5, w_ma7, w_ma10, w_ma15, w_ma20, w_ma60, w_stoch_k5, w_stoch_d3_k5, w_stoch_k10, w_stoch_d6_k10, w_stoch_k20, w_stoch_d12_k20, m_open, m_high, m_low, m_close, m_avg_volume, m_ma5 |
| visual_index_corr | 12 | index, oecd, utilization_rate, inventory_rate, production_index, leading_c_f, short_long_interest_rate, kospi, leading_composite, economic_psychology_c_f, economic_sentiment, the_amount_of_exports, consumer_sentiment_index, index_nm |
| vsl_2060_swing | 5,700 | entry_date, reco_date, stock_code, stock_name, ma_sort_clsf, buy_reason, clsf |
| vsl_2060_trans_anly | 8,145 | date, stock_code, stock_name, max20_high, min20_low, close, clsf, clsf2 |
| vsl_anly_heikin_ashi_stocks | 1,338,213 | date, code, ema20, ema15, ema40, sma50, d_3, k_3, stochrsi_10, rsi_13, low, high, close, open, name |
| vsl_anly_monthly_signal01 | 363 | date, stock_code, stock_name, wics_name, mrktclsfnm |
| vsl_anly_monthly_signal02 | 100 | date, stock_code, stock_name, wics_name, mrktclsfnm |
| vsl_anly_stocks_price | 1,448,552 | date, wics_name, stock_code, stock_name, net_income, stock_price, stck_prc_rate, tran_vol_rate, rsi, gcross_yn, dcross_yn, ma5, ma10, ma20, ma60, ma120, ma180, ma240, std_ma5, std_ma10, std_ma20, std_ma60, std_ma120, trans_line, base_line, trail_span, lead_span1, lead_span2 |
| vsl_anly_stocks_price_subindex01 | 1,448,552 | date, wics_name, stock_code, stock_name, open, high, low, close, volume, trade_value, stck_prc_rate, tran_vol_rate, ma3, ma5, ma10, ma20, ma60, ma112, ma120, ma180, ma224, ma240, ema3, ema5, ema10, ema20, ema60, ema112, ema120, ema180, ema224, ema240, volume_std20, volume_ma20, ma50, ema50 |
| vsl_anly_stocks_price_subindex02 | 1,448,552 | date, stock_code, stock_name, stock_price, trans_line, base_line, trail_span, lead_span1, lead_span2, stock_weight_cc, stock_weight_lh, fastk_s, fastk_m, fastk_l, fastd_s, fastd_m, fastd_l, slowk_s, slowk_m, slowk_l, slowd_s, slowd_m, slowd_l, rsi, pcl, pvt, macd, signal, momentum, w_fastk_s, w_fastd_s, w_fastk_m, w_fastd_m, w_fastk_l, w_fastd_l |
| vsl_anly_stocks_price_subindex02_back | ? | date, stock_code, stock_name, stock_price, trans_line, base_line, trail_span, lead_span1, lead_span2, stock_weight_cc, stock_weight_lh, fastk_s, fastk_m, fastk_l, fastd_s, fastd_m, fastd_l, slowk_s, slowk_m, slowk_l, slowd_s, slowd_m, slowd_l, rsi, pcl, pvt, macd, signal, momentum, w_fastk_s, w_fastd_s, w_fastk_m, w_fastd_m, w_fastk_l, w_fastd_l |
| vsl_anly_stocks_price_subindex03 | 1,893,441 | date, stock_code, stock_name, stock_price, env_mid, env_upper, env_lower, cci, trix, trix_signal, roc, pmao, invest_senti, wiliams_r, wiliams_d, vr, psar, sonar, sonar_signal, pdi, mdi, adx, adxr |
| vsl_anly_stocks_recommended_list01 | 117,012 | date, model, model_kr, model_case, model_case_kr, wics_name, stock_code, stock_name, stock_price, volume, trade_value, total_rec |
| vsl_anly_stocks_recommended_list02 | 1,803 | date, model, model_kr, model_case, model_case_kr, wics_name, stock_code, stock_name, stock_price, volume, trade_value, total_rec |
| vsl_anly_stocks_recommended_list03 | 44,243 | date, model, model_kr, model_case, model_case_kr, wics_name, stock_code, stock_name, stock_price, volume, trade_value, total_rec |
| vsl_bollinger_strategy | 274 | date, stock_name, wics_name, open, high, low, close, prime_l, strategy |
| vsl_dividend_stock_evaluation | 7,007 | stock_code, koreanname, base_date, profitability_efficiency_eval, dividend_sustainability_eval, undervaluation_eval |
| vsl_dividend_stock_evaluation02 | 2,615 | stock_code, koreanname, base_date, profitability_efficiency_eval, dividend_sustainability_eval, undervaluation_eval |
| vsl_dwm_ohlcv | 2,112,166 | d_date, w_date, m_date, stock_code, stock_name, wics_name, d_open, d_high, d_low, d_close, d_volume, d_ma5, d_ma10, d_ma20, d_ma60, w_open, w_high, w_low, w_close, w_avg_volume, w_ma5, w_ma7, w_ma10, w_ma15, w_ma20, w_ma60, m_open, m_high, m_low, m_close, m_avg_volume, m_ma5, w_ma50, d_ma50 |
| vsl_ecos_saengsan_mulga | 73 | date, stat_code, stat_name, item_code1, item_name1, item_code2, item_name2, item_code3, item_name3, item_code4, item_name4, unit_name, data_value |
| vsl_ecos_stocks_cashdvd | 5,906 | date, year, corp_cls, asst_cls, corp_group, wics_name1, wics_name2, wics_name3, stock_code, stock_name, revenue, cash_aloc_amt, martp_div_rate, setacc_tpcd |
| vsl_inv_strat_picks_short | 34,474 | inv_strat, inv_strat_dtl, reco_date, stock_code, stock_name, close, reco_buy_prc, reco_sell_prc, stop_loss_prc, info1, info2, info3 |
| vsl_inv_strat_picks_swing | 323,011 | inv_strat, inv_strat_dtl, reco_date, stock_code, stock_name, close, reco_buy_prc, reco_sell_prc, stop_loss_prc, info1, info2, info3 |
| vsl_inv_strat_picks_trend | 810,758 | inv_strat, inv_strat_dtl, reco_date, stock_code, stock_name, close, reco_buy_prc, reco_sell_prc, stop_loss_prc, info1, info2, info3 |
| vsl_inv_strat_picks_value | 1,685 | inv_strat, inv_strat_dtl, reco_date, stock_code, stock_name, close, reco_buy_prc, reco_sell_prc, stop_loss_prc, info1, info2, info3 |
| vsl_investor_analysis | 726 | date, stock_code, stock_name, avg_vol, sum_net_vol_daily, volume, net_vol_ind |
| vsl_krx_stocks_52wk_highprice | 2,202 | date, corp_cls, asst_cls, corp_group, wics_name1, wics_name2, wics_name3, stock_code, stock_name, revenue, high_price, current_price, closing_price, diff_price, diff_rate, volume |
| vsl_krx_stocks_52wk_lowprice | 2,207 | date, corp_cls, asst_cls, corp_group, wics_name1, wics_name2, wics_name3, stock_code, stock_name, revenue, low_price, current_price, closing_price, diff_price, diff_rate, volume |
| vsl_krx_stocks_cap | 662,461 | date, corp_cls, asst_cls, corp_group, wics_name1, wics_name2, wics_name3, stock_code, stock_name, revenue, cap, number_shares |
| vsl_krx_stocks_foreign_shares_info | 3,180,295 | date, corp_cls, asst_cls, corp_group, wics_name1, wics_name2, wics_name3, stock_code, stock_name, revenue, share_ownership_foreign, shareholding_ratio_foreign, limit_quantity_foreign, exhaustion_rate_foreign |
| vsl_krx_stocks_fundamental_info | 2,973,136 | date, corp_cls, asst_cls, corp_group, wics_name1, wics_name2, wics_name3, stock_code, stock_name, revenue, bps, per, eps, div, dps |
| vsl_krx_stocks_investor_shares_trading_info | 4,747,990 | date, investor, corp_cls, asst_cls, corp_group, wics_name1, wics_name2, wics_name3, stock_code, stock_name, revenue, sell_trade_vol, buy_trade_vol, net_trade_vol, sell_trade_amt, buy_trade_amt, net_trade_amt |
| vsl_krx_stocks_ohlcv | 662,461 | date, corp_cls, asst_cls, corp_group, wics_name1, wics_name2, wics_name3, stock_code, stock_name, revenue, open, high, low, close, volume, trade_value, day_range |
| vsl_krx_stocks_short_selling | 2,722,063 | date, corp_cls, asst_cls, corp_group, wics_name1, wics_name2, wics_name3, stock_code, stock_name, revenue, short_selling, remaining_quantity, short_selling_amount, balance_amount |
| vsl_macd_btm_supply | 665 | date, stock_code, stock_name, close, volume, trade_value, val_rank, prdy_ctrt, prg_vol_ratio, whol_smtn_ntby_qty, whol_smtn_ntby_tr_pbmn, frgn_ntby_qty, orgn_ntby_qty, sum_fake_ntby_qty, hist, z_score, val_top300, supply_buy, prg_accum_signal, abc_all, inv_strat, inv_strat_dtl, etl_dttm |
| vsl_macd_buy_daily | 1,047 | date, code, name, close, pct_chng, trade_value, program_trade_value, macd, signal, hist_prev2, hist_prev1, hist, rsi, rsi_signal |
| vsl_naver_theme | 9,189,386 | date, theme_code, theme_name, stock_code, stock_name, open, high, low, close, volume, trade_value, cls_chg, cls_chg_rt, vol_chg, vol_chg_rt, amt_chg, amt_chg_rt, cap, number_shares |
| vsl_naver_theme_rotation | 414,914 | date, theme_name, chg_dir, chg_rate, rank, volume, trade_value, cap |
| vsl_pubdata_ceo_inq | 9,428 | date, corp_cls, asst_cls, corp_group, wics_name1, wics_name2, wics_name3, stock_code, stock_name, revenue, crno, corpnm, ceobornym, ceochrgbzwrctt, ceofnm, ceohdftermctt, ceojbttnm, ceomaincrrctt, ceotrmxprydt, fltmsvyn, maxsthdrltnm, ownonskcnt, ownpfstcnt, rgstexutyn, sexcd, sexcdnm |
| vsl_pubdata_exec_comp | 3,097 | date, corp_cls, asst_cls, corp_group, wics_name1, wics_name2, wics_name3, stock_code, stock_name, revenue, crno, audpnavgrmramt, corpaudtnopecnt, audtrmkctt, audpntrmramt, otdravgrmramt, otdrcnt, otdrrmkctt, otdrtrmramt, rgstdrtravgrmramt, rgstdrtrcnt, rgstdrtrrmkctt, rgstdrtrtrmramt |
| vsl_pubdata_exec_info | 179,992 | date, corp_cls, asst_cls, corp_group, wics_name1, wics_name2, wics_name3, stock_code, stock_name, revenue, crno, datasqno, exutbornym, exutchrgbzwrnm, exutfnm, exuthdftermctt, exutjbttnm, exutjbttxprydt, exutmaincrrctt, exutownonskcnt, exutownpfstcnt, fltmsvctt, fltmsvyn, ownonskcnt, ownpfstcnt, rgstexutctt, rgstexutyn, sexcd, sexcdnm |
| vsl_pubdata_fcommission_corpgov_shareholder | 591,034 | date, corp_cls, asst_cls, corp_group, wics_name1, wics_name2, wics_name3, stock_code, stock_name, revenue, crno, sthdsqno, sthdfnm, maxsthdrltnm, stckcsfnm, sthdeoteshrratctt, sthdeotestckcnt |
| vsl_stocks_price_subindex | ? | date, stock_code, stock_price, pcl, pvt, macd, signal, momentum, volume, volume_std20, volume_ma20, upper_band, lower_band |
| vsl_stocks_swing_strat_daily | 2,051,578 | prev_local_high, local_high, condition_count, next_high_max, prev_high_max, lag1_ma20, lag1_close, daily_ma20, daily_ma10, daily_ma5, volume, close, low, high, open, cap, size, stock_name, stock_code, daily_date, bs_signal, box_ma5 |
| vsl_stocks_swing_strat_nullim | 3 | daily_ma20, daily_ma10, daily_ma5, daily_close, pullback_date, base_date, signal, stock_name, stock_code, box_section, bs_signal |
| vsl_stocks_swing_strat_nullim_w | ? | base_date, pullback_date, stock_code, stock_name, weekly_close, signal, bs_signal, weekly_ma5, weekly_ma10, weekly_ma20 |
| vsl_stocks_swing_strat_weekly | 322,422 | weekly_date, stock_code, stock_name, size, cap, weekly_open, weekly_high, weekly_low, weekly_close, weekly_volume, weekly_ma5, weekly_ma10, weekly_ma20, prev_close, prev_ma20, ma20_deviation, is_bouncing, local_weekly_high, prev_local_weekly_high, bs_signal |
| vsl_swing_sale | 61 | date, de_20_date, de_5060_date, wics_name, stock_code, stock_name, sort_clsf, buy2, opt2, cap |
| vsl_swing_sale2 | 255 | lbc_date, date, stock_code, stock_name, ma_sort_clsf, buy_reason, d_close, start_date, low_prc |

---

