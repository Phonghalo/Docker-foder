import './App.css'
import {
  Box,
  Button, Card, Checkbox,
  createTheme, FormControlLabel,
  Grid, IconButton,
  Paper,
  Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tabs, TextField,
  ThemeProvider,
} from "@mui/material";
import './masterUI.css'
import React from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import AddIcon from '@mui/icons-material/Add';
import * as z from "zod";
import {DeleteOutline} from "@mui/icons-material";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h2',
          h2: 'h2',
          h3: 'h2',
          h4: 'h2',
          h5: 'h2',
          h6: 'h2',
          subtitle1: 'h2',
          subtitle2: 'h2',
          body1: 'span',
          body2: 'span',
        },
      },
    },
  },
});
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{padding: '16px'}}>
          {children}
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
interface registerInput {
  campaign: {
    information: {
      name: string
      describe: string
    },
    subCampaigns: {
      name: string,
      status: boolean,
      ads: {
        name: string,
        quantity: string
      }[]
    }[]
  },
}
function App() {
  const [tabActive, setTabActive] = React.useState<number>(0);
  const [cardActive, setCardActive] = React.useState<number>(0);
  const [selected, setSelected] = React.useState<number[]>([])
  const registerSchema = z.object({
    campaign: z.object({
      information: z.object({
        name: z.string().min(1, "Dư liệu không hợp lệ")
      }),
      subCampaign: z.object({
        name:  z.string().min(1, "Dư liệu không hợp lệ"),
        ads: z.object({
          name:  z.string().min(1, "")
        })
      })
    })
  })
  const defaultValue = {
    campaign: {
      information: {
        name: '',
        describe: '',
      },
      subCampaigns: [{
        name: 'Chiến dịch con 1',
        status: true,
        ads: [{
          name: 'Quảng cáo 1',
          quantity: '0',
        }
]      }]
    },
  }
  const {
    control,
    register,
    setValue,
    watch,
    formState: {errors},
    handleSubmit,
  } = useForm<registerInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: defaultValue
  });
  const {update} = useFieldArray({
    control: control,
    name: 'campaign.subCampaigns'
  })
  const {update: updateAds} = useFieldArray({
    control: control,
    name: `campaign.subCampaigns.${cardActive}.ads`
  })
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabActive(newValue);
  };
  const handleChecked = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  }
  const onSelectAllClick = () => {
    const totalRows = watch(`campaign.subCampaigns.${cardActive}.ads`).length
    if(selected.length == totalRows) {
      setSelected([])
    } else {
      let arrActive = [];
      for(let i = 0; i < totalRows; i++){
        arrActive[i] = i
      }
      console.log(arrActive)
      setSelected(arrActive)
    }
  }
  const isCheckedFunc = (id: number) => {
    return selected.includes(id)
  }
  const handleDeleteAds = (id: number[]) => {
    const dataAds = watch(`campaign.subCampaigns.${cardActive}.ads`)
    const dataDelete = id.map(x => dataAds.slice(x, x + 1)[0])
    const newData = dataDelete.reduce((previousValue , currentValue) => {
      const currentReturn = dataAds.filter(de => de.name != currentValue.name)
      return [...previousValue, ...currentReturn]
    },[] as {name: string, quantity: string}[])
    setValue(`campaign.subCampaigns.${cardActive}.ads`, newData)
  }
  const onSubmit = (data: any) => {
    console.log(data)
  }
  console.log(errors)
  return (
    <ThemeProvider theme={theme}>
      <form style={{width: '100%'}} onSubmit={handleSubmit(onSubmit)}>
      <Grid container style={{paddingTop: '20px'}}>
        <Grid item style={{borderBottom: '1px solid gray'}} xs={12}>
          <Box className='styleBox'>
            <Button type={'submit'} variant="contained" >Submit</Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container style={{flexGrow: '1', padding: '24px', width: '100%'}}>
        <Grid item xs={12}>
          <Paper elevation={1}>
            <Tabs value={tabActive} onChange={handleChange} aria-label="campaign tabs">
              <Tab wrapped label="THÔNG TIN" {...a11yProps(0)}/>
              <Tab wrapped label="CHIẾN DỊCH CON" {...a11yProps(0)}/>
            </Tabs>
              <CustomTabPanel value={tabActive} index={0}>
                <Grid spacing={2} container>
                  <Grid item xs={12}>
                    <TextField
                      {...register('campaign.information.name')}
                      id="standard-password-input"
                      label="Tên chiến dịch*"
                      variant="standard"
                      style={{width: '100%', margin: '8px'}}
                      error={!!errors.campaign?.information?.name?.message}
                      helperText={errors.campaign?.information?.name?.message}
                    />
                    <TextField
                      {...register('campaign.information.describe')}
                      id="standard-password-input"
                      label="Mô tả"
                      variant="standard"
                      style={{width: '100%', margin: '8px'}}
                    />
                  </Grid>
                </Grid>
              </CustomTabPanel>
              <CustomTabPanel value={tabActive} index={1}>
                <Grid container>
                  <Grid item style={{position: "relative", width: '100%', overflow: 'hidden', overflowX: watch('campaign.subCampaigns').length > 8 ? 'scroll' : undefined}}>
                    <div style={{display: 'flex', flexDirection: 'row', width: 'fit-content'}}>
                      <div>
                        <IconButton
                          onClick={() => update(watch('campaign.subCampaigns').length, {name: `Chiến dịch con ${watch('campaign.subCampaigns').length + 1}`, status: true, ads: [{name: 'Quonag cao', quantity: '0'}]} ) }
                          color='secondary'
                          style={{
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            background: 'rgb(237, 237, 237)'
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </div>
                      {watch('campaign.subCampaigns').map((campaign, index) => (
                        <Card
                          key={index}
                          onClick={() => setCardActive(index)}
                          style={{width: '210px', height: '120px', marginLeft: '16px', cursor: 'pointer', border: '2px solid rgb(33, 150, 243)'}}
                        >
                          {campaign.name}
                        </Card>
                      ))}
                    </div>
                  </Grid>
                  <Grid item xs={12} style={{marginTop: '16px'}}>
                    <Grid container style={{padding: '8px 8px 0px'}}>
                      <Grid item xs={8} style={{padding: '8px'}}>
                        <TextField
                          {...register(`campaign.subCampaigns.${cardActive}.name`)}
                          id="standard-password-input"
                          value={watch(`campaign.subCampaigns.${cardActive}.name`)}
                          label="Tên chiến dịch"
                          variant="standard"
                          style={{width: '100%', margin: '8px'}}
                          required
                          error={errors.campaign?.subCampaigns && !!errors.campaign?.subCampaigns[cardActive]?.name?.message}
                          helperText={errors.campaign?.subCampaigns && !!errors.campaign?.subCampaigns[cardActive]?.name?.message}
                        />
                      </Grid>
                      <Grid item xs={4} style={{padding: '4px', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                        <FormControlLabel
                          label="Đang hoạt động"
                          style={{marginTop: '6px'}}
                          control={
                            <Checkbox
                              {...register(`campaign.subCampaigns.${cardActive}.status`)}
                              checked={watch(`campaign.subCampaigns.${cardActive}.status`)}
                            />
                          }
                        />
                      </Grid>
                      <TableContainer style={{overflowX: 'clip'}}>
                        <Table
                          sx={{ minWidth: 750 }}
                          size={'medium'}
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  color="primary"
                                  indeterminate={selected.length > 0 && selected.length < watch(`campaign.subCampaigns.${cardActive}.ads`).length}
                                  checked={selected.length > 0 && selected.length == watch(`campaign.subCampaigns.${cardActive}.ads`).length}
                                  onChange={onSelectAllClick}
                                  inputProps={{
                                    'aria-label': 'select all desserts',
                                  }}
                                />
                              </TableCell>
                              {selected.length <= 0 ? (
                                <>
                                  <TableCell>
                                    Tên quảng cáo*
                                  </TableCell>
                                  <TableCell>
                                    Số lượng*
                                  </TableCell></>
                              ) : (
                                <>
                                  <TableCell >
                                    <DeleteOutline />
                                  </TableCell>
                                  <TableCell></TableCell>
                                </>
                              )}
                              <TableCell
                                align={'right'}
                                scope={'colspan'}
                              >
                                <Button
                                  startIcon={<AddIcon/>}
                                  style={{border: '1px solid'}}
                                  onClick={() => updateAds(watch(`campaign.subCampaigns.${cardActive}.ads`).length, {name: `Quảng cáo ${watch(`campaign.subCampaigns.${cardActive}.ads`).length + 1}`, quantity: "0"})}
                                >
                                  Thêm
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {watch(`campaign.subCampaigns.${cardActive}.ads`).map((_ad, index) => {
                              return (
                                <TableRow
                                  hover
                                  key={index}
                                >
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                      checked={isCheckedFunc(index)}
                                      onClick={(e) => handleChecked(e, index)}
                                    />
                                  </TableCell>
                                  <TableCell  padding="none" style={{padding: '8px'}}>
                                    <TextField
                                      {...register(`campaign.subCampaigns.${cardActive}.ads.${index}.name`)}
                                      id="standard-password-input"
                                      value={watch(`campaign.subCampaigns.${cardActive}.ads.${index}.name`)}
                                      variant="standard"
                                      style={{width: '100%', margin: '8px'}}
                                      error={watch(`campaign.subCampaigns.${cardActive}.ads.${index}.name`).trim().length < 1}
                                    />
                                  </TableCell>
                                  <TableCell  padding="none" style={{padding: '8px'}}>
                                    <TextField
                                      {...register(`campaign.subCampaigns.${cardActive}.ads.${index}.quantity`)}
                                      id="standard-password-input"
                                      type={"tel"}
                                      value={watch(`campaign.subCampaigns.${cardActive}.ads.${index}.quantity`)}
                                      variant="standard"
                                      style={{width: '100%', margin: '8px'}}
                                      error={!Number(watch(`campaign.subCampaigns.${cardActive}.ads.${index}.quantity`))}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <DeleteOutline style={{cursor: 'pointer'}} onClick={() => handleDeleteAds([index])} />
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </Grid>
              </CustomTabPanel>
          </Paper>
        </Grid>
      </Grid>
      </form>
    </ThemeProvider>
  )
}

export default App
